// 検索ヘッダー（モック準拠）

import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

interface Props {
  onFilterClick: () => void;
}

export function SearchHeader({ onFilterClick }: Props) {
  const { filter, setSearchText } = useStore();
  const [localText, setLocalText] = useState(filter.searchText);

  // debounce: 300ms後に検索実行
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localText !== filter.searchText) {
        setSearchText(localText);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localText]);

  // 外部からfilter.searchTextが変わった場合（クリアボタンなど）
  useEffect(() => {
    setLocalText(filter.searchText);
  }, [filter.searchText]);

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 safe-area-top">
      <div className="flex items-center gap-3">
        {/* 検索入力 */}
        <div className="flex-1 relative">
          <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2.5">
            <svg
              className="w-5 h-5 text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={localText}
              onChange={(e) => setLocalText(e.target.value)}
              placeholder="キーワード検索"
              className="flex-1 bg-transparent ml-3 text-gray-900 placeholder-gray-400 focus:outline-none"
            />
            {localText && (
              <button
                onClick={() => { setLocalText(''); setSearchText(''); }}
                className="ml-2 w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* フィルターボタン */}
        <button
          onClick={onFilterClick}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
