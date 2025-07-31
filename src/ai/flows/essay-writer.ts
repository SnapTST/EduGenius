
'use server';

/**
 * @fileOverview An AI-powered essay and story writer.
 *
 * - essayWriter - A function that generates written content based on user specifications.
 * - EssayWriterInput - The input type for the essayWriter function.
 * - EssayWriterOutput - The return type for the essayWriter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EssayWriterInputSchema = z.object({
  topic: z.string().describe('The topic or title of the essay/story.'),
  type: z
    .enum(['persuasive', 'narrative', 'expository', 'descriptive', 'creative'])
    .describe('The type of content to write.'),
  length: z
    .enum(['short', 'medium', 'long'])
    .describe('The desired length: short (1-2 paragraphs), medium (3-5 paragraphs), or long (5+ paragraphs).'),
  tone: z
    .enum(['formal', 'informal', 'academic', 'journalistic', 'creative'])
    .describe('The writing tone to adopt.'),
});
export type EssayWriterInput = z.infer<typeof EssayWriterInputSchema>;

const EssayWriterOutputSchema = z.object({
  content: z.string().describe('The generated essay or story content.'),
});
export type EssayWriterOutput = z.infer<typeof EssayWriterOutputSchema>;

export async function essayWriter(input: EssayWriterInput): Promise<EssayWriterOutput> {
  return essayWriterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'essayWriterPrompt',
  input: {schema: EssayWriterInputSchema},
  output: {schema: EssayWriterOutputSchema},
  prompt: `You are an expert writer, capable of crafting compelling essays and stories. A student needs your help.

  Generate a piece of writing based on the following specifications:

  Topic/Title: {{{topic}}}
  Type of Writing: {{{type}}}
  Desired Length: {{{length}}}
  Tone: {{{tone}}}

  Please write a high-quality piece that meets these requirements. Structure it appropriately for the chosen type.
  For a 'short' length, write 1-2 paragraphs.
  For a 'medium' length, write 3-5 paragraphs.
  For a 'long' length, write 5 or more paragraphs.
  `,
});

const essayWriterFlow = ai.defineFlow(
  {
    name: 'essayWriterFlow',
    inputSchema: EssayWriterInputSchema,
    outputSchema: EssayWriterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
