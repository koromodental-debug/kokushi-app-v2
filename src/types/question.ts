// 問題データの型定義

export interface Question {
  id: string;           // "118A1" など
  year: number;         // 回次（102〜118）
  session: string;      // セッション（A, B, C, D）
  number: number;       // 問題番号
  questionText: string; // 問題文
  choices: Record<string, string>; // { a: "選択肢1", b: "選択肢2", ... }
  choiceCount: number;  // 選択数（1つ選べ、2つ選べなど）
  answer: string;       // 正答（"A", "AB" など）
  hasFigure: boolean;   // 図の有無
  figureRefs: string[]; // 図の参照
  images: string[];     // 画像パス
  isExcluded: boolean;  // 採点除外問題かどうか
  category: string | null;    // 分野
  subcategory: string | null; // サブ分野
  keywords: string[];         // キーワード
  explanation: string | null; // 解説
}

export interface QuestionsData {
  meta: {
    version: string;
    lastUpdated: string;
    totalCount: number;
    withImagesCount?: number;
    yearRange: {
      min: number;
      max: number;
    };
  };
  questions: Question[];
}

// フィルタ条件の型
export interface FilterState {
  searchText: string;
  selectedYears: number[];
  selectedCategories: string[];  // 科目フィルタ
  selectedSubcategories: string[];  // 単元（サブカテゴリ）フィルタ
  sessions: string[];
  showExcluded: boolean;
  hasImage: boolean | null; // null=全て, true=画像あり, false=画像なし
}
