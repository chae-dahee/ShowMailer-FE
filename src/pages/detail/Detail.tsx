import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPerformance, IPerformancePayload } from '@/hooks/usePerformances';
import { fetchPerformances } from '@/apis/Performances.api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '@/pages/detail/Detail.css';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useLikes } from '@/hooks/useLikes';

const Detail: React.FC = () => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  let { codename, title, date } = useParams<{ codename: string; title: string; date: string }>();

  const {
    performances = [],
    isLoading,
    isError,
    refetch,
  } = getPerformance({
    codename,
    title,
    date,
  });

  const { addLike, removeLike, checkLike } = useLikes();
  //좋아요 여부
  const { data: likedData } = checkLike(
    userInfo?.email || undefined,
    performances[0]?.codename,
    performances[0]?.date,
    performances[0]?.title,
  );

  useEffect(() => {
    if (likedData) {
      setIsLiked(likedData);
    }
  }, [likedData]);

  // 사용자 정보를 상위 컴포넌트에서 관리
  const handleUserChange = (user: User | null) => {
    setUserInfo(user);
  };

  //홈페이지 url 이동
  const handleButtonClick = () => {
    const performance = performances[0];
    if (performance.org_link) {
      window.open(performance.org_link, '_blank');
    } else {
      alert('공식 링크가 없습니다.');
    }
  };

  //like
  //add,remove
  const handleHeartClick = () => {
    if (userInfo) {
      const payload = {
        email: userInfo.email || undefined,
        codename: performance.codename!,
        date: performance.date!,
        title: performance.title!,
        image: performance.image!,
      };

      if (isLiked) {
        removeLike({
          email: userInfo.email || undefined,
          codename: performance.codename!,
          date: performance.date!,
          title: performance.title!,
        }); // 채워진 하트일 경우 removeLike API 호출
        setIsLiked(false); // 하트 상태를 빈 상태로 변경
        console.log('좋아요 삭제');
      } else {
        addLike(payload); // 빈 하트일 경우 addLike API 호출
        setIsLiked(true); // 하트 상태를 채워진 상태로 변경
        console.log('좋아요 추가');
      }
      setIsLiked(!isLiked); // 하트 상태 토글
    } else {
      toast.error('로그인하고 좋아요를 눌러주세요!');
    }
  };

  // 로딩 및 에러 상태 처리
  if (isLoading)
    return (
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  if (isError) return <div>데이터를 불러오는 데 문제가 발생했습니다.</div>;

  // 공연 정보가 없거나, performances 배열이 비어있는 경우 처리
  if (performances.length === 0) return <div>공연 정보를 찾을 수 없습니다.</div>;

  const performance = performances[0];

  return (
    <>
      <div className="detailContainer">
        <img className="Poster" src={performance.image} alt="Poster" />
        <div className="eventText">
          <h2>{performance.title}</h2>
          <div className="heartContainer" onClick={handleHeartClick} style={{ cursor: 'pointer' }}>
            {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
            <span>좋아요 이메일 알림받기</span>
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              theme="dark"
              limit={1}
              style={{ fontSize: '15px' }}
            />
          </div>
          <p>카테고리: {performance.codename}</p>
          <p>기간: {performance.date}</p>
          <p>장소: {performance.place}</p>
        </div>
      </div>
      <button type="button" className="goPageBtn" onClick={handleButtonClick}>
        홈페이지 바로 가기
      </button>
    </>
  );
};

export default Detail;
