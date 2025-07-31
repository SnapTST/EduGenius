import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-notes.ts';
import '@/ai/flows/generate-test-paper.ts';
import '@/ai/flows/past-paper-question-matcher.ts';
import '@/ai/flows/generate-flashcards.ts';
