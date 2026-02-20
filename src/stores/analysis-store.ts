import { create } from 'zustand';
import type { AnalysisScores } from '@/types/analysis';

interface AnalysisState {
  currentAnalysisId: string | null;
  status: string | null;
  progress: {
    pagesFound: number;
    pagesCrawled: number;
    pagesAnalyzed: number;
  };
  overallScore: number | null;
  scores: AnalysisScores | null;
  setCurrentAnalysis: (id: string) => void;
  setStatus: (status: string) => void;
  setProgress: (progress: Partial<AnalysisState['progress']>) => void;
  setScores: (overallScore: number, scores: AnalysisScores) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>()((set) => ({
  currentAnalysisId: null,
  status: null,
  progress: {
    pagesFound: 0,
    pagesCrawled: 0,
    pagesAnalyzed: 0,
  },
  overallScore: null,
  scores: null,
  setCurrentAnalysis: (id) => set({ currentAnalysisId: id }),
  setStatus: (status) => set({ status }),
  setProgress: (progress) =>
    set((state) => ({
      progress: { ...state.progress, ...progress },
    })),
  setScores: (overallScore, scores) => set({ overallScore, scores }),
  reset: () =>
    set({
      currentAnalysisId: null,
      status: null,
      progress: { pagesFound: 0, pagesCrawled: 0, pagesAnalyzed: 0 },
      overallScore: null,
      scores: null,
    }),
}));
