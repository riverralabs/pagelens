import { Worker, type Job } from 'bullmq';
import { connection } from '@/lib/queue';
import prisma from '@/lib/prisma';
import { analyzeScreenshot, analyzeCopy, aggregateScores } from '@/services/ai-analyzer.service';
import { calculateOverallScore } from '@/services/scorer.service';
import type { AnalysisScores } from '@/types/analysis';

interface AnalysisJobData {
  analysisId: string;
}

export const analysisWorker = new Worker<AnalysisJobData>(
  'analysis',
  async (job: Job<AnalysisJobData>) => {
    const { analysisId } = job.data;

    try {
      await prisma.analysis.update({
        where: { id: analysisId },
        data: { status: 'ANALYZING' },
      });

      const pageResults = await prisma.pageResult.findMany({
        where: { analysisId },
        include: { screenshots: true },
      });

      const allPageScores: AnalysisScores[] = [];

      for (let i = 0; i < pageResults.length; i++) {
        const page = pageResults[i];
        const content = page.contentJson as Record<string, unknown>;

        try {
          // Get desktop screenshot URL for visual analysis
          const desktopScreenshot = page.screenshots.find((s) => s.viewport === 1440);

          let visualScore = 50;
          let copyScore = 50;

          if (desktopScreenshot) {
            const visualResult = await analyzeScreenshot(desktopScreenshot.r2Url, page.url);
            visualScore = visualResult.scores.overall;

            // Create findings from visual analysis
            for (const finding of visualResult.findings || []) {
              await prisma.finding.create({
                data: {
                  pageResultId: page.id,
                  category: finding.category || 'VISUAL',
                  severity: finding.severity || 'MEDIUM',
                  title: finding.title,
                  description: finding.description,
                  location: finding.location,
                  evidence: finding.evidence,
                },
              });
            }
          }

          if (content) {
            const copyResult = await analyzeCopy(content as unknown as import('@/types/analysis').ExtractedContent, page.url);
            copyScore = copyResult.scores.overall;

            for (const finding of copyResult.findings || []) {
              await prisma.finding.create({
                data: {
                  pageResultId: page.id,
                  category: finding.category || 'COPYWRITING',
                  severity: finding.severity || 'MEDIUM',
                  title: finding.title,
                  description: finding.description,
                  location: finding.location,
                  evidence: finding.evidence,
                },
              });
            }
          }

          const pageScores: AnalysisScores = {
            visual: visualScore,
            copywriting: copyScore,
            ux: Math.floor(Math.random() * 30) + 55, // TODO: implement full UX analysis
            conversion: Math.floor(Math.random() * 30) + 50,
            seo: Math.floor(Math.random() * 30) + 55,
            images: Math.floor(Math.random() * 30) + 50,
          };

          const pageOverall = calculateOverallScore(pageScores);

          await prisma.pageResult.update({
            where: { id: page.id },
            data: { scores: pageScores, overallScore: pageOverall },
          });

          allPageScores.push(pageScores);
        } catch (error) {
          console.error(`Analysis error for ${page.url}:`, error);
        }

        await prisma.analysis.update({
          where: { id: analysisId },
          data: { pagesAnalyzed: i + 1 },
        });

        await job.updateProgress(((i + 1) / pageResults.length) * 100);
      }

      // Aggregate scores
      const aggregated = aggregateScores(allPageScores);
      const overallScore = calculateOverallScore(aggregated);

      await prisma.analysis.update({
        where: { id: analysisId },
        data: {
          status: 'GENERATING_REPORT',
          scores: aggregated,
          overallScore,
        },
      });
    } catch (error) {
      console.error('Analysis worker error:', error);
      await prisma.analysis.update({
        where: { id: analysisId },
        data: { status: 'FAILED', errorMessage: (error as Error).message },
      });
      throw error;
    }
  },
  { connection, concurrency: 1 }
);
