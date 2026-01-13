export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'planning';
  technologies: string[];
  assignedWorkers: string[];
  createdAt: string;
  updatedAt: string;
  budget?: number;
  deadline?: string;
  milestones?: Milestone[];
}

export interface Worker {
  id: string;
  name: string;
  email: string;
  role: string;
  skills: string[];
  monthlySalary: number;
  assignedProjects: string[];
  avatar?: string;
  joinedAt: string;
  status: 'active' | 'on-leave' | 'inactive';
}

export interface Settings {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  currency: string;
  companyName: string;
}

export interface SalaryData {
  workerId: string;
  workerName: string;
  role: string;
  salary: number;
  projects: {
    projectId: string;
    projectName: string;
    allocation: number; // percentage
  }[];
}

export interface ProjectCost {
  projectId: string;
  projectName: string;
  totalCost: number;
  workers: {
    workerId: string;
    workerName: string;
    cost: number;
  }[];
}

// Default demo data
export const DEFAULT_USERS: User[] = [
  {
    id: '1',
    email: 'admin@workledger.com',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'user@workledger.com',
    name: 'Regular User',
    role: 'user',
  },
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'E-Commerce Platform',
    description: 'Building a modern e-commerce platform with React and Node.js. Features include product catalog, cart, checkout, and admin dashboard.',
    status: 'active',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis'],
    assignedWorkers: ['w1', 'w2', 'w3'],
    createdAt: '2024-01-15',
    updatedAt: '2024-03-10',
    budget: 150000,
    deadline: '2026-03-30',
    milestones: [
      { id: 'm1', title: 'Design Phase Complete', dueDate: '2026-01-20', completed: true },
      { id: 'm2', title: 'MVP Launch', dueDate: '2026-02-15', completed: false },
      { id: 'm3', title: 'Beta Testing', dueDate: '2026-03-01', completed: false },
    ],
  },
  {
    id: 'p2',
    name: 'Mobile Banking App',
    description: 'Secure mobile banking application with biometric authentication, transfers, and account management.',
    status: 'active',
    technologies: ['React Native', 'TypeScript', 'Python', 'AWS'],
    assignedWorkers: ['w2', 'w4', 'w5'],
    createdAt: '2024-02-01',
    updatedAt: '2024-03-08',
    budget: 200000,
    deadline: '2026-04-15',
    milestones: [
      { id: 'm4', title: 'Security Audit', dueDate: '2026-01-25', completed: true },
      { id: 'm5', title: 'App Store Submission', dueDate: '2026-03-20', completed: false },
    ],
  },
  {
    id: 'p3',
    name: 'HR Management System',
    description: 'Internal HR management tool for employee records, leave management, and performance reviews.',
    status: 'completed',
    technologies: ['Vue.js', 'Laravel', 'MySQL'],
    assignedWorkers: ['w1', 'w6'],
    createdAt: '2023-08-01',
    updatedAt: '2024-01-20',
    budget: 80000,
    milestones: [
      { id: 'm6', title: 'Final Review', dueDate: '2024-01-15', completed: true },
    ],
  },
  {
    id: 'p4',
    name: 'AI Chatbot Integration',
    description: 'Developing an AI-powered customer service chatbot with natural language processing capabilities.',
    status: 'planning',
    technologies: ['Python', 'TensorFlow', 'FastAPI', 'Docker'],
    assignedWorkers: ['w3', 'w5'],
    createdAt: '2024-03-01',
    updatedAt: '2024-03-10',
    budget: 120000,
    deadline: '2026-06-01',
    milestones: [
      { id: 'm7', title: 'Requirements Gathering', dueDate: '2026-02-01', completed: false },
      { id: 'm8', title: 'Architecture Design', dueDate: '2026-02-20', completed: false },
    ],
  },
];

export const DEFAULT_WORKERS: Worker[] = [
  {
    id: 'w1',
    name: 'Sarah Johnson',
    email: 'sarah@workledger.com',
    role: 'Senior Frontend Developer',
    skills: ['React', 'TypeScript', 'Vue.js', 'CSS', 'GraphQL'],
    monthlySalary: 8500,
    assignedProjects: ['p1', 'p3'],
    joinedAt: '2022-03-15',
    status: 'active',
  },
  {
    id: 'w2',
    name: 'Michael Chen',
    email: 'michael@workledger.com',
    role: 'Full Stack Developer',
    skills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'AWS'],
    monthlySalary: 9200,
    assignedProjects: ['p1', 'p2'],
    joinedAt: '2021-07-01',
    status: 'active',
  },
  {
    id: 'w3',
    name: 'Emily Davis',
    email: 'emily@workledger.com',
    role: 'Backend Developer',
    skills: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Redis'],
    monthlySalary: 7800,
    assignedProjects: ['p1', 'p4'],
    joinedAt: '2023-01-10',
    status: 'active',
  },
  {
    id: 'w4',
    name: 'James Wilson',
    email: 'james@workledger.com',
    role: 'Mobile Developer',
    skills: ['React Native', 'Swift', 'Kotlin', 'Firebase'],
    monthlySalary: 8000,
    assignedProjects: ['p2'],
    joinedAt: '2022-09-20',
    status: 'active',
  },
  {
    id: 'w5',
    name: 'Lisa Anderson',
    email: 'lisa@workledger.com',
    role: 'DevOps Engineer',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    monthlySalary: 9500,
    assignedProjects: ['p2', 'p4'],
    joinedAt: '2021-11-05',
    status: 'active',
  },
  {
    id: 'w6',
    name: 'David Brown',
    email: 'david@workledger.com',
    role: 'UI/UX Designer',
    skills: ['Figma', 'Adobe XD', 'CSS', 'Prototyping', 'User Research'],
    monthlySalary: 7200,
    assignedProjects: ['p3'],
    joinedAt: '2023-04-12',
    status: 'on-leave',
  },
];

export const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  sidebarCollapsed: false,
  currency: 'USD',
  companyName: 'WorkLedger Inc.',
};
