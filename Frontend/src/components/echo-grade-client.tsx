
import { useState } from "react";
import { Award, Lightbulb, MessageSquare, Loader2, MinusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ScoreDisplay } from "@/components/score-display";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { config } from "@/config/env";

const questionData = {
  questionId: "q101",
  question: "In a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides. i.e.If the triangle has sides AB, BC, and hypotenuse AC, then: AC^2 = AB^2 + BC^2. State the proof of Pythagoras' Theorem using similar triangle proof",
  topic: "Mathematical Proofs"
};

const userData = {
  userId: "test-user-01" 
};

type Feedback = {
  score_out_of_10?: number;
  verdict?: string;
  comment?: string;
  advice?: string;
  unmatched_equations?: string[];
};

type AnalysisResult = {
  feedback?: Feedback;
};


export function EchoGradeClient() {
  const [studentAnswer, setStudentAnswer] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const API_URL = config.API_URL;

  const handleSubmit = async () => {
    if (!studentAnswer.trim()) {
      toast({
        title: "Answer is empty",
        description: "Please provide an answer before getting feedback.",
        variant: "destructive",
      });
      return;
    }
    
    if (!API_URL) {
      toast({
        title: "Configuration Error",
        description: "The backend API URL is not configured. Please set VITE_ECHOGRADE_API_URL in your .env file.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      // Step 1: Submit the student's answer
      const submitResponse = await fetch(`${API_URL}/api/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: questionData.questionId,
          questionText: questionData.question,
          answerText: studentAnswer,
        }),
        // Add timeout and signal
        signal: AbortSignal.timeout(120000), // 2 minutes timeout
      });

      if (!submitResponse.ok) {
        throw new Error(`Failed to submit answer: ${submitResponse.status} ${submitResponse.statusText}`);
      }

      // Step 2: Get the analysis
      const analyzeResponse = await fetch(`${API_URL}/analyze/${questionData.questionId}/${userData.userId}`, {
        // Add timeout and signal
        signal: AbortSignal.timeout(120000), // 2 minutes timeout
      });
      
      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(errorData.detail || `Failed to get feedback: ${analyzeResponse.status} ${analyzeResponse.statusText}`);
      }

      const analysisData = await analyzeResponse.json();
      
      const analysisResult = analysisData?.results?.[0];

      if (analysisResult && analysisResult.feedback) {
        console.log('Backend feedback received:', analysisResult.feedback);
        setResult({ feedback: analysisResult.feedback });
      } else {
        throw new Error("No feedback found in the analysis response.");
      }

    } catch (e: any) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      let errorTitle = "Error";
      
      if (e.name === 'TimeoutError') {
        errorTitle = "Request Timeout";
        errorMessage = "The request took too long to complete. This might be due to high server load. Please try again.";
      } else if (e.name === 'AbortError') {
        errorTitle = "Request Cancelled";
        errorMessage = "The request was cancelled. Please try again.";
      } else if (e.message) {
        errorMessage = e.message;
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const displayScore = result?.feedback?.score_out_of_10;
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center space-y-6">
        <div className="flex justify-center">
          <img src="/src/app/echograde_logo.png" alt="EchoGrade Logo" className="size-20 object-contain drop-shadow-sm" />
        </div>
        <div className="space-y-3">
          <h1 className="font-headline text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">EchoGrade</h1>
          <p className="text-lg text-muted-foreground font-medium">Smart Feedback. Accurate Scoring. Every Time.</p>
        </div>
      </header>
      
      <Card className="shadow-lg border-border/20">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Question</CardTitle>
          <CardDescription>{questionData.topic}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-foreground/90">{questionData.question}</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Textarea
          placeholder="Type your answer here..."
          value={studentAnswer}
          onChange={(e) => setStudentAnswer(e.target.value)}
          className="min-h-[200px] text-base border-border focus-visible:ring-primary !rounded-xl text-md p-4"
          disabled={isLoading}
        />
        <Button onClick={handleSubmit} disabled={isLoading || !studentAnswer.trim()} size="lg" className="w-full sm:w-auto !rounded-xl font-bold">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Analyzing... Please wait" : "Get Feedback"}
        </Button>
        {isLoading && (
          <p className="text-sm text-muted-foreground text-center">
            This may take a few minutes. Please don't close the page.
          </p>
        )}
      </div>

      {isLoading && <FeedbackSkeleton />}
      
      {result && result.feedback && (
        <Card className="bg-card/80 border-primary/20 shadow-lg !rounded-xl">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Your Result</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1 flex justify-center">
               <ScoreDisplay score={typeof displayScore === 'number' ? displayScore : null} />
            </div>
            <div className="md:col-span-2 space-y-6">
              {result.feedback.verdict && (
                <div className="space-y-3">
                  <h3 className="font-headline text-xl font-semibold flex items-center gap-2">
                    <Award className="text-accent" />
                    Verdict
                  </h3>
                  <Badge variant="secondary" className="text-base font-medium">{result.feedback.verdict}</Badge>
                </div>
              )}

              {result.feedback.comment && (
                <div className="space-y-3">
                  <h3 className="font-headline text-xl font-semibold flex items-center gap-2">
                    <MessageSquare className="text-accent" />
                    Comment
                  </h3>
                  <p className="leading-relaxed text-foreground/90 bg-background/70 p-4 rounded-lg border">
                    {result.feedback.comment}
                  </p>
                </div>
              )}

              {result.feedback.advice && (
                <div className="space-y-3">
                  <h3 className="font-headline text-xl font-semibold flex items-center gap-2">
                    <Lightbulb className="text-accent" />
                    Advice
                  </h3>
                  <p className="leading-relaxed text-foreground/90 bg-background/70 p-4 rounded-lg border">
                    {result.feedback.advice}
                  </p>
                </div>
              )}

              {result.feedback.unmatched_equations && Array.isArray(result.feedback.unmatched_equations) && result.feedback.unmatched_equations.length > 0 && (
                <div className="space-y-3">
                   <h3 className="font-headline text-xl font-semibold flex items-center gap-2">
                    <MinusCircle className="text-destructive" />
                    Unmatched Equations
                  </h3>
                  <div className="leading-relaxed text-foreground/90 bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                    <p className="font-medium text-destructive">You may have missed these key steps:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                      {result.feedback.unmatched_equations.map((eq, index) => (
                        <li key={index} className="text-destructive/80">{eq}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const FeedbackSkeleton = () => (
  <Card className="bg-card/80 border-primary/20 shadow-lg !rounded-xl">
    <CardHeader>
      <Skeleton className="h-8 w-1/2 rounded-md" />
    </CardHeader>
    <CardContent className="grid md:grid-cols-3 gap-8 items-start">
      <div className="md:col-span-1 flex justify-center">
        <Skeleton className="size-36 rounded-full" />
      </div>
      <div className="md:col-span-2 space-y-6">
        <div className="space-y-3">
            <Skeleton className="h-7 w-1/4 rounded-md" />
            <Skeleton className="h-6 w-1/3 rounded-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-7 w-1/4 rounded-md" />
          <div className="space-y-2 p-4 border rounded-lg bg-background/70">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
         <div className="space-y-3">
          <Skeleton className="h-7 w-1/4 rounded-md" />
          <div className="space-y-2 p-4 border rounded-lg bg-background/70">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

    