// 目次ノードの型定義

export interface TocNode {
  id: string;           // EISEI_001 など
  subject: string;      // 科目名
  level: number;        // 1=大見出し, 2=中見出し, 3=小見出し
  parentId: string | null;  // 親ノードID
  title: string;        // 見出し名
  path: string;         // 衛生＞健康管理＞疫学 など
  order: number;        // 同階層内の順序
  synonyms: string;     // 別名・略語
  keywords: string;     // 代表キーワード
  priority: number;     // 重要度（1=高, 2=通常）
  source: string;       // 出典
}

export interface TocData {
  meta: {
    version: string;
    lastUpdated: string;
    totalNodes: number;
    subjects: string[];
  };
  nodes: TocNode[];
}
