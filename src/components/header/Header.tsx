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
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const location = useLocation();

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
        saveTokenToCookie();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        navigate('/');
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
        // expires: 1시간
        Cookies.set('accessToken', idToken, { expires: 1 / 24 });
      }
    } catch (error) {
      console.error('액세스 토큰 저장 실패', error);
    }
  };

  const gotoMypage = () => {
    if (user && user.displayName) {
      const displayName = encodeURIComponent(user.displayName);
      navigate(`/mypage?name=${displayName}`);
    }
  };

  const urlSearchParams = new URLSearchParams(location.search);
  const displayNameParam = urlSearchParams.get('name');
  const isMypage = location.pathname === '/mypage' && displayNameParam !== null;

  return (
    <div className="Hcontainer">
      <Link to="/">
        <BsEnvelopeHeart className="logo" />
      </Link>
      <Link to="/" className="logoTitle">
        서울 문화공연 알리미
      </Link>
      {isMypage ? (
        <FiLogOut className="logoutIcon" onClick={handleLogout} />
      ) : user ? (
        <IoMdPerson className="mypageIcon" onClick={gotoMypage} />
      ) : (
        <FiLogIn className="loginIcon" onClick={handleLogin} />
      )}
    </div>
  );
};

export default Header;
