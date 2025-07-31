
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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { generateFlashcards } from '@/ai/flows/generate-flashcards';
import { Loader } from '@/components/loader';
import { PrintButton } from '@/components/print-button';
import { ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  content: z.string().min(50, 'Please enter at least 50 characters of content.'),
  numberOfFlashcards: z.coerce.number().int().min(1).max(20),
});

type Flashcard = {
  question: string;
  answer: string;
};

export default function FlashcardCreatorPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [flashcards, setFlashcards] = React.useState<Flashcard[] | null>(null);
  const [currentCard, setCurrentCard] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
      numberOfFlashcards: 5,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setFlashcards(null);
    setCurrentCard(0);
    setIsFlipped(false);
    try {
      const result = await generateFlashcards(values);
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
      setCurrentCard((prev) => (prev + 1) % flashcards.length);
    }
  };

  const handlePrevCard = () => {
    if (flashcards) {
      setIsFlipped(false);
      setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }
  };
  
  const cardVariants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="AI Flashcard Creator"
        description="Generate interactive flashcards from your notes or any text."
      />
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Source Content</CardTitle>
            <CardDescription>Paste the text you want to turn into flashcards.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your notes or any text here..."
                          className="min-h-[200px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numberOfFlashcards"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Flashcards</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Generating...' : 'Create Flashcards'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="sticky top-24">
          <Card className="min-h-[400px] flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="font-headline">Generated Flashcards</CardTitle>
                  <CardDescription>Click on a card to flip it.</CardDescription>
                </div>
                {flashcards && flashcards.length > 0 && <PrintButton />}
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center items-center">
              {isLoading && <Loader />}
              {!isLoading && !flashcards && (
                <div className="text-center text-muted-foreground py-16">
                  <p>Your generated flashcards will appear here.</p>
                </div>
              )}
              {flashcards && flashcards.length === 0 && (
                <div className="text-center text-muted-foreground py-16">
                  <p>No flashcards generated. Try adjusting your content.</p>
                </div>
              )}
              {flashcards && flashcards.length > 0 && (
                <div className="w-full">
                  <div 
                    className="relative h-64 w-full cursor-pointer"
                    style={{ perspective: 1000 }}
                    onClick={() => setIsFlipped(!isFlipped)}
                  >
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={currentCard}
                        custom={1}
                        variants={cardVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          x: { type: "spring", stiffness: 300, damping: 30 },
                          opacity: { duration: 0.2 }
                        }}
                        className={cn(
                          "absolute w-full h-full rounded-lg shadow-lg flex items-center justify-center p-6 text-center text-lg font-semibold",
                          isFlipped ? 'bg-secondary' : 'bg-primary text-primary-foreground',
                        )}
                        style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', rotateY: isFlipped ? 180 : 0}}
                      >
                         <div style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', display: !isFlipped ? 'none' : 'block' }}>
                            <h3 className="text-sm font-bold uppercase text-muted-foreground mb-2">Answer</h3>
                            {flashcards[currentCard].answer}
                         </div>
                         <div style={{ backfaceVisibility: 'hidden', display: isFlipped ? 'none' : 'block' }}>
                            <h3 className="text-sm font-bold uppercase text-primary-foreground/70 mb-2">Question</h3>
                            {flashcards[currentCard].question}
                         </div>
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
                    <Button variant="ghost" size="sm" onClick={() => setIsFlipped(!isFlipped)}>
                        <RotateCw className="mr-2 h-4 w-4"/>
                        Flip Card
                    </Button>
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
