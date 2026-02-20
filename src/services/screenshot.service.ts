import { VIEWPORTS } from '@/lib/constants';

export interface ScreenshotResult {
  viewport: number;
  buffer: Buffer;
  width: number;
  height: number;
  fileSize: number;
}

export function processScreenshots(
  screenshots: { viewport: number; buffer: Buffer; width: number; height: number }[]
): ScreenshotResult[] {
  return screenshots.map((s) => ({
    ...s,
    fileSize: s.buffer.length,
  }));
}

export function generateScreenshotKey(analysisId: string, pageResultId: string, viewport: number): string {
  return `analyses/${analysisId}/screenshots/${pageResultId}_${viewport}.png`;
}
