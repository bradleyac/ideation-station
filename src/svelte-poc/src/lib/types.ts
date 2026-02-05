interface Catalog {
  id: string;
  name: string;
  desc: string;
  settings: { connections: boolean }
}

interface Idea {
  id: string;
  name: string;
  desc: string;
  categoryId?: string;
}

interface Category {
  id: string;
  name: string;
  desc: string;
  count: number;
}

interface CategoryFull {
  id: string;
  name: string;
  desc: string;
  ideaIds: string[];
}

export type { Catalog, Idea, Category, CategoryFull };