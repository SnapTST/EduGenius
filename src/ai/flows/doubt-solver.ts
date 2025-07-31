'use server';

/**
 * @fileOverview A doubt solver that answers a question from an image.
 *
 * - doubtSolver - A function that takes an image of a question and returns an answer.
 * - DoubtSolverInput - The input type for the doubtSolver function.
 * - DoubtSolverOutput - The return type for the doubtSolver function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {extractTextFromImage} from './extract-text-from-image';
import {aiTutor} from './ai-tutor';

const DoubtSolverInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "An image of a question, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DoubtSolverInput = z.infer<typeof DoubtSolverInputSchema>;

const DoubtSolverOutputSchema = z.object({
  question: z.string().describe('The question extracted from the image.'),
  answer: z.string().describe('The answer to the question.'),
});
export type DoubtSolverOutput = z.infer<typeof DoubtSolverOutputSchema>;

export async function doubtSolver(input: DoubtSolverInput): Promise<DoubtSolverOutput> {
  return doubtSolverFlow(input);
}

const doubtSolverFlow = ai.defineFlow(
  {
    name: 'doubtSolverFlow',
    inputSchema: DoubtSolverInputSchema,
    outputSchema: DoubtSolverOutputSchema,
  },
  async input => {
    const { extractedText } = await extractTextFromImage({ imageDataUri: input.imageDataUri });
    if (!extractedText) {
        throw new Error('Could not extract text from the image.');
    }

    const { answer } = await aiTutor({ question: extractedText });

    return {
        question: extractedText,
        answer,
    };
  }
);
