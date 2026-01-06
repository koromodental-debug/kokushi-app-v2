// 科目選択サイドバー（左からスライドイン）

import { useStore } from '../store/useStore';
import { getCategories, getSubcategories } from '../services/questionService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SubjectSidebar({ isOpen, onClose }: Props) {
  const {
    filter,
    selectSingleCategory,
    clearAllCategories,
    selectSingleSubcategory,
    clearAllSubcategories,
    filteredQuestions
  } = useStore();

  const categories = getCategories();

  // 選択中の科目のサブカテゴリを取得
  const selectedCategory = filter.selectedCategories[0] || null;
  const subcategories = selectedCategory ? getSubcategories(selectedCategory) : [];

  // 科目をタップ
  const handleSelect = (category: string) => {
    if (filter.selectedCategories.length === 1 && filter.selectedCategories[0] === category) {
      // 同じ科目を再度タップ → 閉じる（全科目に戻る）
      clearAllCategories();
    } else {
      // 別の科目をタップ → その科目を選択（単元が展開される）
      selectSingleCategory(category);
    }
  };

  // サブカテゴリを選択
  const handleSubcategorySelect = (subcategory: string) => {
    if (filter.selectedSubcategories.length === 1 && filter.selectedSubcategories[0] === subcategory) {
      clearAllSubcategories();
    } else {
      selectSingleSubcategory(subcategory);
    }
    onClose();
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

      {/* サイドバー（左から） */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">科目で絞り込み</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 科目リスト */}
        <div className="overflow-y-auto h-[calc(100%-140px)] p-4">
          {/* 全科目ボタン */}
          <button
            onClick={() => {
              clearAllCategories();
              onClose();
            }}
            className={`w-full mb-3 py-3 rounded-xl text-sm font-medium transition-colors ${
              filter.selectedCategories.length === 0
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全科目
          </button>

          {/* 科目ボタン（アコーディオン形式） */}
          <div className="space-y-2">
            {categories.map(({ name, count }) => {
              const isSelected = filter.selectedCategories.includes(name);
              const isSingleSelected = filter.selectedCategories.length === 1 && isSelected;
              const categorySubcategories = isSingleSelected ? subcategories : [];

              return (
                <div key={name}>
                  {/* 科目ボタン */}
                  <button
                    onClick={() => handleSelect(name)}
                    className={`w-full py-3 px-4 rounded-xl text-left transition-all flex justify-between items-center ${
                      isSingleSelected
                        ? 'bg-green-500 text-white shadow-md'
                        : isSelected
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 active:scale-[0.98]'
                    }`}
                  >
                    <span className="font-medium truncate">{name}</span>
                    <div className="flex items-center">
                      <span className={`text-xs mr-2 ${
                        isSingleSelected ? 'text-green-100' : 'text-gray-400'
                      }`}>
                        {count}問
                      </span>
                      {/* 展開アイコン（単元がある場合のみ） */}
                      {isSingleSelected && categorySubcategories.length > 0 && (
                        <svg className="w-4 h-4 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>
                  </button>

                  {/* サブカテゴリ（単元）- 選択中の科目の直下に展開 */}
                  {isSingleSelected && categorySubcategories.length > 0 && (
                    <div className="mt-2 ml-3 pl-3 border-l-2 border-green-200 space-y-1.5">
                      {categorySubcategories.map(({ name: subName, count: subCount }) => {
                        const isSubSelected = filter.selectedSubcategories.includes(subName);
                        return (
                          <button
                            key={subName}
                            onClick={() => handleSubcategorySelect(subName)}
                            className={`w-full py-2 px-3 rounded-lg text-left text-sm transition-all flex justify-between items-center ${
                              isSubSelected
                                ? 'bg-blue-500 text-white shadow-sm'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <span className="truncate">{subName}</span>
                            <span className={`text-xs ml-2 ${
                              isSubSelected ? 'text-blue-100' : 'text-gray-400'
                            }`}>
                              {subCount}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
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
