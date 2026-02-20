import { Queue, Worker, type ConnectionOptions } from 'bullmq';

const connection: ConnectionOptions = {
  host: process.env.REDIS_URL ? undefined : 'localhost',
  port: process.env.REDIS_URL ? undefined : 6379,
  url: process.env.REDIS_URL,
};

export const crawlQueue = new Queue('crawl', { connection });
export const analysisQueue = new Queue('analysis', { connection });
export const reportQueue = new Queue('report', { connection });

export { connection };
