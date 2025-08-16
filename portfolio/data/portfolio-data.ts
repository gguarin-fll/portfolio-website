import { Project, Presentation, Skill, Experience, Statistic } from '@/types';

export const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with microservices architecture',
    longDescription: 'A scalable e-commerce platform built with Next.js and Node.js, featuring real-time inventory management, payment processing, and analytics dashboard.',
    category: ['web', 'fullstack'],
    technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
    imageUrl: '/images/projects/ecommerce.jpg',
    githubUrl: 'https://github.com/yourusername/ecommerce',
    liveUrl: 'https://demo.example.com',
    featured: true,
    date: '2024-01-15',
    status: 'completed'
  },
  {
    id: '2',
    title: 'Data Analytics Dashboard',
    description: 'Real-time data visualization and analytics platform',
    category: ['data', 'visualization'],
    technologies: ['React', 'D3.js', 'Python', 'FastAPI', 'PostgreSQL'],
    imageUrl: '/images/projects/analytics.jpg',
    githubUrl: 'https://github.com/yourusername/analytics',
    featured: true,
    date: '2023-11-20',
    status: 'completed'
  }
];

export const presentations: Presentation[] = [
  {
    id: '1',
    title: 'Microservices Architecture Best Practices',
    description: 'A comprehensive guide to building scalable microservices',
    slidesPath: '/presentations/microservices.html',
    thumbnail: '/images/presentations/microservices-thumb.jpg',
    tags: ['architecture', 'microservices', 'docker', 'kubernetes'],
    date: '2024-02-15',
    duration: '45 min'
  },
  {
    id: '2',
    title: 'Modern DevOps with Kubernetes',
    description: 'Container orchestration and CI/CD pipelines',
    slidesPath: '/presentations/devops.html',
    thumbnail: '/images/presentations/devops-thumb.jpg',
    tags: ['devops', 'kubernetes', 'ci/cd'],
    date: '2024-01-10',
    duration: '30 min'
  }
];

export const skills: Skill[] = [
  { name: 'TypeScript', level: 90, category: 'languages' },
  { name: 'Python', level: 85, category: 'languages' },
  { name: 'Go', level: 75, category: 'languages' },
  { name: 'React/Next.js', level: 95, category: 'frontend' },
  { name: 'Node.js', level: 90, category: 'backend' },
  { name: 'Docker', level: 85, category: 'devops' },
  { name: 'Kubernetes', level: 80, category: 'devops' },
  { name: 'PostgreSQL', level: 85, category: 'backend' },
];

export const experience: Experience[] = [
  {
    id: '1',
    company: 'Tech Company',
    position: 'Senior Full Stack Developer',
    duration: '2022 - Present',
    location: 'Remote',
    description: [
      'Lead development of microservices architecture',
      'Implemented CI/CD pipelines reducing deployment time by 60%',
      'Mentored junior developers and conducted code reviews'
    ],
    technologies: ['React', 'Node.js', 'Kubernetes', 'AWS']
  }
];

export const statistics: Statistic[] = [
  {
    id: '1',
    title: 'Skills Distribution',
    category: 'skills',
    chartType: 'radar',
    data: {
      labels: ['Frontend', 'Backend', 'DevOps', 'Database', 'Cloud'],
      datasets: [{
        label: 'Skill Level',
        data: [95, 90, 85, 85, 80],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2
      }]
    }
  },
  {
    id: '2',
    title: 'Project Technologies',
    category: 'projects',
    chartType: 'doughnut',
    data: {
      labels: ['React/Next.js', 'Node.js', 'Python', 'Docker/K8s', 'Database'],
      datasets: [{
        label: 'Usage',
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ]
      }]
    }
  }
];