
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Timer, AlertCircle, ChevronLeft, ChevronRight, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Mock Exam Questions
const MOCK_QUESTIONS = [
  {
    id: 1,
    text: "What is the SI unit of force?",
    options: ["Newton", "Joule", "Watt", "Pascal"],
    correct: 0
  },
  {
    id: 2,
    text: "Which law states that for every action there is an equal and opposite reaction?",
    options: ["Newton's 1st Law", "Newton's 2nd Law", "Newton's 3rd Law", "Kepler's Law"],
    correct: 2
  },
  {
    id: 3,
    text: "The rate of change of displacement is known as:",
    options: ["Speed", "Acceleration", "Velocity", "Momentum"],
    correct: 2
  },
  {
    id: 4,
    text: "Kinetic energy is given by which formula?",
    options: ["mgh", "F = ma", "1/2 mv²", "P = IV"],
    correct: 2
  }
];

export default function TakeExamPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const examId = searchParams.get("id");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelect = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQuestion]: optionIndex });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    toast({
      title: language === 'en' ? "Exam Submitted" : "Examen Soumis",
      description: language === 'en' ? "Your answers have been saved and graded." : "Vos réponses ont été enregistrées et notées.",
    });
    // Simulate submission delay
    setTimeout(() => {
      router.push(`/dashboard/exams/results?id=NEW_SUBMISSION&examId=${examId}`);
    }, 1500);
  };

  const question = MOCK_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / MOCK_QUESTIONS.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} disabled={isSubmitted}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-bold text-lg md:text-xl line-clamp-1">Mid-Term Physics MCQ</h1>
            <p className="text-xs text-muted-foreground">Question {currentQuestion + 1} of {MOCK_QUESTIONS.length}</p>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold text-sm shadow-sm",
          timeLeft < 300 ? "bg-red-500 text-white animate-pulse" : "bg-primary text-white"
        )}>
          <Timer className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="space-y-8 pb-20">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader className="pb-8">
            <CardTitle className="text-xl md:text-2xl leading-relaxed">
              {question.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={answers[currentQuestion]?.toString()} 
              onValueChange={(val) => handleSelect(parseInt(val))}
              className="space-y-3"
            >
              {question.options.map((option, idx) => (
                <div key={idx} className={cn(
                  "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/50",
                  answers[currentQuestion] === idx ? "border-primary bg-primary/5 shadow-inner" : "border-accent bg-accent/10"
                )} onClick={() => handleSelect(idx)}>
                  <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} className="sr-only" />
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0",
                    answers[currentQuestion] === idx ? "border-primary bg-primary text-white" : "border-muted-foreground/30"
                  )}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <Label htmlFor={`opt-${idx}`} className="flex-1 text-base cursor-pointer font-medium">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between border-t mt-8 pt-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0 || isSubmitted}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            
            {currentQuestion === MOCK_QUESTIONS.length - 1 ? (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitted || Object.keys(answers).length < MOCK_QUESTIONS.length}
                className="gap-2 bg-green-600 hover:bg-green-700 shadow-lg"
              >
                <Send className="w-4 h-4" /> {t("submitExam")}
              </Button>
            ) : (
              <Button 
                onClick={() => setCurrentQuestion(prev => Math.min(MOCK_QUESTIONS.length - 1, prev + 1))}
                disabled={isSubmitted || answers[currentQuestion] === undefined}
                className="gap-2"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </CardFooter>
        </Card>

        {Object.keys(answers).length < MOCK_QUESTIONS.length && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
            <AlertCircle className="w-5 h-5" />
            <p>{language === 'en' ? "Please answer all questions before submitting." : "Veuillez répondre à toutes les questions avant de soumettre."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
