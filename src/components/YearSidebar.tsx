// 回数選択サイドバー（横からスライドイン）

import { useStore } from '../store/useStore';
import { getYearRange } from '../services/questionService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function YearSidebar({ isOpen, onClose }: Props) {
  const { filter, toggleYear, clearAllYears, filteredQuestions } = useStore();

  const [minYear, maxYear] = getYearRange();
  const years: number[] = [];
  for (let y = maxYear; y >= minYear; y--) {
    years.push(y);
  }

  // 単一の回を選択（他の選択をクリアして1つだけ選択）
  const selectSingleYear = (year: number) => {
    // 既に同じ年だけが選択されている場合はクリア（トグル動作）
    if (filter.selectedYears.length === 1 && filter.selectedYears[0] === year) {
      clearAllYears();
    } else {
      // 一旦全てクリアしてから選択
      clearAllYears();
      // 少し遅延を入れて確実に反映
      setTimeout(() => toggleYear(year), 0);
    }
  };

  return (
    <>
      {/* オーバーレイ */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* サイドバー */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">回数で絞り込み</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 回数リスト */}
        <div className="overflow-y-auto h-[calc(100%-140px)] p-4">
          {/* 全範囲ボタン */}
          <button
            onClick={() => {
              clearAllYears();
              onClose();
            }}
            className={`w-full mb-3 py-3 rounded-xl text-sm font-medium transition-colors ${
              filter.selectedYears.length === 0
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全範囲
          </button>

          {/* 年度ボタン */}
          <div className="grid grid-cols-2 gap-2">
            {years.map((year) => {
              const isSelected = filter.selectedYears.includes(year);
              const isSingleSelected = filter.selectedYears.length === 1 && isSelected;
              return (
                <button
                  key={year}
                  onClick={() => {
                    selectSingleYear(year);
                    onClose();
                  }}
                  className={`py-3 rounded-xl text-base font-medium transition-all ${
                    isSingleSelected
                      ? 'bg-blue-500 text-white shadow-md scale-[1.02]'
                      : isSelected
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 active:scale-95'
                  }`}
                >
                  {year}回
                </button>
              );
            })}
          </div>
        </div>

        {/* フッター */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white safe-area-bottom">
          <div className="text-center text-sm text-gray-500">
            {filteredQuestions.length.toLocaleString()} 問
          </div>
        </div>
      </div>
    </>
  );
}
