import React, { useEffect, useState } from 'react';
import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
  getIdToken,
} from 'firebase/auth';
import Cookies from 'js-cookie';

import '@/components/header/Header.css';
import { BsEnvelopeHeart } from 'react-icons/bs';
import { IoMdPerson } from 'react-icons/io';
import { FiLogIn } from 'react-icons/fi';
import { FiLogOut } from 'react-icons/fi';
import { app } from '@/firebase';

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        console.log(user);
        saveTokenToCookie();
        // console.log(userCredential);
        //서버에 user 데이터 전달, cookie에 저장
        //함수로 email, id, 이미지 전달
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        console.log('로그아웃 성공');
        window.location.href = '/';
      })
      .catch((error) => {
        console.error('로그아웃 실패', error);
      });
  };

  const saveTokenToCookie = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const idToken = await getIdToken(user);
        // 쿠키에 토큰 저장 (1시간 유효)
        Cookies.set('accessToken', idToken, { expires: 1 / 24 }); // expires: 1시간
        console.log('액세스 토큰 저장 완료');
      }
    } catch (error) {
      console.error('액세스 토큰 저장 실패', error);
    }
  };

  const gotoMypage = () => {
    if (user && user.displayName) {
      const displayName = encodeURIComponent(user.displayName);
      window.location.href = `/mypage?name=${displayName}`; // displayName을 쿼리스트링으로 넘김
    }
  };

  const urlSearchParams = new URLSearchParams(location.search);
  const displayNameParam = urlSearchParams.get('name');
  const isMypage = location.pathname === '/mypage' && displayNameParam !== null;

  return (
    <div className="Hcontainer">
      <BsEnvelopeHeart className="logo" />
      <p className="logoTitle">서울 문화공연 알리미</p>
      {isMypage ? (
        <FiLogOut className="logout" onClick={handleLogout} />
      ) : user ? (
        <IoMdPerson className="mypage" onClick={gotoMypage} />
      ) : (
        <FiLogIn className="login" onClick={handleLogin} />
      )}
    </div>
  );
};

export default Header;
