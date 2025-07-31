
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
import { projectAssistant, ProjectAssistantOutput } from '@/ai/flows/project-assistant';
import { Loader } from '@/components/loader';
import { BrainCircuit, FlaskConical, Lightbulb, List } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  topic: z.string().min(3, 'Please enter a topic.'),
});

type ProjectIdea = ProjectAssistantOutput['ideas'][0];

export default function ProjectAssistantPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [ideas, setIdeas] = React.useState<ProjectIdea[] | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setIdeas(null);
    try {
      const result = await projectAssistant(values);
      setIdeas(result.ideas);
      toast({
        title: 'Ideas Generated!',
        description: 'Here are some project ideas for your topic.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating ideas. Please try again.',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppLayout>
      <PageHeader
        title="Project Assistant"
        description="Get creative and scientific ideas for your next school project."
      />
      <div className="max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Project Ideas</CardTitle>
            <CardDescription>Enter a topic below to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Robotics, Renewable Energy, The Atom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  <Lightbulb className="mr-2" />
                  {isLoading ? 'Generating Ideas...' : 'Generate Ideas'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading && <Loader />}

        {!isLoading && ideas && (
          <div className="space-y-6">
             <h2 className="text-2xl font-headline font-semibold text-center">Project Ideas</h2>
             {ideas.length > 0 ? (
                ideas.map((idea, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <FlaskConical className="text-primary" />
                           {idea.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-muted-foreground mb-4">{idea.description}</p>
                       <h4 className="font-semibold mb-2 flex items-center gap-2"><List /> Materials Needed</h4>
                       <div className="flex flex-wrap gap-2">
                            {idea.materials.map((material, i) => (
                                <Badge key={i} variant="secondary">{material}</Badge>
                            ))}
                       </div>
                    </CardContent>
                </Card>
                ))
             ) : (
                <Card>
                    <CardContent className="text-center text-muted-foreground py-16">
                        <p>No ideas were generated for this topic. Try being more specific.</p>
                    </CardContent>
                </Card>
             )}
          </div>
        )}
        
        {!isLoading && !ideas && (
             <div className="text-center text-muted-foreground pt-12">
                <BrainCircuit className="mx-auto h-16 w-16 text-primary/30" />
                <p className="mt-4 text-lg">Your project ideas will appear here.</p>
            </div>
        )}
      </div>
    </AppLayout>
  );
}
