import { useSelector } from 'react-redux'
import type { RootState } from '../redux/store'

export function usePlan() {
  const user = useSelector((state: RootState) => state.auth.user)
  const plan = user?.plan ?? 'free'
  const isPremium = plan === 'premium'

  return {
    plan,
    isPremium,
    // Feature gates
    maxNominees: isPremium ? Infinity : 2,
    maxExecutors: isPremium ? Infinity : 1,
    canShareWill: isPremium,
    canUseAIAdvisor: isPremium,
    canViewFullActivity: isPremium,
  }
}
