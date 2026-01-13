import React, { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Project, Worker, DEFAULT_PROJECTS, DEFAULT_WORKERS, SalaryData, ProjectCost, Milestone } from '@/types';

interface DataContextType {
  projects: Project[];
  workers: Worker[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addWorker: (worker: Omit<Worker, 'id' | 'joinedAt'>) => void;
  updateWorker: (id: string, updates: Partial<Worker>) => void;
  deleteWorker: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
  getWorkerById: (id: string) => Worker | undefined;
  getSalaryData: () => SalaryData[];
  getProjectCosts: () => ProjectCost[];
  getTotalMonthlyCost: () => number;
  toggleMilestoneComplete: (projectId: string, milestoneId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useLocalStorage<Project[]>('workledger_projects', DEFAULT_PROJECTS);
  const [workers, setWorkers] = useLocalStorage<Worker[]>('workledger_workers', DEFAULT_WORKERS);

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? { ...project, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
          : project
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
    // Remove project from workers' assignments
    setWorkers((prev) =>
      prev.map((worker) => ({
        ...worker,
        assignedProjects: worker.assignedProjects.filter((pId) => pId !== id),
      }))
    );
  };

  const addWorker = (workerData: Omit<Worker, 'id' | 'joinedAt'>) => {
    const newWorker: Worker = {
      ...workerData,
      id: `w${Date.now()}`,
      joinedAt: new Date().toISOString().split('T')[0],
    };
    setWorkers((prev) => [...prev, newWorker]);
  };

  const updateWorker = (id: string, updates: Partial<Worker>) => {
    setWorkers((prev) =>
      prev.map((worker) => (worker.id === id ? { ...worker, ...updates } : worker))
    );
  };

  const deleteWorker = (id: string) => {
    setWorkers((prev) => prev.filter((worker) => worker.id !== id));
    // Remove worker from projects' assignments
    setProjects((prev) =>
      prev.map((project) => ({
        ...project,
        assignedWorkers: project.assignedWorkers.filter((wId) => wId !== id),
      }))
    );
  };

  const getProjectById = (id: string) => projects.find((p) => p.id === id);
  const getWorkerById = (id: string) => workers.find((w) => w.id === id);

  const toggleMilestoneComplete = (projectId: string, milestoneId: string) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId && project.milestones) {
          return {
            ...project,
            milestones: project.milestones.map((milestone) =>
              milestone.id === milestoneId
                ? { ...milestone, completed: !milestone.completed }
                : milestone
            ),
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }
        return project;
      })
    );
  };

  const getSalaryData = (): SalaryData[] => {
    return workers.map((worker) => {
      const workerProjects = worker.assignedProjects
        .map((pId) => {
          const project = getProjectById(pId);
          if (!project) return null;
          const projectWorkerCount = project.assignedWorkers.length;
          return {
            projectId: project.id,
            projectName: project.name,
            allocation: projectWorkerCount > 0 ? Math.round(100 / projectWorkerCount) : 0,
          };
        })
        .filter(Boolean) as SalaryData['projects'];

      return {
        workerId: worker.id,
        workerName: worker.name,
        role: worker.role,
        salary: worker.monthlySalary,
        projects: workerProjects,
      };
    });
  };

  const getProjectCosts = (): ProjectCost[] => {
    return projects.map((project) => {
      const projectWorkers = project.assignedWorkers
        .map((wId) => {
          const worker = getWorkerById(wId);
          if (!worker) return null;
          const workerProjectCount = worker.assignedProjects.length;
          const cost = workerProjectCount > 0 ? worker.monthlySalary / workerProjectCount : 0;
          return {
            workerId: worker.id,
            workerName: worker.name,
            cost: Math.round(cost),
          };
        })
        .filter(Boolean) as ProjectCost['workers'];

      return {
        projectId: project.id,
        projectName: project.name,
        totalCost: projectWorkers.reduce((sum, w) => sum + w.cost, 0),
        workers: projectWorkers,
      };
    });
  };

  const getTotalMonthlyCost = () => {
    return workers.reduce((sum, worker) => sum + worker.monthlySalary, 0);
  };

  const value = useMemo(
    () => ({
      projects,
      workers,
      addProject,
      updateProject,
      deleteProject,
      addWorker,
      updateWorker,
      deleteWorker,
      getProjectById,
      getWorkerById,
      getSalaryData,
      getProjectCosts,
      getTotalMonthlyCost,
      toggleMilestoneComplete,
    }),
    [projects, workers]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
