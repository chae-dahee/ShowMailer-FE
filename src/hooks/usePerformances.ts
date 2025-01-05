import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchPerformances } from '@/apis/Performances.api';

export interface IPerformancePayload {
  title?: string;
  image?: string | undefined;
  codename?: string;
  date?: string;
  org_link?: string;
  place?: string;
}

export const getPerformances = ({ codename, title }: IPerformancePayload) => {
  const { data, fetchNextPage, hasNextPage, refetch, isLoading, isError, error } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: ({ pageParam = 1 }) => fetchPerformances(codename, title, pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return allPages.length + 1;
    },
    initialPageParam: 1,
    select: (data) => ({
      pages: data.pages.map((page) =>
        page.map((item) => ({
          title: item.title,
          image: item.image,
          codename: item.codename,
          date: item.date,
        })),
      ),
      pageParams: data.pageParams,
    }),
  });
  return {
    performance: data?.pages.flat() || [],
    fetchNextPage,
    hasNextPage,
    refetch,
    isLoading,
    isError,
    error,
  };
};

export const getPerformance = ({ codename, title, date }: IPerformancePayload) => {
  const {
    data: performances = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<IPerformancePayload[]>({
    queryKey: ['performances', codename, title, date],
    queryFn: () => fetchPerformances(codename, title, undefined, date),
  });
  return { performances, isLoading, isError, refetch };
};
