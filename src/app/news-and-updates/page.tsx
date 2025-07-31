
'use client';

import * as React from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Rss } from 'lucide-react';
import Image from 'next/image';

const newsData = {
  news: [
    {
      id: 1,
      title: 'New National Education Policy Focuses on Digital Learning',
      description: 'The government has announced a new policy to integrate digital literacy and AI into the core curriculum from middle school onwards.',
      date: '2024-08-15',
      source: 'Education Times',
      image: 'https://placehold.co/600x400',
      aiHint: 'digital classroom',
    },
    {
      id: 2,
      title: 'AI in Education: A Revolution in Personalized Learning',
      description: 'Experts discuss how artificial intelligence is set to change the educational landscape, offering tailored learning paths for every student.',
      date: '2024-08-12',
      source: 'TechEdu Today',
      image: 'https://placehold.co/600x400',
      aiHint: 'robot student',
    },
  ],
  exams: [
    {
      id: 1,
      title: 'Common University Entrance Test (CUET) 2025 Dates Announced',
      description: 'The National Testing Agency (NTA) has released the schedule for the CUET 2025. Registrations to begin in December 2024.',
      date: '2024-08-10',
      category: 'Entrance Exam',
      image: 'https://placehold.co/600x400',
      aiHint: 'university campus',
    },
     {
      id: 2,
      title: 'JEE Advanced 2025 Syllabus Updated with New Topics in Physics',
      description: 'The Joint Entrance Examination (JEE) Advanced syllabus has been revised. Students are advised to check the new topics added in the physics section.',
      date: '2024-08-05',
      category: 'Engineering',
      image: 'https://placehold.co/600x400',
      aiHint: 'physics diagram',
    },
  ],
  scholarships: [
    {
      id: 1,
      title: 'National Merit Scholarship Program 2025',
      description: 'Applications are now open for the National Merit Scholarship Program for students pursuing higher education. Deadline: October 31, 2024.',
      eligibility: 'Top 1% of students in national exams.',
      award: 'Full tuition coverage',
      image: 'https://placehold.co/600x400',
      aiHint: 'graduation cap',
    },
     {
      id: 2,
      title: 'STEM Stars Scholarship for Women',
      description: 'A new scholarship to encourage women to pursue careers in Science, Technology, Engineering, and Mathematics. Applications close September 30, 2024.',
      eligibility: 'Female students enrolled in a STEM undergraduate course.',
      award: '$10,000 per year',
      image: 'https://placehold.co/600x400',
      aiHint: 'woman scientist',
    },
  ],
};

const NewsCard = ({ item }: { item: any }) => (
    <Card className="overflow-hidden flex flex-col">
        <div className="relative aspect-video w-full">
            <Image src={item.image} alt={item.title} layout="fill" objectFit="cover" data-ai-hint={item.aiHint} />
        </div>
        <CardHeader>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
            {item.category && <Badge variant="secondary">{item.category}</Badge>}
             {item.eligibility && (
                <div className="mt-2">
                    <p className="text-sm font-semibold">Eligibility:</p>
                    <p className="text-sm text-muted-foreground">{item.eligibility}</p>
                </div>
            )}
            {item.award && (
                <div className="mt-2">
                    <p className="text-sm font-semibold">Award:</p>
                    <p className="text-sm text-muted-foreground">{item.award}</p>
                </div>
            )}
        </CardContent>
        <CardFooter className="flex justify-between items-center bg-muted/50 p-4">
            <div className="text-xs text-muted-foreground">
                <span>{item.date}</span>
                {item.source && <span> &middot; {item.source}</span>}
            </div>
            <Button variant="link" asChild>
                <Link href="#">Read More</Link>
            </Button>
        </CardFooter>
    </Card>
);


export default function NewsAndUpdatesPage() {
  return (
    <AppLayout>
      <PageHeader
        title="News & Updates"
        description="Stay informed with the latest in educational news, exam alerts, and scholarship opportunities."
      />
      
      <Tabs defaultValue="news" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="news">Educational News</TabsTrigger>
          <TabsTrigger value="exams">Exam Alerts</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
        </TabsList>
        
        <TabsContent value="news">
           <div className="grid gap-6 md:grid-cols-2">
                {newsData.news.map(item => <NewsCard key={item.id} item={item} />)}
           </div>
        </TabsContent>

        <TabsContent value="exams">
            <div className="grid gap-6 md:grid-cols-2">
                {newsData.exams.map(item => <NewsCard key={item.id} item={item} />)}
            </div>
        </TabsContent>
        
        <TabsContent value="scholarships">
             <div className="grid gap-6 md:grid-cols-2">
                {newsData.scholarships.map(item => <NewsCard key={item.id} item={item} />)}
            </div>
        </TabsContent>
      </Tabs>
      
       <div className="text-center text-muted-foreground mt-12">
            <Rss className="mx-auto h-8 w-8 mb-2"/>
            <p>This page will be updated with live data in a real application.</p>
        </div>
    </AppLayout>
  );
}
