import { useQuery } from '@tanstack/react-query';
import { fetchPerformances } from '@/apis/Performances.api';
import { useEffect, useState } from 'react';

export interface IPerformancePayload {
  CODENAME: string; // 분류
  GUNAME: string; // 자치구
  TITLE: string; // 공연/행사명
  DATE: string; // 날짜/시간
  PLACE: string; // 장소
  ORG_NAME: string; // 기관명
  USE_TRGT: string; // 이용 대상
  USE_FEE: string; // 이용 요금
  PLAYER: string; // 출연자 정보
  PROGRAM: string; // 프로그램 소개
  ETC_DESC: string; // 기타 내용
  ORG_LINK: string; // 홈페이지 주소
  MAIN_IMG: string; // 대표 이미지
  RGSTDATE: string; // 신청일
  TICKET: string; // 시민/기관
  STRTDATE: string; // 시작일
  END_DATE: string; // 종료일
  THEMECODE: string; // 테마분류
  LOT: string; // 위도(x좌표)
  LAT: string; // 경도(y좌표)
  IS_FREE: string; // 유무료
  HMPG_ADDR: string; // 문화포털상세URL
}

export const usePerformances = () => {
  const {
    data: performances,
    isLoading,
    isError,
    refetch,
  } = useQuery<IPerformancePayload[]>({
    queryKey: ['performances'],
    queryFn: fetchPerformances,
  });

  return { performances, isLoading, isError, refetch };
};
