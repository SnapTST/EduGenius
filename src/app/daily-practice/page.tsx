
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { generateQuiz, GenerateQuizOutput } from '@/ai/flows/generate-quiz';
import { Loader } from '@/components/loader';
import { cn } from '@/lib/utils';
import { Check, X, ArrowRight, RotateCw, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  topic: z.string().min(3, 'Please enter a topic.'),
  numberOfQuestions: z.coerce.number().int().min(1).max(10),
});

type Question = GenerateQuizOutput['questions'][0];

export default function DailyPracticePage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [quiz, setQuiz] = React.useState<GenerateQuizOutput | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [score, setScore] = React.useState(0);
  const [isAnswered, setIsAnswered] = React.useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      numberOfQuestions: 5,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setQuiz(null);
    try {
      const result = await generateQuiz(values);
      setQuiz(result);
      resetQuizState();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating the quiz. Please try again.',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const resetQuizState = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsAnswered(false);
  };
  
  const handleStartOver = () => {
    setQuiz(null);
    resetQuizState();
    form.reset();
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    if (answerIndex === quiz?.questions[currentQuestionIndex].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };
  
  const currentQuestion: Question | undefined = quiz?.questions[currentQuestionIndex];
  const isQuizFinished = quiz && currentQuestionIndex === quiz.questions.length -1 && isAnswered;

  return (
    <AppLayout>
      <PageHeader
        title="Daily Practice"
        description="Sharpen your knowledge with a quick, AI-generated quiz on any topic."
      />
      <div className="max-w-3xl mx-auto">
        {!quiz ? (
          <Card>
            <CardHeader>
              <CardTitle>Create a Quiz</CardTitle>
              <CardDescription>Enter a topic and the number of questions to start.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., The Solar System" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numberOfQuestions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Questions</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? 'Generating Quiz...' : 'Start Quiz'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
           <Card>
                <CardHeader>
                    <Progress value={((currentQuestionIndex + (isAnswered ? 1: 0)) / quiz.questions.length) * 100} className="mb-2" />
                    <CardTitle className="font-headline">Question {currentQuestionIndex + 1} of {quiz.questions.length}</CardTitle>
                    <CardDescription className="text-lg font-semibold h-20">{currentQuestion?.questionText}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQuestion?.options.map((option, index) => {
                            const isCorrect = index === currentQuestion.correctAnswerIndex;
                            const isSelected = index === selectedAnswer;

                            return (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className={cn(
                                        "h-auto justify-start p-4 text-left whitespace-normal",
                                        isAnswered && isCorrect && "bg-green-100 border-green-500 text-green-800 hover:bg-green-200",
                                        isAnswered && isSelected && !isCorrect && "bg-red-100 border-red-500 text-red-800 hover:bg-red-200"
                                    )}
                                    onClick={() => handleAnswerSelect(index)}
                                    disabled={isAnswered}
                                >
                                    <div className="flex-1">{option}</div>
                                    {isAnswered && isCorrect && <Check className="h-5 w-5 text-green-600" />}
                                    {isAnswered && isSelected && !isCorrect && <X className="h-5 w-5 text-red-600" />}
                                </Button>
                            )
                        })}
                    </div>
                    {isAnswered && (
                        <div className="mt-6 p-4 bg-muted/50 rounded-md border">
                            <h4 className="font-bold">Explanation</h4>
                            <p className="text-sm text-muted-foreground">{currentQuestion?.explanation}</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end">
                    {!isQuizFinished ? (
                         <Button onClick={handleNextQuestion} disabled={!isAnswered}>
                            Next Question <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ): (
                        <Card className="w-full text-center p-8 bg-secondary">
                            <CardTitle className="font-headline text-2xl">Quiz Complete!</CardTitle>
                            <CardDescription className="mt-2 text-lg">You scored</CardDescription>
                            <div className="my-4">
                                <span className="text-5xl font-bold text-primary">{score}</span>
                                <span className="text-2xl text-muted-foreground"> / {quiz.questions.length}</span>
                            </div>
                            <Button onClick={handleStartOver}>
                                <RotateCw className="mr-2 h-4 w-4" />
                                Start a New Quiz
                            </Button>
                        </Card>
                    )}
                </CardFooter>
           </Card>
        )}
         {isLoading && <Loader />}
      </div>
    </AppLayout>
  );
}
