
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
import { Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  topics: z.string().min(3, 'Please enter at least one topic.'),
  documentDataUri: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  numberOfQuestions: z.coerce.number().int().min(1).max(20),
  totalMarks: z.coerce.number().int().min(1).max(100),
  language: z.string().min(2, 'Please select a language.'),
});

export default function TestGeneratorPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [testPaper, setTestPaper] = React.useState<string | null>(null);
  const { toast } = useToast();
  const printableRef = React.useRef<HTMLDivElement>(null);
  const [fileName, setFileName] = React.useState<string>('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topics: '',
      difficulty: 'medium',
      numberOfQuestions: 5,
      totalMarks: 10,
      language: 'English',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('documentDataUri', dataUri);
        if(!form.getValues('topics')) {
          form.setValue('topics', file.name); 
        }
      };
      reader.readAsDataURL(file);
    }
  };


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
            <CardDescription>Fill in the details to generate your test from topics or an uploaded document.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topics (or describe document)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Algebra, Photosynthesis, World War II" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="documentDataUri"
                  render={() => (
                    <FormItem>
                      <FormLabel>Upload Document (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="file-upload"
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                          />
                          <label
                            htmlFor="file-upload"
                            className="flex items-center justify-center w-full h-32 px-4 text-center border-2 border-dashed rounded-md border-border text-muted-foreground cursor-pointer hover:border-primary hover:text-primary transition-colors"
                          >
                            {fileName ? (
                              <span>{fileName}</span>
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <Upload className="w-8 h-8" />
                                <span>Click to upload or drag and drop</span>
                                <span className="text-xs">PDF or Image file</span>
                              </div>
                            )}
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Spanish">Spanish</SelectItem>
                            <SelectItem value="French">French</SelectItem>
                            <SelectItem value="German">German</SelectItem>
                            <SelectItem value="Hindi">Hindi</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    name="totalMarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Marks</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="100" {...field} />
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
            <CardContent ref={printableRef} className="printable-container">
              {isLoading && <Loader />}
              {!isLoading && !testPaper && (
                <div className="text-center text-muted-foreground py-16">
                  <p>Your generated test will appear here.</p>
                </div>
              )}
              {testPaper && <pre className="whitespace-pre-wrap font-body text-sm">{testPaper}</pre>}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
