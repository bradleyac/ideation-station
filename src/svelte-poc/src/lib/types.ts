interface Idea {
  id: string,
  name: string,
  desc: string,
  categoryIds: string[],
}

interface Category {
  id: string,
  name: string,
  count: number,
}

interface CategoryFull {
  id: string,
  name: string,
  desc: string,
  ideaIds: string[],
}

export type { Idea, Category, CategoryFull };