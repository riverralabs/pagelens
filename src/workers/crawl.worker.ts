import { Worker, type Job } from 'bullmq';
import { connection } from '@/lib/queue';
import prisma from '@/lib/prisma';
import { crawlPage, discoverLinks, closeBrowser } from '@/services/crawler.service';
import { uploadScreenshot, generateScreenshotKey } from '@/services/storage.service';
import { classifyPageType } from '@/services/extractor.service';

interface CrawlJobData {
  analysisId: string;
  url: string;
  config: { crawlDepth: number; maxPages: number };
}

export const crawlWorker = new Worker<CrawlJobData>(
  'crawl',
  async (job: Job<CrawlJobData>) => {
    const { analysisId, url, config } = job.data;

    try {
      // Update status
      await prisma.analysis.update({
        where: { id: analysisId },
        data: { status: 'CRAWLING', startedAt: new Date() },
      });
      await prisma.crawlJob.update({
        where: { analysisId },
        data: { status: 'RUNNING', startedAt: new Date() },
      });

      // Discover pages
      const pages = await discoverLinks(url, config.crawlDepth, config.maxPages);
      const allUrls = [url, ...pages.filter((p) => p !== url)].slice(0, config.maxPages);

      await prisma.analysis.update({
        where: { id: analysisId },
        data: { pagesFound: allUrls.length },
      });
      await prisma.crawlJob.update({
        where: { analysisId },
        data: { pagesFound: allUrls.length },
      });

      // Crawl each page
      for (let i = 0; i < allUrls.length; i++) {
        const pageUrl = allUrls[i];
        try {
          const result = await crawlPage(pageUrl);

          // Create page result
          const pageResult = await prisma.pageResult.create({
            data: {
              analysisId,
              url: result.url,
              path: result.path,
              title: result.title,
              statusCode: result.statusCode,
              contentJson: result.content as unknown as Record<string, unknown>,
              pageType: classifyPageType(result.content, result.path),
            },
          });

          // Upload screenshots
          for (const screenshot of result.screenshots) {
            const key = generateScreenshotKey(analysisId, pageResult.id, screenshot.viewport);
            const r2Url = await uploadScreenshot(key, screenshot.buffer);
            await prisma.screenshot.create({
              data: {
                pageResultId: pageResult.id,
                viewport: screenshot.viewport,
                r2Key: key,
                r2Url,
                width: screenshot.width,
                height: screenshot.height,
                fileSize: screenshot.buffer.length,
              },
            });
          }

          await prisma.analysis.update({
            where: { id: analysisId },
            data: { pagesCrawled: i + 1 },
          });
          await prisma.crawlJob.update({
            where: { analysisId },
            data: { pagesCrawled: i + 1 },
          });
        } catch (error) {
          console.error(`Error crawling ${pageUrl}:`, error);
        }

        await job.updateProgress(((i + 1) / allUrls.length) * 100);
      }

      await prisma.crawlJob.update({
        where: { analysisId },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });

      await closeBrowser();
    } catch (error) {
      console.error('Crawl worker error:', error);
      await prisma.analysis.update({
        where: { id: analysisId },
        data: { status: 'FAILED', errorMessage: (error as Error).message },
      });
      await prisma.crawlJob.update({
        where: { analysisId },
        data: { status: 'FAILED' },
      });
      await closeBrowser();
      throw error;
    }
  },
  { connection, concurrency: 2 }
);
