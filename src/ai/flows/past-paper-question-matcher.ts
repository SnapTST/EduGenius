'use server';

/**
 * @fileOverview Matches chapter content with past exam questions using a tool to identify relevant previous year questions and sample papers.
 *
 * - pastPaperQuestionMatcher - A function that handles the matching process.
 * - PastPaperQuestionMatcherInput - The input type for the pastPaperQuestionMatcher function.
 * - PastPaperQuestionMatcherOutput - The return type for the pastPaperQuestionMatcher function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PastPaperQuestionMatcherInputSchema = z.object({
  chapterContent: z
    .string()
    .describe('The content of the chapter or topic to match questions against.'),
});
export type PastPaperQuestionMatcherInput = z.infer<typeof PastPaperQuestionMatcherInputSchema>;

const PastPaperQuestionMatcherOutputSchema = z.object({
  matchedQuestions: z
    .array(z.string())
    .describe('An array of questions from past papers that match the chapter content.'),
});
export type PastPaperQuestionMatcherOutput = z.infer<typeof PastPaperQuestionMatcherOutputSchema>;

export async function pastPaperQuestionMatcher(input: PastPaperQuestionMatcherInput): Promise<PastPaperQuestionMatcherOutput> {
  return pastPaperQuestionMatcherFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pastPaperQuestionMatcherPrompt',
  input: {schema: PastPaperQuestionMatcherInputSchema},
  output: {schema: PastPaperQuestionMatcherOutputSchema},
  prompt: `You are an expert educator helping students prepare for exams.

  Given the following chapter content, identify questions from past papers that are relevant to the content. Provide the questions as a list.

  Chapter Content: {{{chapterContent}}}

  Matched Questions:`,
});

const pastPaperQuestionMatcherFlow = ai.defineFlow(
  {
    name: 'pastPaperQuestionMatcherFlow',
    inputSchema: PastPaperQuestionMatcherInputSchema,
    outputSchema: PastPaperQuestionMatcherOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
