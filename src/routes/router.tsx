import Home from '@/pages/home/Home';
import Detail from '@/pages/detail/Detail';
import Mypage from '@/pages/mypage/Mypage';
import NotFound from '@/pages/Not-found';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import Header from '@/components/header/Header';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Header />
        <Outlet />
      </>
    ),
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/detail/:codename/:title/:date',
        element: <Detail />,
      },
      {
        path: '/mypage',
        element: <Mypage />,
      },
      {
        path: '*', // 모든 경로에 부합하지 않는 경우
        element: <NotFound />,
      },
    ],
  },
]);
