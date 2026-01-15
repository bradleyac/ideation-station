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

export type { Idea, Category };