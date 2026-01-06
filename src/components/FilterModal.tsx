// フィルターモーダル（モック準拠）

import { useStore } from '../store/useStore';
import { getYearRange } from '../services/questionService';

interface Props {
  onClose: () => void;
}

export function FilterModal({ onClose }: Props) {
  const {
    filter,
    toggleYear,
    clearAllYears,
    filteredQuestions,
    showAnswer,
    toggleAnswer,
  } = useStore();

  const [minYear, maxYear] = getYearRange();
  const years: number[] = [];
  for (let y = maxYear; y >= minYear; y--) {
    years.push(y);
  }

  // プリセット: 直近5回
  const recent5Years = years.slice(0, 5);
  const isRecent5Selected =
    filter.selectedYears.length === 5 &&
    recent5Years.every((y) => filter.selectedYears.includes(y));

  const handleRecent5 = () => {
    // 一旦クリアしてから直近5回を選択
    clearAllYears();
    recent5Years.forEach((y) => toggleYear(y));
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-t-3xl p-6 pb-8 animate-slide-up safe-area-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">フィルタ</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 答え表示トグル */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-700">答え表示</span>
          <button
            onClick={toggleAnswer}
            className={`relative w-12 h-7 rounded-full transition-colors ${
              showAnswer ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                showAnswer ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 回数選択 */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">回数</p>
          <div className="flex flex-wrap gap-2">
            {years.map((year) => {
              const isSelected = filter.selectedYears.includes(year);
              return (
                <button
                  key={year}
                  onClick={() => toggleYear(year)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>

        {/* 範囲プリセット */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">範囲</p>
          <div className="flex gap-2">
            <button
              onClick={clearAllYears}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                filter.selectedYears.length === 0
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              全範囲
            </button>
            <button
              onClick={handleRecent5}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isRecent5Selected
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              直近5回
            </button>
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              ランダム
            </button>
          </div>
        </div>

        {/* 件数表示 */}
        <div className="text-center text-sm text-gray-500 mb-4">
          {filteredQuestions.length.toLocaleString()} 問
        </div>

        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="w-full py-3.5 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 active:scale-[0.98] transition-all"
        >
          適用
        </button>
      </div>
    </div>
  );
}
