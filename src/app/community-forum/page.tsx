
'use client';

import * as React from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, MessageSquare, ThumbsUp, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const forumPosts = [
  {
    id: 1,
    author: 'PhysicsWhiz',
    question: 'Can someone explain the difference between nuclear fission and fusion in simple terms?',
    answers: 3,
    votes: 12,
    tags: ['physics', 'science'],
  },
  {
    id: 2,
    author: 'MathNerd',
    question: 'What are the real-world applications of calculus?',
    answers: 5,
    votes: 25,
    tags: ['math', 'calculus'],
  },
  {
    id: 3,
    author: 'HistoryBuff',
    question: 'How did the fall of the Roman Empire impact modern society?',
    answers: 8,
    votes: 18,
    tags: ['history', 'world-history'],
  },
   {
    id: 4,
    author: 'BioStudent',
    question: 'What is the role of mitochondria in a cell?',
    answers: 6,
    votes: 32,
    tags: ['biology', 'cell-structure'],
  },
];

export default function CommunityForumPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Community Forum"
        description="Ask questions, share knowledge, and learn with the community."
      />
      
      <div className="flex justify-end mb-6">
        <Button asChild>
            <Link href="/ai-tutor">
                <PlusCircle className="mr-2" />
                Ask a New Question
            </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Questions</CardTitle>
          <CardDescription>Browse the latest questions from other students.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {forumPosts.map((post) => (
            <React.Fragment key={post.id}>
              <div className="p-4 rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {post.author.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-primary cursor-pointer hover:underline">
                      {post.question}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground mt-2 space-x-4">
                       <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.answers} Answers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.votes} Votes</span>
                      </div>
                    </div>
                     <div className="mt-2 flex gap-2">
                        {post.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded-full">{tag}</span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
            </React.Fragment>
          ))}
           <div className="text-center text-muted-foreground pt-4">
            <p>More questions will appear here as the community grows.</p>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
