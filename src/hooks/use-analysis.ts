"use client"
import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useAnalysisStore } from '@/stores/analysis-store';

async function fetchAnalysis(analysisId: string) {
  const res = await fetch(`/api/analyses/${analysisId}`);
  if (!res.ok) throw new Error('Failed to fetch analysis');
  return (await res.json()).data;
}

async function startAnalysis(projectId: string, config?: { crawlDepth?: number; maxPages?: number }) {
  const res = await fetch(`/api/projects/${projectId}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config || { crawlDepth: 2, maxPages: 50 }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to start analysis');
  }
  return (await res.json()).data;
}

export function useAnalysis(analysisId: string) {
  return useQuery({
    queryKey: ['analysis', analysisId],
    queryFn: () => fetchAnalysis(analysisId),
    enabled: !!analysisId,
  });
}

export function useStartAnalysis() {
  return useMutation({ mutationFn: ({ projectId, config }: { projectId: string; config?: { crawlDepth?: number; maxPages?: number } }) => startAnalysis(projectId, config) });
}

export function useAnalysisSSE(analysisId: string | null) {
  const { setStatus, setProgress, setScores } = useAnalysisStore();
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!analysisId) return;

    const es = new EventSource(`/api/analyses/${analysisId}/status`);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setStatus(data.status);
        setProgress({
          pagesFound: data.pagesFound,
          pagesCrawled: data.pagesCrawled,
          pagesAnalyzed: data.pagesAnalyzed,
        });
        if (data.overallScore && data.scores) {
          setScores(data.overallScore, data.scores);
        }
        if (data.status === 'COMPLETED' || data.status === 'FAILED') {
          es.close();
        }
      } catch {}
    };

    es.onerror = () => { es.close(); };

    return () => { es.close(); };
  }, [analysisId, setStatus, setProgress, setScores]);
}
