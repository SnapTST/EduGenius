
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { aiTutor } from '@/ai/flows/ai-tutor';
import { Loader } from '@/components/loader';
import { User, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  question: z.string().min(1, 'Please enter a question.'),
});

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AiTutorPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const { toast } = useToast();
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
    },
  });

  React.useEffect(() => {
    if (scrollAreaRef.current) {
        // @ts-ignore
        scrollAreaRef.current.children[1].scrollTop = scrollAreaRef.current.children[1].scrollHeight;
    }
  }, [messages]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: values.question };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    try {
      const result = await aiTutor({ question: values.question });
      const assistantMessage: Message = { role: 'assistant', content: result.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with the AI Tutor. Please try again.',
      });
      console.error(error);
      setMessages((prev) => prev.slice(0, -1)); // Remove user message on error
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppLayout>
      <PageHeader
        title="AI Tutor"
        description="Ask any question and get a detailed explanation from your AI-powered tutor."
      />
      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-0">
          <ScrollArea className="h-[500px] p-6" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.length === 0 && (
                 <div className="text-center text-muted-foreground pt-24">
                   <Sparkles className="mx-auto h-12 w-12 text-primary/40" />
                   <p className="mt-4">Start by asking a question below.</p>
                 </div>
              )}
              {messages.map((message, index) => (
                <div key={index} className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {message.role === 'user' ? <User /> : <Sparkles />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">
                      {message.role === 'user' ? 'You' : 'AI Tutor'}
                    </p>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br />') }} />
                  </div>
                </div>
              ))}
               {isLoading && (
                  <div className="flex items-start gap-4">
                     <Avatar>
                        <AvatarFallback><Sparkles /></AvatarFallback>
                     </Avatar>
                     <div className="flex-1">
                       <p className="font-semibold">AI Tutor</p>
                       <Loader />
                     </div>
                  </div>
                )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-center gap-2">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Textarea
                        placeholder="Type your question here, e.g., 'Explain Newton's First Law'"
                        className="resize-none"
                        {...field}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                form.handleSubmit(onSubmit)();
                            }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Thinking...' : 'Ask'}
              </Button>
            </form>
          </Form>
        </CardFooter>
      </Card>
    </AppLayout>
  );
}
