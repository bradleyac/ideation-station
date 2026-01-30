interface Catalog {
  id: string;
  name: string;
  desc: string;
}

interface Idea {
  id: string;
  name: string;
  desc: string;
  categoryIds: string[];
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