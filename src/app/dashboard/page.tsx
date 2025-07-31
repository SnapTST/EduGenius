
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, BookOpen, FileSearch, ArrowRight, Layers } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: FileText,
    title: 'AI Test Generator',
    description: 'Create custom tests by topic, difficulty, and marks.',
    href: '/test-generator',
    image: 'https://placehold.co/600x400',
    aiHint: 'education classroom',
  },
  {
    icon: BookOpen,
    title: 'Smart Notes',
    description: 'Summarize textbook pages into concise notes.',
    href: '/smart-notes',
    image: 'https://placehold.co/600x400',
    aiHint: 'notebook study',
  },
  {
    icon: FileSearch,
    title: 'Past Paper Matcher',
    description: 'Find relevant past exam questions for any chapter.',
    href: '/past-paper-matcher',
    image: 'https://placehold.co/600x400',
    aiHint: 'library books',
  },
  {
    icon: Layers,
    title: 'Flashcard Creator',
    description: 'Generate flashcards from your notes or textbook content.',
    href: '/flashcard-creator',
    image: 'https://placehold.co/600x400',
    aiHint: 'flashcards studying',
  },
];


export default function DashboardPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Welcome back, Student!"
        description="Ready to ace your exams? Let's get started."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
            <Card key={feature.href} className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    <div className="p-3 rounded-md bg-primary/10 text-primary">
                        <feature.icon className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle className="font-headline">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                    <div className="relative aspect-video w-full mb-4">
                        <Image src={feature.image} alt={feature.title} layout="fill" objectFit="cover" className="rounded-md" data-ai-hint={feature.aiHint} />
                    </div>
                    <Button asChild className="w-full mt-auto">
                        <Link href={feature.href}>
                            Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        ))}
      </div>
    </AppLayout>
  );
}
