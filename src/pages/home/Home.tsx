import { startTransition, useCallback, useState } from 'react';
import '@/pages/home//Home.css';
import Filter from '@/components/Filter';
import Content from '@/components/Content';
import useIntersect from '@/hooks/useIntersect';
import { getPerformances } from '@/hooks/usePerformances';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { performance, fetchNextPage, hasNextPage, refetch, isLoading, isError, error } = getPerformances({
    codename: selectedCategory.includes(`/`) ? selectedCategory.split(`/`)[0] : selectedCategory || undefined,
    title: searchTerm || undefined,
  });

  const target = useIntersect({
    hasNextPage,
    fetchNextPage,
  });

  // 카테고리 변경 핸들러
  const handleCategoryChange = useCallback(
    (category: string) => {
      startTransition(() => {
        setSelectedCategory(category === '전체' ? '' : category);
        setSearchTerm('');
      });
      refetch();
    },
    [refetch],
  );

  // 검색어 변경 핸들러
  const handleSearchChange = useCallback(
    (term: string) => {
      startTransition(() => {
        setSearchTerm(term);
      });
      refetch();
    },
    [refetch],
  );

  //  에러 상태 처리
  if (isError) {
    return (
      <div>
        데이터 불러오는 데 문제가 발생했습니다.
        <p>{error instanceof Error ? error.message : '알 수 없는 오류'}</p>
      </div>
    );
  }

  return (
    <>
      <div className="banner">
        서울시에서 열리는
        <br />
        <span className="highlight">공연, 전시, 콘서트, 연극</span>까지!
        <br />
        한번에 모아서 확인하고,
        <br />
        <span className="highlight">좋아요</span>로 <span className="highlight">이메일 알림</span> 받고!
        <br />
        <span className="highlight">캘린더 일정</span>까지
        <br />
        한번에 <span className="highlight">Show Mailer</span>로 관리해요!
      </div>
      <div className="container">
        <Filter
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          onSearchChange={handleSearchChange}
        />
        <Content performances={performance} target={target} hasNextPage={hasNextPage} isLoading={isLoading} />
      </div>
    </>
  );
};

export default Home;
