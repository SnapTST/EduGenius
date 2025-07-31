
'use server';

/**
 * @fileOverview AI-powered flashcard generator.
 *
 * - generateFlashcards - A function that generates flashcards from text content.
 * - GenerateFlashcardsInput - The input type for the generateFlashcards function.
 * - GenerateFlashcardsOutput - The return type for the generateFlashcards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlashcardSchema = z.object({
  question: z.string().describe('The question or front side of the flashcard.'),
  answer: z.string().describe('The answer or back side of the flashcard.'),
});

const GenerateFlashcardsInputSchema = z.object({
  content: z.string().describe('The text content to generate flashcards from.'),
  numberOfFlashcards: z
    .number()
    .int()
    .min(1)
    .max(50)
    .describe('The number of flashcards to generate.'),
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

const GenerateFlashcardsOutputSchema = z.object({
  flashcards: z
    .array(FlashcardSchema)
    .describe('An array of generated flashcards.'),
});
export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;

export async function generateFlashcards(
  input: GenerateFlashcardsInput
): Promise<GenerateFlashcardsOutput> {
  return generateFlashcardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: {schema: GenerateFlashcardsInputSchema},
  output: {schema: GenerateFlashcardsOutputSchema},
  prompt: `You are an expert in creating effective study materials. Based on the following content, generate a set of flashcards. Each flashcard should have a clear question and a concise answer.

  Content: {{{content}}}
  Number of Flashcards: {{{numberOfFlashcards}}}

  Generate exactly the number of flashcards requested.
  `,
});

const generateFlashcardsFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFlow',
    inputSchema: GenerateFlashcardsInputSchema,
    outputSchema: GenerateFlashcardsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
