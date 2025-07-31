
'use client';

import * as React from 'react';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/loader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Swords, User, Check, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { generateQuiz, GenerateQuizOutput } from '@/ai/flows/generate-quiz';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type GameState = 'idle' | 'finding' | 'playing' | 'finished';
type Question = GenerateQuizOutput['questions'][0];

const opponent = {
  name: 'AI Challenger',
  avatar: 'https://placehold.co/40x40',
  aiHint: 'robot face',
};

export default function McqBattlePage() {
  const [gameState, setGameState] = React.useState<GameState>('idle');
  const [quiz, setQuiz] = React.useState<GenerateQuizOutput | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [playerScore, setPlayerScore] = React.useState(0);
  const [opponentScore, setOpponentScore] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [isAnswered, setIsAnswered] = React.useState(false);
  const { toast } = useToast();

  const handleFindMatch = async () => {
    setGameState('finding');
    try {
      const generatedQuiz = await generateQuiz({ topic: 'General Knowledge', numberOfQuestions: 5 });
      setQuiz(generatedQuiz);
      // Simulate finding a match
      setTimeout(() => {
        setGameState('playing');
        resetQuizState();
      }, 2000);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to create a quiz.',
        description: 'Please try finding a match again.',
      });
      setGameState('idle');
    }
  };

  const resetQuizState = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setPlayerScore(0);
    setOpponentScore(0);
    setIsAnswered(false);
  };
  
  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    if (answerIndex === quiz?.questions[currentQuestionIndex].correctAnswerIndex) {
      setPlayerScore((s) => s + 1);
    }
    
    // Simulate opponent's answer
    setTimeout(() => {
      const opponentCorrect = Math.random() > 0.4; // 60% chance of being correct
      if (opponentCorrect) {
          setOpponentScore(s => s + 1);
      }
      
      setTimeout(() => {
        if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setGameState('finished');
        }
      }, 1500);

    }, 500);

  };

  const currentQuestion: Question | undefined = quiz?.questions[currentQuestionIndex];
  const winner = playerScore > opponentScore ? 'You' : playerScore < opponentScore ? opponent.name : 'Draw';

  return (
    <AppLayout>
      <PageHeader
        title="MCQ Battle"
        description="Challenge other students in a real-time quiz."
      />
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Swords />
            Quiz Battle Arena
          </CardTitle>
          <CardDescription>Test your knowledge against a random opponent.</CardDescription>
        </CardHeader>
        <CardContent>
          {gameState === 'idle' && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-headline font-semibold mb-4">Ready for a Challenge?</h2>
              <p className="text-muted-foreground mb-6">Click the button below to find a match and start the battle.</p>
              <Button size="lg" onClick={handleFindMatch}>
                Find Match
              </Button>
            </div>
          )}

          {gameState === 'finding' && (
            <div className="text-center py-16">
              <Loader />
              <p className="mt-4 text-lg text-muted-foreground animate-pulse">Finding an opponent...</p>
            </div>
          )}

          {(gameState === 'playing' || gameState === 'finished') && quiz && (
            <div>
              <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                  <div className="p-4 bg-muted rounded-lg">
                      <Avatar className="mx-auto h-16 w-16 mb-2">
                         <AvatarImage src="https://placehold.co/40x40" alt="@student" data-ai-hint="person student" />
                         <AvatarFallback>YOU</AvatarFallback>
                      </Avatar>
                      <p className="font-bold">You</p>
                      <p className="text-2xl font-bold text-primary">{playerScore}</p>
                  </div>
                   <div className="p-4 bg-muted rounded-lg">
                      <Avatar className="mx-auto h-16 w-16 mb-2">
                         <AvatarImage src={opponent.avatar} alt={opponent.name} data-ai-hint={opponent.aiHint} />
                         <AvatarFallback>{opponent.name.substring(0,2)}</AvatarFallback>
                      </Avatar>
                      <p className="font-bold">{opponent.name}</p>
                      <p className="text-2xl font-bold text-primary">{opponentScore}</p>
                  </div>
              </div>

               <Progress value={(currentQuestionIndex / quiz.questions.length) * 100} className="mb-4" />

              {gameState === 'playing' && currentQuestion && (
                <div>
                  <p className="text-center text-sm text-muted-foreground mb-2">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
                  <h3 className="text-xl font-semibold text-center mb-6 h-12">{currentQuestion.questionText}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, index) => {
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
                </div>
              )}

              {gameState === 'finished' && (
                <div className="text-center py-12">
                   <Alert variant={winner === 'You' ? 'default' : 'destructive'} className="max-w-md mx-auto">
                        <AlertTitle className="text-2xl font-headline">
                            {winner === 'You' && 'Congratulations, You Won!'}
                            {winner === opponent.name && 'You Lost! Better Luck Next Time.'}
                            {winner === 'Draw' && "It's a Draw!"}
                        </AlertTitle>
                        <AlertDescription className="mt-2 text-lg">
                            Final Score: {playerScore} - {opponentScore}
                        </AlertDescription>
                    </Alert>

                    <Button onClick={() => setGameState('idle')} className="mt-8">
                        Play Again
                    </Button>
                </div>
              )}

            </div>
          )}

        </CardContent>
      </Card>
    </AppLayout>
  );
}
