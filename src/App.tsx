import { useState, useEffect } from 'react';
import { SearchHeader } from './components/SearchHeader';
import { SearchSummary } from './components/SearchSummary';
import { QuestionList } from './components/QuestionList';
import { BottomNav } from './components/BottomNav';
import { FilterModal } from './components/FilterModal';
import { YearSidebar } from './components/YearSidebar';
import { SubjectSidebar } from './components/SubjectSidebar';
import { useStore } from './store/useStore';

function App() {
  const [showFilter, setShowFilter] = useState(false);
  const [showYearSidebar, setShowYearSidebar] = useState(false);
  const [showSubjectSidebar, setShowSubjectSidebar] = useState(false);
  const { filter, restoreSelectedQuestion, applyFilter } = useStore();

  // リロード時に状態を復元
  useEffect(() => {
    restoreSelectedQuestion();
    applyFilter();
  }, []);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* 上部: 検索ヘッダー */}
      <SearchHeader onFilterClick={() => setShowFilter(true)} />

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-hidden">
        {/* 検索サマリー（キーワードがある時のみ表示） */}
        {filter.searchText && <SearchSummary />}

        {/* 問題リスト */}
        <QuestionList />
      </main>

      {/* 下部: ナビゲーション */}
      <BottomNav
        onSubjectClick={() => setShowSubjectSidebar(true)}
        onYearClick={() => setShowYearSidebar(true)}
      />

      {/* フィルターモーダル */}
      {showFilter && (
        <FilterModal onClose={() => setShowFilter(false)} />
      )}

      {/* 科目選択サイドバー */}
      <SubjectSidebar
        isOpen={showSubjectSidebar}
        onClose={() => setShowSubjectSidebar(false)}
      />

      {/* 回数選択サイドバー */}
      <YearSidebar
        isOpen={showYearSidebar}
        onClose={() => setShowYearSidebar(false)}
      />
    </div>
  );
}

export default App;
