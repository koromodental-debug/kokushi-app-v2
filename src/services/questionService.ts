// 問題データサービス

import type { Question, QuestionsData } from '../types/question';
import questionsData from '../data/questions.json';

const data = questionsData as QuestionsData;

// 有効な問題のみフィルタリング
const validQuestions = data.questions.filter(q =>
  q.questionText &&
  q.choices &&
  Object.keys(q.choices).length > 0 &&
  (q.answer || q.isExcluded)
);

// 全問題を取得
export function getAllQuestions(): Question[] {
  return validQuestions;
}

// メタデータを取得
export function getMeta() {
  return data.meta;
}

// 回次の範囲を取得
export function getYearRange(): [number, number] {
  return [data.meta.yearRange.min, data.meta.yearRange.max];
}

// セッション一覧を取得
export function getSessions(): string[] {
  return ['A', 'B', 'C', 'D'];
}

// 科目一覧を取得（問題数順）
export function getCategories(): { name: string; count: number }[] {
  const categoryCounts = new Map<string, number>();

  for (const q of validQuestions) {
    if (q.category) {
      categoryCounts.set(q.category, (categoryCounts.get(q.category) || 0) + 1);
    }
  }

  // 問題数の多い順にソート
  return Array.from(categoryCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// 指定科目のサブカテゴリ一覧を取得（問題数順）
export function getSubcategories(category: string): { name: string; count: number }[] {
  const subcategoryCounts = new Map<string, number>();

  for (const q of validQuestions) {
    if (q.category === category && q.subcategory) {
      subcategoryCounts.set(q.subcategory, (subcategoryCounts.get(q.subcategory) || 0) + 1);
    }
  }

  // 問題数の多い順にソート
  return Array.from(subcategoryCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// 必修問題かどうかを判定
export function isHisshu(year: number, session: string, number: number): boolean {
  if (year === 102) {
    return (session === 'A' || session === 'B') && number >= 1 && number <= 25;
  } else if (year >= 103 && year <= 110) {
    return (session === 'A' || session === 'B') && number >= 1 && number <= 35;
  } else if (year >= 111 && year <= 113) {
    return (session === 'A' || session === 'B') && number >= 1 && number <= 40;
  } else if (year >= 114) {
    return ['A', 'B', 'C', 'D'].includes(session) && number >= 1 && number <= 20;
  }
  return false;
}

// 問題番号パターンを解析（112-B-48, 112B48 など）
function parseQuestionId(text: string): { year: number; session: string; number: number } | null {
  const pattern = /^(\d{2,3})[\s\-_]*([a-dA-D])[\s\-_]*(\d{1,3})$/;
  const match = text.trim().match(pattern);

  if (match) {
    return {
      year: parseInt(match[1]),
      session: match[2].toUpperCase(),
      number: parseInt(match[3])
    };
  }
  return null;
}

// 部分的な問題番号パターンを解析（112, 112B など）
function parsePartialQuestionId(text: string): { years: number[]; session?: string } | null {
  const trimmed = text.trim();

  // 回次+セッション（112B など）
  const patternWithSession = /^(\d{2,3})[\s\-_]*([a-dA-D])[\s\-_]*$/i;
  const matchWithSession = trimmed.match(patternWithSession);
  if (matchWithSession) {
    const year = parseInt(matchWithSession[1]);
    if (year >= 100 && year <= 130) {
      return {
        years: [year],
        session: matchWithSession[2].toUpperCase()
      };
    }
  }

  // 3桁の回次（102〜118）
  const patternYearFull = /^(\d{3})$/;
  const matchYearFull = trimmed.match(patternYearFull);
  if (matchYearFull) {
    const year = parseInt(matchYearFull[1]);
    if (year >= 100 && year <= 130) {
      return { years: [year] };
    }
  }

  // 2桁の部分入力（11→110-118 など）
  const patternYearPartial = /^(\d{2})$/;
  const matchYearPartial = trimmed.match(patternYearPartial);
  if (matchYearPartial) {
    const prefix = parseInt(matchYearPartial[1]);
    if (prefix >= 10 && prefix <= 13) {
      const years: number[] = [];
      for (let i = 0; i <= 9; i++) {
        const year = prefix * 10 + i;
        if (year >= 102 && year <= 118) {
          years.push(year);
        }
      }
      if (years.length > 0) {
        return { years };
      }
    }
  }

  return null;
}

// 同義語辞書を読み込み
import synonymsData from '../data/synonyms.json';

// 同義語マップを構築（キーワード → 同義語グループ）
const synonymMap = new Map<string, string[]>();
for (const group of synonymsData.synonyms) {
  for (const word of group) {
    synonymMap.set(word.toLowerCase(), group.map(w => w.toLowerCase()));
  }
}

// キーワードの同義語を取得
function getSynonyms(keyword: string): string[] {
  const lower = keyword.toLowerCase();
  const synonyms = synonymMap.get(lower);
  if (synonyms) {
    return synonyms;
  }
  // 部分一致で同義語グループを探す
  for (const [key, group] of synonymMap.entries()) {
    if (key.includes(lower) || lower.includes(key)) {
      return group;
    }
  }
  return [lower];
}

// ひらがな→カタカナ変換
function toKatakana(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, (match) =>
    String.fromCharCode(match.charCodeAt(0) + 0x60)
  );
}

// 検索用に正規化（カタカナに統一、小文字化、全角→半角）
function normalizeForSearch(str: string): string {
  return toKatakana(str)
    .toLowerCase()
    // 全角英数→半角
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
    )
    // 全角スペース→半角
    .replace(/　/g, ' ');
}

// テキストが検索キーワードを含むかチェック
function containsKeyword(text: string, keyword: string): boolean {
  const normalizedText = normalizeForSearch(text);
  const normalizedKeyword = normalizeForSearch(keyword);
  return normalizedText.includes(normalizedKeyword);
}

// 問題をフィルタリング
export function filterQuestions(
  questions: Question[],
  searchText: string,
  selectedYears: number[],
  sessions: string[],
  selectedCategories: string[] = [],
  selectedSubcategories: string[] = [],
  hisshuOnly: boolean = false
): Question[] {
  const trimmedSearch = searchText.trim();

  // 問題番号形式かチェック（112-B-48 など）
  const parsed = parseQuestionId(trimmedSearch);
  if (parsed) {
    return questions.filter(q =>
      q.year === parsed.year &&
      q.session === parsed.session &&
      q.number === parsed.number
    );
  }

  // 問題ID完全一致（118A1 など）
  if (trimmedSearch) {
    const exactMatch = questions.filter(q =>
      q.id.toLowerCase() === trimmedSearch.toLowerCase()
    );
    if (exactMatch.length > 0) {
      return exactMatch;
    }
  }

  // 部分的な問題番号形式（112, 112B など）
  const partialParsed = parsePartialQuestionId(trimmedSearch);
  if (partialParsed) {
    return questions.filter(q => {
      const yearMatch = partialParsed.years.includes(q.year);
      const sessionMatch = partialParsed.session ? q.session === partialParsed.session : true;
      return yearMatch && sessionMatch;
    });
  }

  return questions.filter(q => {
    // 必修フィルタ
    if (hisshuOnly && !isHisshu(q.year, q.session, q.number)) {
      return false;
    }

    // 回次フィルタ
    if (selectedYears.length > 0 && !selectedYears.includes(q.year)) {
      return false;
    }

    // セッションフィルタ
    if (sessions.length > 0 && !sessions.includes(q.session)) {
      return false;
    }

    // 科目フィルタ
    if (selectedCategories.length > 0) {
      if (!q.category || !selectedCategories.includes(q.category)) {
        return false;
      }
    }

    // サブカテゴリフィルタ
    if (selectedSubcategories.length > 0) {
      if (!q.subcategory || !selectedSubcategories.includes(q.subcategory)) {
        return false;
      }
    }

    // テキスト検索（AND検索、ひらがな/カタカナ統一、同義語展開）
    if (trimmedSearch) {
      const keywords = trimmedSearch.split(/[\s　]+/).filter(k => k.length > 0);

      const matchesAll = keywords.every(keyword => {
        // キーワードの同義語を取得
        const synonyms = getSynonyms(keyword);

        // いずれかの同義語がマッチすればOK
        return synonyms.some(syn => {
          // 問題文を検索
          const inQuestion = containsKeyword(q.questionText, syn);
          // 選択肢を検索
          const inChoices = Object.values(q.choices).some(
            c => containsKeyword(c, syn)
          );
          // 解説を検索
          const inExplanation = q.explanation ? containsKeyword(q.explanation, syn) : false;
          // キーワードを検索
          const inKeywords = q.keywords?.some(k => containsKeyword(k, syn)) || false;
          // 科目を検索
          const inCategory = q.category ? containsKeyword(q.category, syn) : false;

          return inQuestion || inChoices || inExplanation || inKeywords || inCategory;
        });
      });

      if (!matchesAll) {
        return false;
      }
    }

    return true;
  });
}
