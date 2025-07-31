
'use server';

/**
 * @fileOverview Generates an interactive quiz on a given topic.
 *
 * - generateQuiz - A function that creates a quiz with multiple-choice questions.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionSchema = z.object({
  questionText: z.string().describe('The text of the multiple-choice question.'),
  options: z.array(z.string()).length(4).describe('An array of exactly four possible answers.'),
  correctAnswerIndex: z.number().int().min(0).max(3).describe('The index of the correct answer in the options array.'),
  explanation: z.string().describe('A brief explanation of why the correct answer is right.'),
});

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic for the quiz.'),
  numberOfQuestions: z.number().int().min(1).max(10).describe('The number of questions to generate.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('An array of quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;


export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateQuizPrompt',
    input: {schema: GenerateQuizInputSchema},
    output: {schema: GenerateQuizOutputSchema},
    prompt: `You are an expert quiz creator for students. Generate a multiple-choice quiz on the given topic.

    Topic: {{{topic}}}
    Number of Questions: {{{numberOfQuestions}}}

    For each question, provide four options and clearly identify the correct answer. Also, provide a short explanation for the correct answer.
    Ensure you generate exactly the requested number of questions.
    `,
});


const generateQuizFlow = ai.defineFlow(
    {
        name: 'generateQuizFlow',
        inputSchema: GenerateQuizInputSchema,
        outputSchema: GenerateQuizOutputSchema,
    },
    async (input) => {
        const {output} = await prompt(input);
        return output!;
    }
);
