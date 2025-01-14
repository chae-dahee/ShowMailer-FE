import React, { ReactNode } from 'react';

import '@/routes/Layout.css';
import BgImg from '@/assets/imgs/BgImg.webp';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <div className="pcOverlay">
      <img src={BgImg} className="pcImage" alt="PC Description" loading="lazy" />
      <div className="appContainer">{children}</div>
    </div>
  );
};

export default Layout;
