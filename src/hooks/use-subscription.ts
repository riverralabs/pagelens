"use client"
import { useQuery } from '@tanstack/react-query';

async function fetchSubscription() {
  // Subscription data is fetched as part of user data
  // This is a placeholder for dedicated subscription fetching
  return null;
}

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: fetchSubscription,
  });
}
