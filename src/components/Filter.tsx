import React, { useCallback, useEffect, useState } from 'react';
import '@/components/Filter.css';
import { TbReload } from 'react-icons/tb';

interface FilterProps {
  selectedCategory: string; // 현재 선택된 카테고리
  onCategoryChange: (category: string) => void; // 카테고리 변경 시 호출되는 함수
  onSearchChange: (event: string) => void; // 검색어 변경 시 호출되는 함수
}

const categories = [
  '전체',
  '국악',
  '교육/체험',
  '독주/독창회',
  '무용',
  '뮤지컬/오페라',
  '연극',
  '영화',
  '전시/미술',
  '축제-문화/예술',
  '축제-시민화합',
  '축제-자연/경관',
  '축제-전통/역사',
  '축제-기타',
  '콘서트',
  '클래식',
  '기타',
];

const Filter: React.FC<FilterProps> = ({ selectedCategory, onCategoryChange, onSearchChange }) => {
  const [isDropdownView, setDropdownView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDropdownToggle = () => {
    setDropdownView((prev) => !prev);
  };

  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);
    setDropdownView(false);
  };

  // 드롭다운 외부 클릭 시 닫기 처리
  const handleDocumentClick = useCallback((event: MouseEvent) => {
    if (event.target instanceof HTMLElement) {
      if (!event.target.closest('.filterContainer')) {
        setDropdownView(false);
      }
    }
  }, []);
  useEffect(() => {
    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [handleDocumentClick]);

  //검색
  const handleSearch = () => {
    onSearchChange(searchTerm);
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSearchChange(searchTerm);
    }
  };

  return (
    <div className="filterContainer">
      <button className="dropdownBtn" onClick={handleDropdownToggle} style={{ border: '2px solid #efefef' }}>
        {selectedCategory} {isDropdownView ? '▲' : '▼'}
      </button>
      {isDropdownView && (
        <ul className="dropdownMenu">
          {categories.map((category: string) => (
            <li
              key={category}
              className={`dropdownItem ${selectedCategory === category ? 'selected' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          className="searchInput"
          placeholder="제목 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // 상태 업데이트
          onKeyDown={handleEnter} // 엔터 키 입력 감지
        />
      </form>
      <button className="searchBtn" onClick={handleSearch} style={{ backgroundColor: '#E78295', color: 'white' }}>
        검색
      </button>
      <TbReload className="reLoad" onClick={() => window.location.reload()} />
    </div>
  );
};

export default Filter;
