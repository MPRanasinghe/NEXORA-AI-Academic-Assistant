import { DEMO_QUIZZES } from "@/lib/quiz-fixtures";
import {
  type ManagedQuiz,
  isQuizPlayable,
} from "@/lib/quiz-storage";

export function getQuizCatalog(
  managedQuizzes: ManagedQuiz[],
  deletedQuizIds: string[] = [],
): ManagedQuiz[] {
  const deleted = new Set(deletedQuizIds);
  const saved = new Map(managedQuizzes.map((quiz) => [quiz.id, quiz]));
  const demoIds = new Set(DEMO_QUIZZES.map((quiz) => quiz.id));
  const demos = DEMO_QUIZZES.map((quiz) => {
    const storedQuiz = saved.get(quiz.id);
    if (!storedQuiz) return quiz;
    return storedQuiz.questions.length > 0
      ? storedQuiz
      : {
          ...quiz,
          ...storedQuiz,
          questions: quiz.questions,
          questionCount: quiz.questions.length,
        };
  });
  const custom = managedQuizzes.filter((quiz) => !demoIds.has(quiz.id));
  return [...demos, ...custom].filter((quiz) => !deleted.has(quiz.id));
}

export function getQuizById(
  id: string,
  managedQuizzes: ManagedQuiz[],
  deletedQuizIds: string[] = [],
): ManagedQuiz | null {
  return (
    getQuizCatalog(managedQuizzes, deletedQuizIds).find(
      (quiz) => quiz.id === id,
    ) ?? null
  );
}

export function getStudentVisibleQuizzes(
  managedQuizzes: ManagedQuiz[],
  deletedQuizIds: string[] = [],
): ManagedQuiz[] {
  return getQuizCatalog(managedQuizzes, deletedQuizIds).filter(isQuizPlayable);
}
