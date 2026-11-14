import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import { dashboardService } from '../services/dashboardService';
import { DashboardData } from '@/domain/models/dashboard.model';

export function useDashboardQuery() {
  const { user, profile } = useAuthStore();
  const queryClient = useQueryClient();

  const userId = user?.id || 'guest';

  const query = useQuery<DashboardData, Error>({
    queryKey: ['dashboard', userId, profile?.updated_at],
    queryFn: async () => {
      return dashboardService.getDashboardData(userId, profile);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
  });

  const invalidateDashboard = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard', userId] });
  };

  return {
    ...query,
    invalidateDashboard,
  };
}

