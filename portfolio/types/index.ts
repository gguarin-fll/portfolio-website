export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: string[];
  technologies: string[];
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  date: string;
  status: 'completed' | 'in-progress' | 'planned';
}

export interface Presentation {
  id: string;
  title: string;
  description: string;
  slidesPath: string;
  thumbnail: string;
  tags: string[];
  date: string;
  duration?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface Statistic {
  id: string;
  title: string;
  category: string;
  data: ChartData;
  chartType: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'area';
}

export interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'devops' | 'tools' | 'languages';
  icon?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string[];
  technologies: string[];
}