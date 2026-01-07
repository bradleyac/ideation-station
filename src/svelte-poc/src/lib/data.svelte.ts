import { SvelteMap } from 'svelte/reactivity';

interface Idea {
  id: string,
  name: string,
  desc: string
}

let ideas = new SvelteMap<string, Idea>();

export { type Idea, ideas };