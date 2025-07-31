
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';

import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { extractTextFromImage } from '@/ai/flows/extract-text-from-image';
import { generateFlashcards } from '@/ai/flows/generate-flashcards';
import { Loader } from '@/components/loader';
import { Upload, ArrowLeft, ArrowRight, RotateCw, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  documentDataUri: z.string().refine((val) => val.startsWith('data:'), {
    message: 'Please upload a valid file.',
  }),
});

type Flashcard = {
  question: string;
  answer: string;
};

export default function FlashcardCreatorPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [flashcards, setFlashcards] = React.useState<Flashcard[] | null>(null);
  const [fileName, setFileName] = React.useState<string>('');
  const { toast } = useToast();
  
  const [currentCard, setCurrentCard] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentDataUri: '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFlashcards(null);
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('documentDataUri', dataUri);
        form.handleSubmit(onSubmit)();
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setFlashcards(null);
    setCurrentCard(0);
    setIsFlipped(false);
    try {
      // 1. Extract text from the uploaded document
      const { extractedText } = await extractTextFromImage({ imageDataUri: values.documentDataUri });
       if (!extractedText) {
        throw new Error('Could not extract text from the document.');
      }
      
      // 2. Generate flashcards from the extracted text
      const result = await generateFlashcards({ content: extractedText, numberOfFlashcards: 10 });
      setFlashcards(result.flashcards);
       toast({
        title: 'Flashcards Generated!',
        description: 'Your flashcards are ready for studying.',
      });
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating your flashcards. Please try again.',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleNextCard = () => {
    if (flashcards) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentCard((prev) => (prev + 1) % flashcards.length);
      }, 150);
    }
  };

  const handlePrevCard = () => {
    if (flashcards) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
      }, 150);
    }
  };
  
  const flipCard = () => {
      setIsFlipped(f => !f);
  }

  return (
    <AppLayout>
      <PageHeader
        title="AI Flashcard Generator"
        description="Upload a document, and we'll automatically create flashcards for you."
      />
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
              <CardTitle className="font-headline">Upload Document</CardTitle>
              <CardDescription>Select an image or PDF file to generate flashcards from.</CardDescription>
          </CardHeader>
          <CardContent>
              <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                  control={form.control}
                  name="documentDataUri"
                  render={() => (
                      <FormItem>
                      <FormControl>
                          <div className="relative">
                          <Input
                              id="file-upload"
                              type="file"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              accept="image/*,application/pdf"
                              onChange={handleFileChange}
                              disabled={isLoading}
                          />
                          <label
                              htmlFor="file-upload"
                              className={cn(
                                "flex items-center justify-center w-full h-32 px-4 text-center border-2 border-dashed rounded-md border-border text-muted-foreground transition-colors",
                                !isLoading && "cursor-pointer hover:border-primary hover:text-primary",
                                isLoading && "cursor-wait"
                              )}
                          >
                              {isLoading ? <Loader /> : (
                                fileName ? (
                                  <span>{fileName}</span>
                                ) : (
                                <div className="flex flex-col items-center gap-1">
                                    <Upload className="w-8 h-8" />
                                    <span>Click to upload or drag and drop</span>
                                    <span className="text-xs">PDF or Image file</span>
                                </div>
                                )
                              )}
                          </label>
                          </div>
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </form>
              </Form>
          </CardContent>
        </Card>

        {flashcards && (
            <Card className="mt-8 min-h-[400px] flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                        <CardTitle className="font-headline">Generated Flashcards</CardTitle>
                        <CardDescription>Click on a card to flip it.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-center items-center">
                    {flashcards.length > 0 ? (
                        <div className="w-full">
                             <div className="relative h-64 w-full" style={{ perspective: 1000 }}>
                                <AnimatePresence initial={false}>
                                    <motion.div
                                        key={currentCard}
                                        className="absolute w-full h-full"
                                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: -50, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                        style={{ transformStyle: "preserve-3d" }}
                                    >
                                        <motion.div
                                            className="absolute w-full h-full rounded-lg shadow-lg cursor-pointer"
                                            style={{ backfaceVisibility: "hidden" }}
                                            onClick={flipCard}
                                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            {/* Front of the card */}
                                            <div className="absolute w-full h-full rounded-lg flex items-center justify-center p-6 text-center text-lg font-semibold bg-primary text-primary-foreground">
                                                <div>
                                                    <h3 className="text-sm font-bold uppercase text-primary-foreground/70 mb-2">Question</h3>
                                                    {flashcards[currentCard].question}
                                                </div>
                                            </div>
                                            {/* Back of the card */}
                                            <div className="absolute w-full h-full rounded-lg flex items-center justify-center p-6 text-center text-lg font-semibold bg-secondary" style={{ transform: "rotateY(180deg)" }}>
                                                <div>
                                                    <h3 className="text-sm font-bold uppercase text-muted-foreground mb-2">Answer</h3>
                                                    {flashcards[currentCard].answer}
                                                </div>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <Button variant="outline" size="icon" onClick={handlePrevCard}>
                                <ArrowLeft />
                                </Button>
                                <div className="text-sm font-medium text-muted-foreground">
                                {currentCard + 1} / {flashcards.length}
                                </div>
                                <Button variant="outline" size="icon" onClick={handleNextCard}>
                                <ArrowRight />
                                </Button>
                            </div>
                            <div className="text-center mt-2">
                                <Button variant="ghost" size="sm" onClick={flipCard}>
                                    <RotateCw className="mr-2 h-4 w-4"/>
                                    Flip Card
                                </Button>
                            </div>
                        </div>
                    ) : (
                         <div className="text-center text-muted-foreground py-16">
                            <p>No flashcards were generated. The document might be empty or unreadable.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        )}
      </div>
    </AppLayout>
  );
}
