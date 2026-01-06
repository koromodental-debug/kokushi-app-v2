// Zustandによる状態管理

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Question, FilterState } from '../types/question';
import { getAllQuestions, filterQuestions, getYearRange } from '../services/questionService';

interface AppState {
  // データ
  allQuestions: Question[];
  filteredQuestions: Question[];

  // フィルタ状態
  filter: FilterState;

  // UI状態
  selectedQuestionId: string | null;  // 永続化用（IDのみ保存）
  selectedQuestion: Question | null;
  showAnswer: boolean;
  isFilterOpen: boolean;

  // アクション
  setSearchText: (text: string) => void;
  toggleYear: (year: number) => void;
  selectAllYears: () => void;
  clearAllYears: () => void;
  toggleSession: (session: string) => void;
  toggleCategory: (category: string) => void;
  selectSingleCategory: (category: string | null) => void;
  clearAllCategories: () => void;
  selectSingleSubcategory: (subcategory: string | null) => void;
  clearAllSubcategories: () => void;
  setHasImage: (value: boolean | null) => void;
  selectQuestion: (question: Question | null) => void;
  toggleAnswer: () => void;
  toggleFilterPanel: () => void;
  applyFilter: () => void;
  resetFilter: () => void;
  restoreSelectedQuestion: () => void;
}

const [minYear, maxYear] = getYearRange();

// ソートした問題リスト（回次降順 → セッション昇順 → 問題番号昇順）
const sortedQuestions = [...getAllQuestions()].sort((a, b) => {
  if (a.year !== b.year) return b.year - a.year;
  if (a.session !== b.session) return a.session.localeCompare(b.session);
  return a.number - b.number;
});

const initialFilter: FilterState = {
  searchText: '',
  selectedYears: [],
  selectedCategories: [],
  selectedSubcategories: [],
  sessions: [],
  showExcluded: true,
  hasImage: null,
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初期データ（新しい順）
      allQuestions: sortedQuestions,
      filteredQuestions: sortedQuestions,

      // 初期フィルタ
      filter: initialFilter,

      // UI初期状態
      selectedQuestionId: null,
      selectedQuestion: null,
      showAnswer: false,
      isFilterOpen: false,

      // アクション
      setSearchText: (text) => {
        set((state) => ({
          filter: { ...state.filter, searchText: text }
        }));
        get().applyFilter();
      },

      toggleYear: (year) => {
        set((state) => {
          const current = state.filter.selectedYears;
          const newYears = current.includes(year)
            ? current.filter(y => y !== year)
            : [...current, year].sort((a, b) => b - a);
          return {
            filter: { ...state.filter, selectedYears: newYears }
          };
        });
        get().applyFilter();
      },

      selectAllYears: () => {
        const years: number[] = [];
        for (let y = maxYear; y >= minYear; y--) {
          years.push(y);
        }
        set((state) => ({
          filter: { ...state.filter, selectedYears: years }
        }));
        get().applyFilter();
      },

      clearAllYears: () => {
        set((state) => ({
          filter: { ...state.filter, selectedYears: [] }
        }));
        get().applyFilter();
      },

      toggleSession: (session) => {
        set((state) => {
          const current = state.filter.sessions;
          const newSessions = current.includes(session)
            ? current.filter(s => s !== session)
            : [...current, session];
          return {
            filter: { ...state.filter, sessions: newSessions }
          };
        });
        get().applyFilter();
      },

      toggleCategory: (category) => {
        set((state) => {
          const current = state.filter.selectedCategories;
          const newCategories = current.includes(category)
            ? current.filter(c => c !== category)
            : [...current, category];
          return {
            filter: { ...state.filter, selectedCategories: newCategories }
          };
        });
        get().applyFilter();
      },

      selectSingleCategory: (category) => {
        set((state) => ({
          filter: {
            ...state.filter,
            selectedCategories: category ? [category] : []
          }
        }));
        get().applyFilter();
      },

      clearAllCategories: () => {
        set((state) => ({
          filter: { ...state.filter, selectedCategories: [], selectedSubcategories: [] }
        }));
        get().applyFilter();
      },

      selectSingleSubcategory: (subcategory) => {
        set((state) => ({
          filter: {
            ...state.filter,
            selectedSubcategories: subcategory ? [subcategory] : []
          }
        }));
        get().applyFilter();
      },

      clearAllSubcategories: () => {
        set((state) => ({
          filter: { ...state.filter, selectedSubcategories: [] }
        }));
        get().applyFilter();
      },

      setHasImage: (value) => {
        set((state) => ({
          filter: { ...state.filter, hasImage: value }
        }));
        get().applyFilter();
      },

      selectQuestion: (question) => {
        set({
          selectedQuestion: question,
          selectedQuestionId: question?.id || null,
          showAnswer: false
        });
      },

      toggleAnswer: () => {
        set((state) => ({ showAnswer: !state.showAnswer }));
      },

      toggleFilterPanel: () => {
        set((state) => ({ isFilterOpen: !state.isFilterOpen }));
      },

      applyFilter: () => {
        const { allQuestions, filter } = get();
        const filtered = filterQuestions(
          allQuestions,
          filter.searchText,
          filter.selectedYears,
          filter.sessions,
          filter.selectedCategories,
          filter.selectedSubcategories
        );
        // ソート（year降順 → session昇順 → number昇順）
        const sorted = [...filtered].sort((a, b) => {
          if (a.year !== b.year) return b.year - a.year;
          if (a.session !== b.session) return a.session.localeCompare(b.session);
          return a.number - b.number;
        });
        set({ filteredQuestions: sorted });
      },

      resetFilter: () => {
        set({ filter: initialFilter });
        get().applyFilter();
      },

      // リロード時に選択中の問題を復元
      restoreSelectedQuestion: () => {
        const { selectedQuestionId, allQuestions } = get();
        if (selectedQuestionId) {
          const question = allQuestions.find(q => q.id === selectedQuestionId);
          if (question) {
            set({ selectedQuestion: question });
          }
        }
      },
    }),
    {
      name: 'kokushi-app-storage',
      partialize: (state) => ({
        selectedQuestionId: state.selectedQuestionId,
        filter: state.filter,
      }),
      // 古いデータとマージして欠けているプロパティを補完
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<AppState>;
        return {
          ...currentState,
          ...persisted,
          filter: {
            ...initialFilter,
            ...(persisted.filter || {}),
          },
        };
      },
    }
  )
);
