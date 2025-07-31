
'use client';

import * as React from 'react';
import { AppLayout } from '@/components/app-layout';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const videos = [
  {
    id: 'N5gB1_2T0YQ',
    title: 'Introduction to Photosynthesis',
    description: 'A detailed look at how plants convert light into energy. Perfect for middle and high school students.',
    subject: 'biology',
  },
  {
    id: 'h6fcK_fRYaI',
    title: 'What is Calculus? A Beginner\'s Guide',
    description: 'Demystifying the core concepts of calculus, including limits, derivatives, and integrals.',
    subject: 'math',
  },
  {
    id: 'wI6uH-w7A9Q',
    title: 'The Roman Empire: Rise and Fall',
    description: 'A comprehensive overview of one of history\'s greatest civilizations.',
    subject: 'history',
  },
  {
    id: '9iMGFqMmUFs',
    title: 'Fundamentals of Programming',
    description: 'Learn the basic principles of coding, including variables, loops, and functions.',
    subject: 'coding',
  },
   {
    id: 'zsc_u05-L8I',
    title: 'How do Solar Panels Work?',
    description: 'An easy-to-understand explanation of photovoltaic cells and solar energy.',
    subject: 'physics',
  },
   {
    id: 'AulM12P-00I',
    title: 'Introduction to Chemical Reactions',
    description: 'Explore the basics of chemical reactions, reactants, and products.',
    subject: 'chemistry',
  },
];

export default function VideoLibraryPage() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedSubject, setSelectedSubject] = React.useState('all');

    const filteredVideos = videos.filter(video => {
        const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              video.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = selectedSubject === 'all' || video.subject === selectedSubject;
        return matchesSearch && matchesSubject;
    });


  return (
    <AppLayout>
      <PageHeader
        title="Video Library"
        description="Explore a curated collection of educational videos on various subjects."
      />
      
      <Card className="mb-8">
        <CardHeader>
            <CardTitle>Find a Video</CardTitle>
            <CardDescription>Search by keyword or filter by subject to find the perfect video.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search for a topic..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by subject" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="math">Math</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="coding">Coding</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                         <SelectItem value="chemistry">Chemistry</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredVideos.map((video) => (
          <Card key={video.id} className="overflow-hidden flex flex-col">
            <div className="aspect-video">
                 <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
            <CardHeader>
              <CardTitle className="font-headline text-lg">{video.title}</CardTitle>
              <CardDescription className="text-sm">{video.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
        {filteredVideos.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted-foreground">
                <p>No videos found matching your criteria.</p>
            </div>
        )}
      </div>
    </AppLayout>
  );
}
