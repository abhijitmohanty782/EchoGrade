
import { cn } from "@/lib/utils";

const getScoreStyles = (score: number) => {
  if (score < 5) {
    return {
      textColor: "text-destructive",
      bgColor: "bg-destructive/10",
      strokeColor: "text-destructive",
    };
  }
  if (score < 8) {
    return {
      textColor: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      strokeColor: "text-yellow-500",
    };
  }
  return {
    textColor: "text-green-500",
    bgColor: "bg-green-500/10",
    strokeColor: "text-green-500",
  };
};

export function ScoreDisplay({ score }: { score: number | null }) {
  // If score is null, don't render anything.
  if (score === null || typeof score !== 'number' || isNaN(score)) return null;

  const styles = getScoreStyles(score);
  const scorePercentage = score * 10;

  return (
    <div className={cn("relative size-40 rounded-full flex items-center justify-center transition-colors duration-500", styles.bgColor)}>
      <svg className="size-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          className="stroke-current text-border/50"
          strokeWidth="2"
          fill="transparent"
        ></circle>
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          className={cn("stroke-current transition-all duration-1000", styles.strokeColor)}
          strokeWidth="2"
          strokeDasharray={`${scorePercentage}, 100`}
          strokeLinecap="round"
          fill="transparent"
          transform="rotate(-90 18 18)"
        ></circle>
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={cn("text-5xl font-bold font-headline", styles.textColor)}>
          {score.toFixed(1)}
        </span>
        <span className="text-sm text-muted-foreground">/ 10</span>
      </div>
    </div>
  );
}

    