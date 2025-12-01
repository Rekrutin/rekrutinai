
import { UserProfile } from '../types';
import { MAX_FREE_JOBS, MAX_FREE_ATS_SCANS } from '../constants';

export const useSubscription = (profile: UserProfile, jobCount: number = 0) => {
  const isPro = profile.plan === 'Pro' || profile.plan === 'Career+' || profile.plan === 'Elite';
  const isFree = profile.plan === 'Free';
  const isCareerPlus = profile.plan === 'Career+' || profile.plan === 'Elite';
  
  return {
    plan: profile.plan,
    isPro,
    isFree,
    isCareerPlus,
    canTrackJob: isPro || jobCount < MAX_FREE_JOBS,
    canUseAI: isPro || profile.atsScansUsed < MAX_FREE_ATS_SCANS,
    canViewAdvancedAnalytics: isPro,
    canUseExtension: isPro,
    canSeeSuccessProbability: isPro,
    hasEarlyAccess: isPro,
    // Limits
    maxJobs: isPro ? Infinity : MAX_FREE_JOBS,
    maxScans: isPro ? Infinity : MAX_FREE_ATS_SCANS
  };
};
