
'use client';

import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
    {
      question: "How does the AI Tutor work?",
      answer: "The AI Tutor uses advanced language models to understand your question and provide a detailed, easy-to-understand explanation. Just type your question and let the AI do the rest!"
    },
    {
      question: "Is the Test Generator suitable for all subjects?",
      answer: "Yes, you can generate test papers for a wide range of subjects. You can provide topics or even upload a document to generate questions from specific content."
    },
    {
      question: "How accurate is the Doubt Solver?",
      answer: "The Doubt Solver uses OCR to extract text from an image and then provides an answer using our AI Tutor's capabilities. While it's highly accurate, we always recommend cross-verifying complex answers."
    },
    {
      question: "Can I use the Essay Writer for my final submissions?",
      answer: "The Essay Writer is a powerful tool to help you brainstorm, outline, and draft your essays. We recommend using the generated content as a starting point and adding your own voice and research to it."
    },
    {
        question: "How do I create flashcards?",
        answer: "You can go to the 'Interactive Notes' or 'Flashcard Creator' page. Upload a document (like a PDF or an image of your textbook chapter), and the AI will automatically generate a set of flashcards based on the content."
    }
]

export default function HelpPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Help Center"
        description="Find answers to frequently asked questions below."
      />
      <div className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="font-headline text-lg">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    </AppLayout>
  );
}
