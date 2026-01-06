// 下部ナビゲーション

import type { ReactNode } from 'react';
import { useStore } from '../store/useStore';

interface Props {
  onSubjectClick: () => void;
  onYearClick: () => void;
}

export function BottomNav({ onSubjectClick, onYearClick }: Props) {
  const { filteredQuestions, selectQuestion } = useStore();

  // ランダム問題を表示
  const handleRandom = () => {
    if (filteredQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
      selectQuestion(filteredQuestions[randomIndex]);
    }
  };

  // 先頭に戻る
  const handleHome = () => {
    selectQuestion(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs: { id: string; label: string; icon: ReactNode; onClick: () => void; color?: string }[] = [
    {
      id: 'subject',
      label: '科目',
      onClick: onSubjectClick,
      color: 'text-green-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: 'year',
      label: '回数',
      onClick: onYearClick,
      color: 'text-blue-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'random',
      label: 'ランダム',
      onClick: handleRandom,
      color: 'text-orange-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      id: 'home',
      label: '先頭へ',
      onClick: handleHome,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7-7 7 7" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-20">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={tab.onClick}
            className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
              tab.color || 'text-gray-500'
            } hover:opacity-80 active:scale-95`}
          >
            {tab.icon}
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
