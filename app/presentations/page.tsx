'use client';

import { useState } from 'react';
import { presentations } from '@/data/portfolio-data';
import { Calendar, Clock, Tag, Play } from 'lucide-react';
import RevealPresentation from '@/components/RevealPresentation';

export default function PresentationsPage() {
  const [selectedPresentation, setSelectedPresentation] = useState<typeof presentations[0] | null>(null);

  return (
    <>
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Presentations
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Technical talks and presentations on software development, architecture, and best practices
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {presentations.map((presentation) => (
              <div
                key={presentation.id}
                className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-purple-400 to-indigo-500 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-16 h-16 text-white opacity-80" />
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {presentation.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {presentation.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(presentation.date).toLocaleDateString()}</span>
                    </div>
                    {presentation.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{presentation.duration}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {presentation.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedPresentation(presentation)}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    View Presentation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedPresentation && (
        <RevealPresentation
          slidesPath={selectedPresentation.slidesPath}
          title={selectedPresentation.title}
          onClose={() => setSelectedPresentation(null)}
        />
      )}
    </>
  );
}