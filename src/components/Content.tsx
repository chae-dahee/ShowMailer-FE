import React, { useRef, useState } from 'react';
import '@/components/Content.css';
import { useNavigate } from 'react-router-dom';
import { IPerformancePayload } from '@/hooks/usePerformances';

interface ContentProps {
  performances: IPerformancePayload[];
  target?: React.RefObject<HTMLDivElement>;
  hasNextPage?: boolean;
  isLoading?: boolean;
}

const Content: React.FC<ContentProps> = ({ performances, target, hasNextPage, isLoading }) => {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState<boolean[]>(new Array(performances.length).fill(false));

  const handlePerformanceClick = (performance: IPerformancePayload) => {
    const { codename, title, date } = performance;
    const viewcodename = codename?.split(`/`)[0];
    navigate(`/detail/${viewcodename}/${title}/${date}`);
  };

  const handleImageLoad = (index: number) => {
    setImgLoaded((prev) => {
      const newLoaded = [...prev];
      newLoaded[index] = true;
      return newLoaded;
    });
  };

  if (isLoading)
    return (
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );

  return (
    <>
      <div className="contentContainer">
        {performances.length === 0 ? (
          <p>등록된 공연이 없습니다.</p>
        ) : (
          performances.map((performance, index) => {
            return (
              <div key={index} className="EventItem" onClick={() => handlePerformanceClick(performance)}>
                <img
                  src={imgLoaded[index] ? performance.image : ''}
                  data-src={performance.image}
                  alt={performance.title}
                  loading="lazy"
                  ref={(el) => {
                    if (el && !imgLoaded[index]) {
                      const observer = new IntersectionObserver((entries) => {
                        entries.forEach((entry) => {
                          if (entry.isIntersecting) {
                            handleImageLoad(index);
                            observer.unobserve(el);
                          }
                        });
                      });
                      observer.observe(el);
                    }
                  }}
                />
                <h3>{performance.title}</h3>
                <p>{performance.codename}</p>
                <p>{performance.date}</p>
              </div>
            );
          })
        )}
      </div>
      {hasNextPage ? (
        <div ref={target} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : (
        <div className="noMoreData">더이상 데이터가 없습니다.</div>
      )}
    </>
  );
};

export default Content;
