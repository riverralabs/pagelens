import { SCORING_WEIGHTS } from '@/lib/constants';
import type { AnalysisScores } from '@/types/analysis';

export function calculateOverallScore(scores: AnalysisScores): number {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const [category, weight] of Object.entries(SCORING_WEIGHTS)) {
    const score = scores[category as keyof AnalysisScores];
    if (score !== undefined) {
      weightedSum += score * weight;
      totalWeight += weight;
    }
  }

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

export function getScoreGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

export function compareScores(current: AnalysisScores, previous: AnalysisScores): Record<string, number> {
  const diff: Record<string, number> = {};
  for (const key of Object.keys(current) as (keyof AnalysisScores)[]) {
    diff[key] = (current[key] || 0) - (previous[key] || 0);
  }
  return diff;
}
