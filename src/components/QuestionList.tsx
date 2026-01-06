// 問題リスト（仮想スクロール対応 - react-window 2.x）

import type { CSSProperties, ReactElement } from 'react';
import { List, useDynamicRowHeight, useListRef } from 'react-window';
import { useStore } from '../store/useStore';
import { QuestionCard } from './QuestionCard';
import type { Question } from '../types/question';

// 行の高さ定義
const ROW_HEIGHT_COLLAPSED = 100; // 非選択時

interface RowProps {
  questions: Question[];
  selectedQuestionId: string | null;
}

function Row({
  index,
  style,
  questions,
  selectedQuestionId,
}: {
  ariaAttributes: { 'aria-posinset': number; 'aria-setsize': number; role: 'listitem' };
  index: number;
  style: CSSProperties;
} & RowProps): ReactElement {
  const question = questions[index];
  const isSelected = selectedQuestionId === question?.id;

  return (
    <div style={{ ...style, height: isSelected ? 'auto' : style.height, minHeight: style.height }}>
      <QuestionCard question={question} />
    </div>
  );
}

export function QuestionList() {
  const { filteredQuestions, selectedQuestion } = useStore();
  const listRef = useListRef(null);

  const dynamicRowHeight = useDynamicRowHeight({
    defaultRowHeight: ROW_HEIGHT_COLLAPSED,
    key: selectedQuestion?.id ?? 'none',
  });

  if (filteredQuestions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="text-center text-gray-400">
          <svg
            className="w-16 h-16 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-lg">該当する問題がありません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <List
        listRef={listRef}
        rowCount={filteredQuestions.length}
        rowHeight={dynamicRowHeight}
        rowComponent={Row}
        rowProps={{
          questions: filteredQuestions,
          selectedQuestionId: selectedQuestion?.id ?? null,
        }}
        overscanCount={5}
        style={{ height: '100%' }}
      />
    </div>
  );
}
