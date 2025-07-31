
'use client';

import * as React from 'react';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader } from '@/components/loader';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Camera, Sparkles, User } from 'lucide-react';
import { doubtSolver } from '@/ai/flows/doubt-solver';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

type DoubtResult = {
    question: string;
    answer: string;
};

export default function DoubtSolverPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<DoubtResult | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | undefined>(undefined);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const getCameraPermission = async () => {
      if (typeof window !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
          });
        }
      } else {
        setHasCameraPermission(false);
        toast({
            variant: 'destructive',
            title: 'Camera Not Supported',
            description: 'Your browser does not support camera access.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  const handleScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsLoading(true);
    setResult(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUri = canvas.toDataURL('image/jpeg');
      
      try {
        const solveResult = await doubtSolver({ imageDataUri });
        setResult(solveResult);
        toast({
          title: 'Doubt Solved!',
          description: 'The AI has provided an answer to your question.',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem solving your doubt. Please try again.',
        });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Doubt Solver"
        description="Snap a picture of a question from your textbook or notes to get an instant answer."
      />
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Scan your Question</CardTitle>
            <CardDescription>Position the question within the frame and click scan.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video w-full bg-muted rounded-md overflow-hidden">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              <canvas ref={canvasRef} className="hidden" />
              {hasCameraPermission === false && (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <Alert variant="destructive">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                      Please allow camera access in your browser to use this feature. You might need to refresh the page after granting permission.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
               {hasCameraPermission === undefined && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader />
                </div>
              )}
            </div>
            <Button onClick={handleScan} disabled={isLoading || hasCameraPermission !== true} className="w-full mt-4">
              <Camera className="mr-2" />
              {isLoading ? 'Solving...' : 'Solve Doubt'}
            </Button>
          </CardContent>
        </Card>

        <div className="sticky top-24">
          <Card className="min-h-[400px]">
            <CardHeader>
               <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="font-headline">AI-Generated Answer</CardTitle>
                  <CardDescription>The answer to your scanned question will appear here.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && <Loader />}
              {!isLoading && !result && (
                <div className="text-center text-muted-foreground py-16">
                  <p>Scan a question to get started.</p>
                </div>
              )}
              {result && (
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <Avatar>
                            <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-semibold">Your Question</p>
                            <div className="prose prose-sm max-w-none">
                                <p>{result.question}</p>
                            </div>
                        </div>
                    </div>
                    <Separator />
                     <div className="flex items-start gap-4">
                        <Avatar>
                            <AvatarFallback><Sparkles /></AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-semibold">AI Tutor's Answer</p>
                            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: result.answer.replace(/\\n/g, '<br />') }} />
                        </div>
                    </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
