import { IPerformancePayload } from '@/hooks/usePerformances';
import { httpClient } from './http';

export const fetchPerformances = async (
  codename?: string,
  title?: string,
  page?: number,
  date?: string,
): Promise<IPerformancePayload[]> => {
  const res = await httpClient.get<IPerformancePayload[]>(`/events`, {
    params: {
      codename,
      title,
      page,
      date,
    },
  });
  return res.data as IPerformancePayload[];
};

