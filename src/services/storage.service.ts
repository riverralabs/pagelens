import { uploadToR2, getFromR2, deleteFromR2, R2_PUBLIC_URL } from '@/lib/r2';

export async function uploadScreenshot(key: string, buffer: Buffer): Promise<string> {
  return uploadToR2(key, buffer, 'image/png');
}

export async function uploadReport(key: string, buffer: Buffer, contentType: string): Promise<string> {
  return uploadToR2(key, buffer, contentType);
}

export async function getReportUrl(key: string): Promise<string> {
  return `${R2_PUBLIC_URL}/${key}`;
}

export async function deleteScreenshot(key: string): Promise<void> {
  return deleteFromR2(key);
}

export function generateScreenshotKey(analysisId: string, pageResultId: string, viewport: number): string {
  return `analyses/${analysisId}/screenshots/${pageResultId}_${viewport}.png`;
}

export function generateReportKey(analysisId: string, format: 'pdf' | 'xlsx'): string {
  return `analyses/${analysisId}/reports/report.${format}`;
}
