
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { generateTestPaper } from '@/ai/flows/generate-test-paper';
import { Loader } from '@/components/loader';
import { PrintButton } from '@/components/print-button';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  topics: z.string().min(3, 'Please enter at least one topic.'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  numberOfQuestions: z.coerce.number().int().min(1).max(20),
  marksPerQuestion: z.coerce.number().int().min(1).max(10),
});

export default function TestGeneratorPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [testPaper, setTestPaper] = React.useState<string | null>(null);
  const { toast } = useToast();
  const printableRef = React.useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topics: '',
      difficulty: 'medium',
      numberOfQuestions: 5,
      marksPerQuestion: 2,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setTestPaper(null);
    try {
      const result = await generateTestPaper(values);
      setTestPaper(result.testPaper);
      toast({
        title: 'Test Paper Generated!',
        description: 'Your custom test paper is ready.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating your test paper. Please try again.',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppLayout>
      <PageHeader
        title="AI Test Generator"
        description="Create personalized test papers in seconds. Just enter your requirements below."
      />
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Test Details</CardTitle>
            <CardDescription>Fill in the details to generate your test.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topics</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Algebra, Photosynthesis, World War II" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numberOfQuestions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No. of Questions</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="20" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="marksPerQuestion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marks per Question</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Generating...' : 'Generate Test Paper'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="sticky top-24">
          <Card className="min-h-[400px]">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="font-headline">Generated Test</CardTitle>
                  <CardDescription>Review your test paper below.</CardDescription>
                </div>
                {testPaper && <PrintButton />}
              </div>
            </CardHeader>
            <CardContent>
              <div ref={printableRef} className="printable-container">
                {isLoading && <Loader />}
                {!isLoading && !testPaper && (
                  <div className="text-center text-muted-foreground py-16">
                    <p>Your generated test will appear here.</p>
                  </div>
                )}
                {testPaper && <pre className="whitespace-pre-wrap font-body text-sm">{testPaper}</pre>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
