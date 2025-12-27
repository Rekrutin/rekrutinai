
import { UserProfile } from '../types';
import { 
    MAX_FREE_JOBS, 
    MAX_FREE_ATS_SCANS, 
    MAX_FREE_EXTENSION_USES,
    MAX_FREE_RECOMMENDATIONS
} from '../constants';

export const useSubscription = (profile: UserProfile, jobCount: number = 0) => {
  const isPaid = profile.plan === 'Pro' || profile.plan === 'Accelerator' || profile.plan === 'Career+' || profile.plan === 'Elite';
  const isFree = profile.plan === 'Free';
  const isQuarterly = profile.plan === 'Accelerator';
  
  return {
    plan: profile.plan,
    isPro: isPaid,
    isFree,
    isQuarterly,
    canTrackJob: isPaid || jobCount < MAX_FREE_JOBS,
    canUseAI: isPaid || profile.atsScansUsed < MAX_FREE_ATS_SCANS,
    canViewAdvancedAnalytics: isPaid,
    canUseExtension: isPaid || (profile.extensionUses || 0) < MAX_FREE_EXTENSION_USES,
    canSeeSuccessProbability: isPaid,
    hasEarlyAccess: isPaid,
    // Limits
    maxJobs: isPaid ? Infinity : MAX_FREE_JOBS,
    maxScans: isPaid ? Infinity : MAX_FREE_ATS_SCANS,
    maxExtensions: isPaid ? Infinity : MAX_FREE_EXTENSION_USES
  };
};
