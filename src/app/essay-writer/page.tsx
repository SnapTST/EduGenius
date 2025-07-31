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
import { essayWriter } from '@/ai/flows/essay-writer';
import { Loader } from '@/components/loader';
import { PenSquare, Copy, Check } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import InArticleAd2 from '@/components/ads/in-article-ad-2';

const formSchema = z.object({
  topic: z.string().min(5, 'Please enter a clear topic or title.'),
  type: z.enum(['persuasive', 'narrative', 'expository', 'descriptive', 'creative']),
  length: z.enum(['short', 'medium', 'long']),
  tone: z.enum(['formal', 'informal', 'academic', 'journalistic', 'creative']),
});

export default function EssayWriterPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [generatedContent, setGeneratedContent] = React.useState<string | null>(null);
  const [isCopied, setIsCopied] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      type: 'expository',
      length: 'medium',
      tone: 'academic',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedContent(null);
    try {
      const result = await essayWriter(values);
      setGeneratedContent(result.content);
      toast({
        title: 'Content Generated!',
        description: 'Your essay/story is ready.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating your content. Please try again.',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      setIsCopied(true);
      toast({ title: 'Copied to clipboard!' });
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Essay & Story Writer"
        description="Generate high-quality written content for your assignments in seconds."
      />
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Writing Requirements</CardTitle>
            <CardDescription>Fill in the details to generate your content.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic / Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., The Impact of AI on Society" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Writing</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="expository">Expository</SelectItem>
                            <SelectItem value="persuasive">Persuasive</SelectItem>
                            <SelectItem value="narrative">Narrative</SelectItem>
                            <SelectItem value="descriptive">Descriptive</SelectItem>
                            <SelectItem value="creative">Creative</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Length</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select length" />
                            </Trigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="short">Short</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="long">Long</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tone" />
                            </Trigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="academic">Academic</SelectItem>
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="informal">Informal</SelectItem>
                            <SelectItem value="journalistic">Journalistic</SelectItem>
                            <SelectItem value="creative">Creative</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  <PenSquare className="mr-2" />
                  {isLoading ? 'Writing...' : 'Generate Content'}
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
                  <CardTitle className="font-headline">Generated Content</CardTitle>
                  <CardDescription>Review your generated essay or story below.</CardDescription>
                </div>
                {generatedContent && (
                  <Button variant="outline" size="icon" onClick={handleCopyToClipboard}>
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="printable-container">
                {isLoading && <Loader />}
                {!isLoading && !generatedContent && (
                  <div className="text-center text-muted-foreground py-16">
                    <p>Your generated content will appear here.</p>
                  </div>
                )}
                {generatedContent && (
                  <>
                    <Textarea
                        readOnly
                        value={generatedContent}
                        className="w-full h-[500px] resize-none font-body text-sm whitespace-pre-wrap"
                        placeholder="Generated content will appear here"
                    />
                    <InArticleAd2 />
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}