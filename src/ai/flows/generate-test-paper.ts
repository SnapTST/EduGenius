'use server';

/**
 * @fileOverview AI-powered test paper generator.
 *
 * - generateTestPaper - A function that generates a test paper based on user-specified criteria.
 * - GenerateTestPaperInput - The input type for the generateTestPaper function.
 * - GenerateTestPaperOutput - The return type for the generateTestPaper function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTestPaperInputSchema = z.object({
  topics: z
    .string()
    .describe('Comma-separated list of topics to include in the test.'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the test.'),
  numberOfQuestions: z
    .number()
    .int()
    .min(1)
    .max(50)
    .describe('The number of questions to generate.'),
  marksPerQuestion: z
    .number()
    .int()
    .min(1)
    .max(10)
    .optional()
    .describe('The marks allocated for each question.'),
});
export type GenerateTestPaperInput = z.infer<typeof GenerateTestPaperInputSchema>;

const GenerateTestPaperOutputSchema = z.object({
  testPaper: z.string().describe('The generated test paper content.'),
});
export type GenerateTestPaperOutput = z.infer<typeof GenerateTestPaperOutputSchema>;

export async function generateTestPaper(input: GenerateTestPaperInput): Promise<GenerateTestPaperOutput> {
  return generateTestPaperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTestPaperPrompt',
  input: {schema: GenerateTestPaperInputSchema},
  output: {schema: GenerateTestPaperOutputSchema},
  prompt: `You are an expert educator, skilled in creating test papers for students.

  Generate a test paper based on the following criteria:

  Topics: {{{topics}}}
  Difficulty: {{{difficulty}}}
  Number of Questions: {{{numberOfQuestions}}}
  Marks per Question: {{{marksPerQuestion}}}

  The test paper should include a variety of question types, such as multiple choice, short answer, and essay questions.

  Ensure that the questions are appropriate for the specified difficulty level and cover the specified topics comprehensively.
  Output the test paper in plain text format. Do not include any formatting or special characters.
  Ensure the number of questions matches the specified number, and that the total marks are equal to marksPerQuestion * numberOfQuestions
  `,
});

const generateTestPaperFlow = ai.defineFlow(
  {
    name: 'generateTestPaperFlow',
    inputSchema: GenerateTestPaperInputSchema,
    outputSchema: GenerateTestPaperOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
