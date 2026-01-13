import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  CalendarToday,
  AttachMoney,
  Group,
  Code,
  Add,
  Remove,
  Schedule,
  Flag,
} from '@mui/icons-material';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { usePageAnimation, useCardAnimation, useSectionReveal } from '@/hooks/useGsapAnimations';
import { DraggableMilestones, Milestone } from '@/components/DraggableMilestones';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const statusColors: Record<string, 'success' | 'warning' | 'info' | 'default'> = {
  active: 'success',
  completed: 'info',
  'on-hold': 'warning',
  planning: 'default',
};

const generateDefaultMilestones = (project: any): Milestone[] => {
  return [
    { id: `${project.id}-1`, title: 'Project Kickoff', date: project.createdAt, completed: true },
    { id: `${project.id}-2`, title: 'Requirements Gathering', date: project.createdAt, completed: true },
    { id: `${project.id}-3`, title: 'Design Phase', date: project.createdAt, completed: project.status !== 'planning' },
    { id: `${project.id}-4`, title: 'Development Sprint 1', date: project.updatedAt, completed: project.status === 'completed' || project.status === 'active' },
    { id: `${project.id}-5`, title: 'Development Sprint 2', date: project.updatedAt, completed: project.status === 'completed' },
    { id: `${project.id}-6`, title: 'Testing & QA', date: project.deadline || project.updatedAt, completed: project.status === 'completed' },
    { id: `${project.id}-7`, title: 'Deployment', date: project.deadline || project.updatedAt, completed: project.status === 'completed' },
  ];
};

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProjectById, workers, updateProject } = useData();
  const { isAdmin } = useAuth();
  const { settings } = useTheme();
  
  const containerRef = usePageAnimation();
  const cardsRef = useCardAnimation();
  const timelineRef = useSectionReveal();
  
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState('');
  
  const project = getProjectById(id || '');
  
  // Store milestones in localStorage per project
  const [projectMilestones, setProjectMilestones] = useLocalStorage<Record<string, Milestone[]>>(
    'workledger_milestones',
    {}
  );
  
  // Get or initialize milestones for this project
  const milestones = project 
    ? (projectMilestones[project.id] || generateDefaultMilestones(project))
    : [];
    
  const saveMilestones = (newMilestones: Milestone[]) => {
    if (project) {
      setProjectMilestones((prev) => ({
        ...prev,
        [project.id]: newMilestones,
      }));
    }
  };
  
  if (!project) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          Project not found
        </Typography>
        <Button onClick={() => navigate('/projects')} sx={{ mt: 2 }}>
          Back to Projects
        </Button>
      </Box>
    );
  }
  
  
  const completedMilestones = milestones.filter((m) => m.completed).length;
  const progress = milestones.length > 0 ? (completedMilestones / milestones.length) * 100 : 0;
  
  // Milestone handlers
  const handleReorderMilestones = (newMilestones: Milestone[]) => {
    saveMilestones(newMilestones);
  };
  
  const handleToggleMilestone = (milestoneId: string) => {
    const newMilestones = milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    saveMilestones(newMilestones);
  };
  
  const handleAddMilestone = (milestone: Omit<Milestone, 'id'>) => {
    const newMilestone: Milestone = {
      ...milestone,
      id: `${project.id}-${Date.now()}`,
    };
    saveMilestones([...milestones, newMilestone]);
  };
  
  const handleDeleteMilestone = (milestoneId: string) => {
    saveMilestones(milestones.filter((m) => m.id !== milestoneId));
  };
  
  const handleUpdateMilestone = (milestoneId: string, updates: Partial<Milestone>) => {
    const newMilestones = milestones.map((m) =>
      m.id === milestoneId ? { ...m, ...updates } : m
    );
    saveMilestones(newMilestones);
  };
  
  const assignedWorkersList = project.assignedWorkers
    .map((wId) => workers.find((w) => w.id === wId))
    .filter(Boolean);
  
  const availableWorkers = workers.filter(
    (w) => !project.assignedWorkers.includes(w.id) && w.status === 'active'
  );
  
  const handleAssignWorker = () => {
    if (selectedWorker) {
      updateProject(project.id, {
        assignedWorkers: [...project.assignedWorkers, selectedWorker],
      });
      setSelectedWorker('');
      setAssignDialogOpen(false);
    }
  };
  
  const handleRemoveWorker = (workerId: string) => {
    updateProject(project.id, {
      assignedWorkers: project.assignedWorkers.filter((id) => id !== workerId),
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <Box ref={containerRef} sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton onClick={() => navigate('/projects')} sx={{ bgcolor: 'background.paper' }}>
          <ArrowBack />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {project.name}
            </Typography>
            <Chip
              label={project.status.replace('-', ' ')}
              color={statusColors[project.status]}
              size="small"
              sx={{ textTransform: 'capitalize' }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Created on {new Date(project.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<Edit />}
            sx={{ bgcolor: 'primary.main' }}
          >
            Edit Project
          </Button>
        )}
      </Box>
      
      {/* Stats Cards */}
      <Box
        ref={cardsRef}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4,
        }}
      >
        <Paper data-animate="card" sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AttachMoney sx={{ color: 'primary.contrastText' }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Budget
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {project.budget ? formatCurrency(project.budget) : 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Paper>
        
        <Paper data-animate="card" sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'info.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CalendarToday sx={{ color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Deadline
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {project.deadline
                  ? new Date(project.deadline).toLocaleDateString()
                  : 'Not set'}
              </Typography>
            </Box>
          </Box>
        </Paper>
        
        <Paper data-animate="card" sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'success.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Group sx={{ color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Team Size
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {project.assignedWorkers.length} members
              </Typography>
            </Box>
          </Box>
        </Paper>
        
        <Paper data-animate="card" sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'warning.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Flag sx={{ color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {Math.round(progress)}%
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
      
      {/* Main Content */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 3,
        }}
      >
        {/* Left Column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Description */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {project.description}
            </Typography>
          </Paper>
          
          {/* Technologies */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Code color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Technologies
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {project.technologies.map((tech) => (
                <Chip
                  key={tech}
                  label={tech}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Box>
          </Paper>
          
          {/* Timeline */}
          <Paper ref={timelineRef} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Schedule color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Project Timeline
              </Typography>
              {isAdmin && (
                <Chip label="Drag to reorder" size="small" variant="outlined" sx={{ ml: 'auto' }} />
              )}
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Overall Progress
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {completedMilestones}/{milestones.length} milestones
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: 'muted.main',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    bgcolor: 'primary.main',
                  },
                }}
              />
            </Box>
            
            <DraggableMilestones
              milestones={milestones}
              onReorder={handleReorderMilestones}
              onToggleComplete={handleToggleMilestone}
              onAdd={handleAddMilestone}
              onDelete={handleDeleteMilestone}
              onUpdate={handleUpdateMilestone}
              isAdmin={isAdmin}
            />
          </Paper>
        </Box>
        
        {/* Right Column - Team */}
        <Paper sx={{ p: 3, borderRadius: 3, height: 'fit-content' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Group color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Team Members
              </Typography>
            </Box>
            {isAdmin && (
              <Tooltip title="Assign Worker">
                <IconButton
                  size="small"
                  onClick={() => setAssignDialogOpen(true)}
                  sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }}
                >
                  <Add fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          
          {assignedWorkersList.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No team members assigned yet
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {assignedWorkersList.map((worker) => (
                <Box
                  key={worker!.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'muted.main',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'muted.dark',
                    },
                  }}
                >
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {worker!.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {worker!.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {worker!.role}
                    </Typography>
                  </Box>
                  {isAdmin && (
                    <Tooltip title="Remove from project">
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveWorker(worker!.id)}
                        sx={{ color: 'error.main' }}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Box>
      
      {/* Assign Worker Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Team Member</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Worker</InputLabel>
            <Select
              value={selectedWorker}
              onChange={(e) => setSelectedWorker(e.target.value)}
              label="Select Worker"
            >
              {availableWorkers.map((worker) => (
                <MenuItem key={worker.id} value={worker.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      {worker.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2">{worker.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {worker.role}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAssignWorker} disabled={!selectedWorker}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
