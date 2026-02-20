import ExcelJS from 'exceljs';
import type { AnalysisScores, ReportContent } from '@/types/analysis';
import { SCORING_LABELS } from '@/lib/constants';

export async function generateExcelReport(data: {
  projectName: string;
  url: string;
  overallScore: number;
  scores: AnalysisScores;
  pages: { url: string; title: string; overallScore: number; scores: AnalysisScores }[];
  findings: { category: string; severity: string; title: string; description: string; page: string }[];
  recommendations: { priority: string; action: string; impact: string; effort: string }[];
}): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'PageLens';
  workbook.created = new Date();

  // Summary sheet
  const summary = workbook.addWorksheet('Summary');
  summary.columns = [
    { header: 'Metric', key: 'metric', width: 30 },
    { header: 'Score', key: 'score', width: 15 },
  ];
  summary.addRow({ metric: 'Project', score: data.projectName });
  summary.addRow({ metric: 'URL', score: data.url });
  summary.addRow({ metric: 'Overall Score', score: data.overallScore });
  summary.addRow({});
  for (const [key, label] of Object.entries(SCORING_LABELS)) {
    summary.addRow({ metric: label, score: data.scores[key as keyof AnalysisScores] || 0 });
  }

  // Pages sheet
  const pages = workbook.addWorksheet('Pages');
  pages.columns = [
    { header: 'URL', key: 'url', width: 50 },
    { header: 'Title', key: 'title', width: 40 },
    { header: 'Overall', key: 'overall', width: 10 },
    { header: 'Visual', key: 'visual', width: 10 },
    { header: 'Copy', key: 'copy', width: 10 },
    { header: 'UX', key: 'ux', width: 10 },
    { header: 'Conversion', key: 'conversion', width: 10 },
    { header: 'SEO', key: 'seo', width: 10 },
    { header: 'Images', key: 'images', width: 10 },
  ];
  for (const p of data.pages) {
    pages.addRow({
      url: p.url, title: p.title, overall: p.overallScore,
      visual: p.scores.visual, copy: p.scores.copywriting, ux: p.scores.ux,
      conversion: p.scores.conversion, seo: p.scores.seo, images: p.scores.images,
    });
  }

  // Findings sheet
  const findings = workbook.addWorksheet('Findings');
  findings.columns = [
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Severity', key: 'severity', width: 15 },
    { header: 'Title', key: 'title', width: 40 },
    { header: 'Description', key: 'description', width: 60 },
    { header: 'Page', key: 'page', width: 50 },
  ];
  for (const f of data.findings) { findings.addRow(f); }

  // Recommendations sheet
  const recs = workbook.addWorksheet('Recommendations');
  recs.columns = [
    { header: 'Priority', key: 'priority', width: 15 },
    { header: 'Action', key: 'action', width: 60 },
    { header: 'Expected Impact', key: 'impact', width: 30 },
    { header: 'Effort', key: 'effort', width: 15 },
  ];
  for (const r of data.recommendations) { recs.addRow(r); }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
