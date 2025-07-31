
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
    .describe('Comma-separated list of topics to include in the test. This can also be a description of the uploaded document.'),
  documentDataUri: z
    .string()
    .describe(
      "An optional document (image or PDF) of textbook content, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ).optional(),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the test.'),
  numberOfQuestions: z
    .number()
    .int()
    .min(1)
    .max(50)
    .describe('The number of questions to generate.'),
  totalMarks: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .describe('The total marks for the entire test paper.'),
  language: z.string().describe('The language in which to generate the test paper.'),
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

  Generate a test paper in the specified language: {{{language}}}.

  The test paper should be based on the following criteria. If a document is provided, use it as the primary source of content for the questions. The topics list can provide additional context.

  Topics: {{{topics}}}
  {{#if documentDataUri}}
  Document: {{media url=documentDataUri}}
  {{/if}}
  Difficulty: {{{difficulty}}}
  Number of Questions: {{{numberOfQuestions}}}
  Total Marks: {{{totalMarks}}}

  The test paper should include a variety of question types, such as multiple choice, short answer, and essay questions.
  Distribute the total marks among the questions appropriately based on their difficulty and type.

  Ensure that the questions are appropriate for the specified difficulty level and cover the specified topics comprehensively.
  Output the test paper in plain text format. Do not include any formatting or special characters.
  Ensure the number of questions matches the specified number, and that the sum of marks for all questions equals the total marks specified.
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
