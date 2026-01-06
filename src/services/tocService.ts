// 目次ノードサービス

import type { TocNode, TocData } from '../types/toc';
import tocData from '../data/toc_nodes.json';

const data = tocData as TocData;

// 全ノードを取得
export function getAllNodes(): TocNode[] {
  return data.nodes;
}

// 科目一覧を取得
export function getSubjects(): string[] {
  return data.meta.subjects;
}

// 科目でフィルタ
export function getNodesBySubject(subject: string): TocNode[] {
  return data.nodes.filter(n => n.subject === subject);
}

// レベル1（大見出し）のみ取得
export function getLevel1Nodes(subject?: string): TocNode[] {
  let nodes = data.nodes.filter(n => n.level === 1);
  if (subject) {
    nodes = nodes.filter(n => n.subject === subject);
  }
  return nodes;
}

// 子ノードを取得
export function getChildNodes(parentId: string): TocNode[] {
  return data.nodes.filter(n => n.parentId === parentId);
}

// IDでノードを取得
export function getNodeById(id: string): TocNode | undefined {
  return data.nodes.find(n => n.id === id);
}

// キーワードで検索
export function searchNodes(keyword: string): TocNode[] {
  const lower = keyword.toLowerCase();
  return data.nodes.filter(n =>
    n.title.toLowerCase().includes(lower) ||
    n.keywords.toLowerCase().includes(lower) ||
    n.synonyms.toLowerCase().includes(lower)
  );
}

// メタデータを取得
export function getMeta() {
  return data.meta;
}
