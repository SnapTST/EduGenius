
'use server';

/**
 * @fileOverview A homework helper that provides step-by-step solutions to problems from an image.
 *
 * - homeworkHelper - A function that takes an image of a problem and returns a step-by-step solution.
 * - HomeworkHelperInput - The input type for the homeworkHelper function.
 * - HomeworkHelperOutput - The return type for the homeworkHelper function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {extractTextFromImage} from './extract-text-from-image';

const HomeworkHelperInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "An image of a homework problem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type HomeworkHelperInput = z.infer<typeof HomeworkHelperInputSchema>;

const HomeworkHelperOutputSchema = z.object({
  question: z.string().describe('The question extracted from the image.'),
  answer: z.string().describe('The step-by-step answer to the question.'),
});
export type HomeworkHelperOutput = z.infer<typeof HomeworkHelperOutputSchema>;

export async function homeworkHelper(input: HomeworkHelperInput): Promise<HomeworkHelperOutput> {
  return homeworkHelperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'homeworkHelperPrompt',
  input: { schema: z.object({ question: z.string() }) },
  output: { schema: HomeworkHelperOutputSchema.pick({ answer: true }) },
  prompt: `You are an expert Homework Helper for students. Your role is to provide detailed, step-by-step solutions to their problems.

  A student needs help with the following problem:
  "{{{question}}}"

  Please provide a well-structured, step-by-step answer. Explain each step clearly so the student can understand the process.
  `,
});

const homeworkHelperFlow = ai.defineFlow(
  {
    name: 'homeworkHelperFlow',
    inputSchema: HomeworkHelperInputSchema,
    outputSchema: HomeworkHelperOutputSchema,
  },
  async input => {
    const { extractedText } = await extractTextFromImage({ imageDataUri: input.imageDataUri });
    if (!extractedText) {
        throw new Error('Could not extract text from the image.');
    }

    const { output } = await prompt({ question: extractedText });

    return {
        question: extractedText,
        answer: output!.answer,
    };
  }
);
