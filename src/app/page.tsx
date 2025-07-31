
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { ArrowRight, BookOpenCheck, Bot, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

const features = [
    {
        icon: <Bot className="h-8 w-8 text-primary" />,
        title: "AI-Powered Tools",
        description: "From an AI Tutor to a Test Generator, get help with all your study needs."
    },
    {
        icon: <BookOpenCheck className="h-8 w-8 text-primary" />,
        title: "Interactive Learning",
        description: "Generate summaries, create flashcards, and practice with interactive quizzes."
    },
    {
        icon: <BrainCircuit className="h-8 w-8 text-primary" />,
        title: "Project Assistance",
        description: "Get creative ideas and a list of materials for your next school project."
    }
]

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4">
       <header className="w-full max-w-6xl mx-auto py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Logo />
            <span className="text-xl font-bold font-headline">EduGenius</span>
        </div>
        <div>
            <Button asChild>
                <Link href="/dashboard">Get Started <ArrowRight className="ml-2" /></Link>
            </Button>
        </div>
      </header>

      <section className="text-center py-20 lg:py-32">
        <h1 className="text-4xl lg:text-6xl font-extrabold font-headline tracking-tight">
            Your AI-Powered Study Partner
        </h1>
        <p className="mt-4 text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            EduGenius provides a suite of AI tools designed to help you study smarter, not harder. Ace your exams, get project ideas, and solve doubts instantly.
        </p>
        <div className="mt-8 flex justify-center gap-4">
             <Button asChild size="lg">
                <Link href="/dashboard">Explore Features</Link>
            </Button>
        </div>
      </section>

      <section className="w-full max-w-6xl mx-auto py-16">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline">Everything You Need to Succeed</h2>
            <p className="text-muted-foreground mt-2">All the tools a student could ask for, in one place.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
                 <Card key={index}>
                    <CardHeader className="items-center text-center">
                        {feature.icon}
                        <CardTitle className="font-headline">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-center">{feature.description}</CardDescription>
                    </CardContent>
                </Card>
            ))}
        </div>
      </section>

       <footer className="w-full max-w-6xl mx-auto py-8 text-center text-muted-foreground">
        © {new Date().getFullYear()} Prashant Pandey. All rights reserved.
      </footer>
    </main>
  );
}
