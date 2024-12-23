import React, { useEffect, useState } from 'react';

import '@/pages/mypage/Mypage.css';
import { User } from 'firebase/auth';
import Content from '@/components/Content';
import { Link } from 'react-router-dom';
import { useLikes } from '@/hooks/useLikes';

const Mypage = () => {
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const { getLikes } = useLikes();

  const handleUserChange = (user: User | null) => {
    setUserInfo(user);
  };

  const { data: allPerformances = [], isLoading, error } = getLikes(userInfo?.email || undefined);

  return (
    <>
      <div className="mypageContainer">
        {userInfo && userInfo.displayName ? <h3>{userInfo.displayName} 님이 좋아하신 공연</h3> : <Link to="/" />}
        {isLoading && <p>Loading...</p>}
        {error && <p>오류가 발생했습니다: {error.message}</p>}
        <Content performances={allPerformances} />
      </div>
    </>
  );
};

export default Mypage;
