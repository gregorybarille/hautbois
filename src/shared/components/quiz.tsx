import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TFn = (key: string) => string;

export interface ChoiceAnswer {
  chosen: string;
  correct: boolean;
}

interface ChoiceGridProps<T> {
  options: T[];
  getId: (option: T) => string;
  getLabel?: (option: T) => string;
  correctId: string;
  answer: ChoiceAnswer | null;
  onAnswer: (id: string) => void;
  className?: string;
}

// Grid of answer buttons for an auto-graded quiz card, shared by the ear
// training drill and the daily review's note/interval cards. Highlights the
// correct choice green and the chosen wrong answer red once answered.
export function ChoiceGrid<T>({
  options,
  getId,
  getLabel,
  correctId,
  answer,
  onAnswer,
  className,
}: ChoiceGridProps<T>) {
  return (
    <div className={cn("grid grid-cols-3 gap-2.5 sm:grid-cols-4", className)}>
      {options.map((option) => {
        const id = getId(option);
        const isCorrect = answer !== null && id === correctId;
        const isWrong =
          answer !== null && !answer.correct && id === answer.chosen;
        return (
          <Button
            key={id}
            variant="outline"
            disabled={!!answer}
            onClick={() => onAnswer(id)}
            className={cn(
              "h-14 font-semibold disabled:opacity-100",
              isCorrect &&
                "border-green-500 bg-green-500/15 text-green-700 dark:text-green-300",
              isWrong &&
                "border-red-500 bg-red-500/15 text-red-700 dark:text-red-300",
            )}
          >
            {getLabel ? getLabel(option) : id}
          </Button>
        );
      })}
    </div>
  );
}

interface FeedbackRowProps {
  answer: ChoiceAnswer | null;
  onNext: () => void;
  t: TFn;
  // Rendered in place of the correct/incorrect + next button, before an
  // answer is chosen (e.g. a "skip" action).
  idle?: React.ReactNode;
}

// Correct/incorrect readout + "next" button for an auto-graded quiz card.
export const FeedbackRow = ({ answer, onNext, t, idle }: FeedbackRowProps) => (
  <div className="flex min-h-12 items-center justify-center gap-3">
    {answer ? (
      <>
        <span
          className={cn(
            "text-lg font-semibold",
            answer.correct
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400",
          )}
        >
          {answer.correct ? t("ear.correct") : t("ear.incorrect")}
        </span>
        <Button onClick={onNext}>
          {t("ear.next")}
          <ArrowRight className="size-4" />
        </Button>
      </>
    ) : (
      idle
    )}
  </div>
);
