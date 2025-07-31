
'use client';

import * as React from 'react';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader } from '@/components/loader';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Camera, Copy, Check } from 'lucide-react';
import { extractTextFromImage } from '@/ai/flows/extract-text-from-image';
import { Textarea } from '@/components/ui/textarea';

export default function ChapterScannerPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [extractedText, setExtractedText] = React.useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | undefined>(undefined);
  const [isCopied, setIsCopied] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }

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
    setExtractedText(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUri = canvas.toDataURL('image/jpeg');
      
      try {
        const result = await extractTextFromImage({ imageDataUri });
        setExtractedText(result.extractedText);
        toast({
          title: 'Text Extracted!',
          description: 'Successfully scanned the chapter.',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem extracting text from the image. Please try again.',
        });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleCopyToClipboard = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText);
      setIsCopied(true);
      toast({ title: 'Copied to clipboard!' });
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Textbook Chapter Scanner"
        description="Point your camera at a textbook page to extract the text."
      />
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Camera Feed</CardTitle>
            <CardDescription>Position the textbook page within the frame and click scan.</CardDescription>
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
              {isLoading ? 'Scanning...' : 'Scan Chapter'}
            </Button>
          </CardContent>
        </Card>

        <div className="sticky top-24">
          <Card className="min-h-[400px]">
            <CardHeader>
               <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="font-headline">Extracted Text</CardTitle>
                  <CardDescription>The text from your scan will appear here.</CardDescription>
                </div>
                {extractedText && (
                  <Button variant="outline" size="icon" onClick={handleCopyToClipboard}>
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && <Loader />}
              {!isLoading && !extractedText && (
                <div className="text-center text-muted-foreground py-16">
                  <p>Scan a page to get started.</p>
                </div>
              )}
              {extractedText && (
                <Textarea
                  readOnly
                  value={extractedText}
                  className="w-full h-96 resize-none font-body text-sm"
                  placeholder="Extracted text will appear here"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
