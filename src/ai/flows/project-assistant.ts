'use server';

/**
 * @fileOverview An AI assistant for generating school project ideas.
 *
 * - projectAssistant - A function that generates project ideas based on a topic.
 * - ProjectAssistantInput - The input type for the projectAssistant function.
 * - ProjectAssistantOutput - The return type for the projectAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectIdeaSchema = z.object({
    title: z.string().describe('The title of the project idea.'),
    description: z.string().describe('A brief description of the project idea.'),
    materials: z.array(z.string()).describe('A list of materials needed for the project.'),
});

const ProjectAssistantInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate project ideas.'),
});
export type ProjectAssistantInput = z.infer<typeof ProjectAssistantInputSchema>;

const ProjectAssistantOutputSchema = z.object({
  ideas: z.array(ProjectIdeaSchema).describe('An array of generated project ideas.'),
});
export type ProjectAssistantOutput = z.infer<typeof ProjectAssistantOutputSchema>;

export async function projectAssistant(input: ProjectAssistantInput): Promise<ProjectAssistantOutput> {
  return projectAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'projectAssistantPrompt',
  input: {schema: ProjectAssistantInputSchema},
  output: {schema: ProjectAssistantOutputSchema},
  prompt: `You are an expert project assistant for students. Your role is to provide creative and scientific project ideas based on a given topic.

  A student needs project ideas for the following topic:
  "{{{topic}}}"

  Please generate 3-5 project ideas. For each idea, provide a clear title, a concise description, and a list of materials needed.
  `,
});

const projectAssistantFlow = ai.defineFlow(
  {
    name: 'projectAssistantFlow',
    inputSchema: ProjectAssistantInputSchema,
    outputSchema: ProjectAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
