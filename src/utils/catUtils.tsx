import type { CatImage } from "../api/cats";

export type Vote = {
  image_id: string
  value: number
}

export function aggregateVotes(votes: Vote[]): Record<string, number> {
  const map: Record<string, number> = {};
  votes.forEach(vote => {
    if (!map[vote.image_id]) map[vote.image_id] = 0;
    map[vote.image_id] += vote.value;
  });
  return map;
};

export function sortCats(
  cats: CatImage[],
  options: {byVotes: boolean, byFavourites: boolean}
): CatImage[] {
  const sorted = [...cats];

  if (options.byVotes) {
    sorted.sort((a, b) => Number(!!b.favourite) - Number(!!a.favourite));
  }

  if (options.byFavourites) {
    sorted.sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  return sorted;
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  return String(error) || fallback;
}

export function applyVote(
  cats: CatImage[],
  catId: string,
  voteValue: number
): CatImage[] {
  return cats.map(c => 
    c.id === catId ? { ...c, score: (c.score || 0) + voteValue } : c
  )
}