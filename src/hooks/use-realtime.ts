"use client"
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useRealtime(table: string, filter: string, callback: (payload: unknown) => void) {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`${table}-changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table, filter }, (payload) => {
        callback(payload);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [table, filter, callback]);
}
