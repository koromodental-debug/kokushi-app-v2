// 問題カード（モック準拠）

import type { Question } from '../types/question';
import { useStore } from '../store/useStore';
import { isHisshu } from '../services/questionService';
import { useState } from 'react';

interface Props {
  question: Question;
}

// 画像パスを生成（複数画像対応）
function getImagePaths(question: Question): string[] {
  if (!question.hasFigure) return [];

  const basePath = import.meta.env.BASE_URL || '/';
  const folder = `${question.year}回_Web画像`;
  const baseId = question.id;

  // 複数画像の可能性があるので、メイン画像と_1, _2, _3 のパターンを含める
  const paths: string[] = [];

  // メイン画像（サフィックスなし）
  paths.push(`${basePath}images/${folder}/${baseId}.png`);

  // 複数画像（_1, _2, _3...）
  for (let i = 1; i <= 5; i++) {
    paths.push(`${basePath}images/${folder}/${baseId}_${i}.png`);
  }

  return paths;
}

export function QuestionCard({ question }: Props) {
  const { selectQuestion, selectedQuestion, showAnswer } = useStore();
  const isSelected = selectedQuestion?.id === question.id;
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  // タグ判定
  const hisshu = isHisshu(question.year, question.session, question.number);
  const hasImage = question.hasFigure || question.images.length > 0;
  const category = question.category || null;

  // 画像パスを取得
  const imagePaths = question.images.length > 0 ? question.images : getImagePaths(question);

  return (
    <button
      onClick={() => selectQuestion(question)}
      className={`w-full text-left bg-white border-b border-gray-100 p-4 transition-colors ${
        isSelected ? 'bg-blue-50' : 'hover:bg-gray-50 active:bg-gray-100'
      }`}
    >
      {/* 上部: ID + タグ */}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        {/* 問題ID */}
        <span className="font-bold text-gray-900">{question.id}</span>

        {/* 必修タグ */}
        {hisshu && (
          <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-600 rounded">
            必修
          </span>
        )}

        {/* 画像タグ */}
        {hasImage && (
          <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-600 rounded">
            画像
          </span>
        )}

        {/* 科目タグ */}
        {category && category !== '必修' && (
          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 rounded">
            {category}
          </span>
        )}

        {/* 解説タグ */}
        {question.explanation && (
          <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-600 rounded">
            解説
          </span>
        )}
      </div>

      {/* 問題文（2行まで表示） */}
      <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
        {question.questionText}
      </p>

      {/* 選択した場合に詳細表示 */}
      {isSelected && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {/* 選択肢 */}
          <div className="space-y-2">
            {Object.entries(question.choices)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([key, value]) => {
                const isCorrect = question.answer.toLowerCase().includes(key);
                return (
                  <div
                    key={key}
                    className={`flex items-start gap-2 p-2 rounded-lg ${
                      showAnswer && isCorrect
                        ? 'bg-green-50'
                        : ''
                    }`}
                  >
                    <span
                      className={`font-medium ${
                        showAnswer && isCorrect
                          ? 'text-green-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {key.toUpperCase()}
                    </span>
                    <span
                      className={
                        showAnswer && isCorrect
                          ? 'text-green-700'
                          : showAnswer
                          ? 'text-gray-400'
                          : 'text-gray-700'
                      }
                    >
                      {value}
                    </span>
                    {showAnswer && isCorrect && (
                      <svg className="w-5 h-5 text-green-500 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                );
              })}
          </div>

          {/* 画像（あれば） */}
          {hasImage && imagePaths.length > 0 && (
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {imagePaths.map((src, idx) => (
                <img
                  key={src}
                  src={src}
                  alt={`図${idx + 1}`}
                  className="h-32 rounded-lg border border-gray-200 object-cover"
                  style={{ display: loadedImages.includes(src) ? 'block' : 'none' }}
                  onLoad={() => {
                    setLoadedImages(prev =>
                      prev.includes(src) ? prev : [...prev, src]
                    );
                  }}
                />
              ))}
            </div>
          )}

          {/* 答えを見るボタン */}
          {!showAnswer && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                useStore.getState().toggleAnswer();
              }}
              className="mt-4 w-full py-2.5 text-blue-600 font-medium border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
            >
              答えを見る
            </button>
          )}

          {/* 解説表示 */}
          {showAnswer && question.explanation && (
            <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="font-bold text-amber-800">解説</span>
              </div>
              <p className="text-amber-900 text-sm leading-relaxed whitespace-pre-wrap">
                {question.explanation}
              </p>
            </div>
          )}

          {/* 正解表示時: 正解/不正解ボタン */}
          {showAnswer && (
            <div className="mt-4 flex gap-3">
              <button className="flex-1 py-2.5 text-gray-600 font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                正解
              </button>
              <button className="flex-1 py-2.5 text-gray-600 font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                不正解
              </button>
            </div>
          )}
        </div>
      )}
    </button>
  );
}
