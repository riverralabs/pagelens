import { Worker, type Job } from 'bullmq';
import { connection } from '@/lib/queue';
import prisma from '@/lib/prisma';
import { generateReport } from '@/services/ai-analyzer.service';
import { generateExcelReport } from '@/services/report.service';
import { uploadReport, generateReportKey } from '@/services/storage.service';
import { randomUUID } from 'crypto';

interface ReportJobData {
  analysisId: string;
}

export const reportWorker = new Worker<ReportJobData>(
  'report',
  async (job: Job<ReportJobData>) => {
    const { analysisId } = job.data;

    try {
      const analysis = await prisma.analysis.findUnique({
        where: { id: analysisId },
        include: {
          project: true,
          pageResults: {
            include: {
              findings: { include: { recommendation: true } },
              screenshots: true,
            },
          },
        },
      });

      if (!analysis) throw new Error('Analysis not found');

      // Generate report narrative via Claude
      const reportContent = await generateReport({
        projectName: analysis.project.name,
        url: analysis.project.url,
        overallScore: analysis.overallScore,
        scores: analysis.scores,
        pages: analysis.pageResults.map((p) => ({
          url: p.url,
          title: p.title,
          scores: p.scores,
          overallScore: p.overallScore,
          findings: p.findings,
        })),
      });

      // Generate Excel
      const excelBuffer = await generateExcelReport({
        projectName: analysis.project.name,
        url: analysis.project.url,
        overallScore: analysis.overallScore || 0,
        scores: (analysis.scores as Record<string, number> as unknown as import('@/types/analysis').AnalysisScores) || { visual: 0, copywriting: 0, ux: 0, conversion: 0, seo: 0, images: 0 },
        pages: analysis.pageResults.map((p) => ({
          url: p.url,
          title: p.title || '',
          overallScore: p.overallScore || 0,
          scores: (p.scores as Record<string, number> as unknown as import('@/types/analysis').AnalysisScores) || { visual: 0, copywriting: 0, ux: 0, conversion: 0, seo: 0, images: 0 },
        })),
        findings: analysis.pageResults.flatMap((p) =>
          p.findings.map((f) => ({
            category: f.category,
            severity: f.severity,
            title: f.title,
            description: f.description,
            page: p.url,
          }))
        ),
        recommendations: reportContent.topRecommendations?.map((r) => ({
          priority: String(r.priority),
          action: r.action,
          impact: r.expectedImpact,
          effort: r.effort,
        })) || [],
      });

      const excelKey = generateReportKey(analysisId, 'xlsx');
      const excelUrl = await uploadReport(excelKey, excelBuffer, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

      // Create report record
      await prisma.report.create({
        data: {
          analysisId,
          excelR2Key: excelKey,
          excelUrl,
          shareToken: randomUUID(),
        },
      });

      // Mark analysis complete
      await prisma.analysis.update({
        where: { id: analysisId },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });
    } catch (error) {
      console.error('Report worker error:', error);
      // Still mark as completed even if report generation fails
      await prisma.analysis.update({
        where: { id: analysisId },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });
      throw error;
    }
  },
  { connection, concurrency: 1 }
);
