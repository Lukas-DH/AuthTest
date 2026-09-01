/**
 * Reachability helpers for the branching quiz tree.
 *
 * A follow-up is only shown when its parent selects that branch — see
 * QuestionRenderer, which renders `followUp` on "yes" and `followUpNo` on "no".
 * These helpers mirror that rule exactly so that stored answers can never
 * disagree with what the participant actually saw.
 */

export interface QuizNode {
  id: string;
  followUp?: QuizNode[];
  followUpNo?: QuizNode[];
}

/** Every question id in the tree, including nested follow-ups. */
function collectAllIds(questions: QuizNode[], into: Set<string>): void {
  for (const q of questions) {
    into.add(q.id);
    collectAllIds(q.followUp ?? [], into);
    collectAllIds(q.followUpNo ?? [], into);
  }
}

/**
 * Ids currently visible given `answers`, descending into a branch only when the
 * parent's answer selects it.
 */
export function reachableIds(
  questions: QuizNode[],
  answers: Record<string, any>,
): Set<string> {
  const reachable = new Set<string>();

  const walk = (nodes: QuizNode[]) => {
    for (const q of nodes) {
      reachable.add(q.id);
      const answer = answers[q.id];
      if (answer === "yes") walk(q.followUp ?? []);
      else if (answer === "no") walk(q.followUpNo ?? []);
    }
  };

  walk(questions);
  return reachable;
}

/**
 * Drops answers whose question is no longer reachable — e.g. F.4.1 lingering
 * after the participant switched F.4 from "yes" to "no".
 *
 * Only ids known to the tree are eligible for removal, so unrelated keys (the
 * computed `score`, anything a future caller adds) always survive.
 */
export function pruneAnswers<T extends Record<string, any>>(
  questions: QuizNode[],
  answers: T,
): T {
  if (!questions.length) return answers;

  const known = new Set<string>();
  collectAllIds(questions, known);
  const reachable = reachableIds(questions, answers);

  const pruned: Record<string, any> = {};
  let removed = false;
  for (const [id, value] of Object.entries(answers)) {
    if (known.has(id) && !reachable.has(id)) {
      removed = true;
      continue;
    }
    pruned[id] = value;
  }

  return removed ? (pruned as T) : answers;
}
