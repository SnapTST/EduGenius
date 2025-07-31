import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-notes.ts';
import '@/ai/flows/generate-test-paper.ts';
import '@/ai/flows/generate-flashcards.ts';
import '@/ai/flows/extract-text-from-image.ts';
import '@/ai/flows/project-assistant.ts';
import '@/ai/flows/ai-tutor.ts';
import '@/ai/flows/doubt-solver.ts';
import '@/ai/flows/generate-quiz.ts';
