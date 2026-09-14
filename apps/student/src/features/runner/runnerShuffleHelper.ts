import { Question } from '@cbt/shared';

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function shuffleArray<T>(array: T[], rng: () => number): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

export function prepareExamQuestions(
  questions: Question[],
  shuffleQuestions?: boolean,
  shuffleOptions?: boolean,
  sessionSeed = 'default'
): Question[] {
  const rng = seededRandom(simpleHash(sessionSeed));
  let result = questions.map((q) => ({ ...q }));

  const shouldShuffleQ = shuffleQuestions !== false;
  const shouldShuffleOpt = shuffleOptions !== false;

  if (shouldShuffleQ) {
    result = shuffleArray(result, rng);
  }

  if (shouldShuffleOpt) {
    result = result.map((q) => {
      if (q.type === 'multiple_choice' && Array.isArray(q.options) && q.options.length > 1) {
        return {
          ...q,
          options: shuffleArray(q.options, rng),
        };
      }
      return q;
    });
  }

  return result;
}
