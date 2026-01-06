// 検索サマリー（モック準拠）

import { useStore } from '../store/useStore';
import { useMemo, useState, useRef } from 'react';

export function SearchSummary() {
  const { filter, filteredQuestions, setSearchText } = useStore();
  const [isDismissing, setIsDismissing] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);

  // 直近5回（118-114回）の出題数を計算
  const recentYears = [118, 117, 116, 115, 114];
  const recentCount = useMemo(() => {
    return filteredQuestions.filter(q => recentYears.includes(q.year)).length;
  }, [filteredQuestions]);

  // 上位の問われ方（TODO: tocデータとの連携が必要）
  // 仮で固定値を表示
  const topCategories = ['診断・検査', '治療'];

  // スワイプ開始
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };

  // スワイプ中
  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaY = e.touches[0].clientY - touchStartY.current;
    // 上方向のスワイプのみ反応（負の値）
    if (deltaY < 0) {
      setTranslateY(deltaY);
    }
  };

  // スワイプ終了
  const handleTouchEnd = () => {
    const swipeDistance = Math.abs(translateY);
    const swipeTime = Date.now() - touchStartTime.current;
    const swipeVelocity = swipeDistance / swipeTime;

    // 50px以上スワイプ or 素早いスワイプで消去
    if (swipeDistance > 50 || swipeVelocity > 0.5) {
      setIsDismissing(true);
      setTimeout(() => {
        setSearchText('');
        setIsDismissing(false);
        setTranslateY(0);
      }, 200);
    } else {
      setTranslateY(0);
    }
  };

  if (!filter.searchText) return null;

  return (
    <div
      className={`bg-white mx-4 mt-4 rounded-2xl p-4 shadow-sm border border-gray-100 transition-all ${isDismissing ? 'opacity-0 -translate-y-full' : ''}`}
      style={{ transform: isDismissing ? undefined : `translateY(${translateY}px)`, opacity: isDismissing ? 0 : 1 - Math.abs(translateY) / 150 }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* キーワード見出し */}
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        {filter.searchText}
      </h2>

      {/* 統計 */}
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
        <span>総出題</span>
        <span className="font-semibold text-gray-700">{filteredQuestions.length}</span>
        <span className="mx-1">/</span>
        <span>直近5回</span>
        <span className="font-semibold text-gray-700">{recentCount}</span>
      </div>

      {/* 上位の問われ方 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          上位の問われ方: <span className="text-gray-700">{topCategories.join(' / ')}</span>
        </div>
        <button className="text-sm text-gray-400 flex items-center gap-1">
          テーマを見る
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
