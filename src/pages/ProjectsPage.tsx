import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Typography,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Avatar,
  AvatarGroup,
  Tooltip,
  InputAdornment,
  Grid,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Folder,
  PlayArrow,
  CheckCircle,
  Schedule,
  Flag,
  CalendarToday,
  Download,
} from '@mui/icons-material';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Project } from '@/types';
import { exportToCSV, exportToJSON } from '@/utils/exportData';
import { usePageAnimation, useHoverAnimation } from '@/hooks/useGsapAnimations';
import gsap from 'gsap';

const TECHNOLOGIES = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Vue.js', 'Angular',
  'React Native', 'Swift', 'Kotlin', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
  'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'FastAPI', 'Django', 'Laravel',
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'success', icon: <PlayArrow /> },
  { value: 'completed', label: 'Completed', color: 'info', icon: <CheckCircle /> },
  { value: 'on-hold', label: 'On Hold', color: 'warning', icon: <Schedule /> },
  { value: 'planning', label: 'Planning', color: 'default', icon: <Flag /> },
];

export function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, workers, addProject, updateProject, deleteProject, getWorkerById } = useData();
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const containerRef = usePageAnimation();
  const gridRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning' as Project['status'],
    technologies: [] as string[],
    assignedWorkers: [] as string[],
    budget: '',
    deadline: '',
  });

  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [projects, search, statusFilter]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        description: project.description,
        status: project.status,
        technologies: project.technologies,
        assignedWorkers: project.assignedWorkers,
        budget: project.budget?.toString() || '',
        deadline: project.deadline || '',
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        description: '',
        status: 'planning',
        technologies: [],
        assignedWorkers: [],
        budget: '',
        deadline: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = () => {
    const projectData = {
      name: formData.name,
      description: formData.description,
      status: formData.status,
      technologies: formData.technologies,
      assignedWorkers: formData.assignedWorkers,
      budget: formData.budget ? parseInt(formData.budget) : undefined,
      deadline: formData.deadline || undefined,
    };

    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      addProject(projectData);
    }
    handleCloseDialog();
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
    }
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const getStatusChip = (status: string) => {
    const statusOption = STATUS_OPTIONS.find((s) => s.value === status);
    return (
      <Chip
        icon={statusOption?.icon}
        label={statusOption?.label}
        size="small"
        color={statusOption?.color as any}
        sx={{ textTransform: 'capitalize' }}
      />
    );
  };

  return (
    <Box ref={containerRef} sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        mb: { xs: 2, sm: 3 }, 
        flexWrap: 'wrap', 
        gap: { xs: 1.5, sm: 2 },
      }}>
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 1, sm: 2 }, 
          flexWrap: 'wrap', 
          flex: 1,
          width: '100%',
        }}>
          <TextField
            placeholder="Search projects..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary', fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              flex: 1,
              minWidth: { xs: '100%', sm: '200px' },
              '& .MuiOutlinedInput-root': {
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
              },
            }}
          />
          <FormControl size="small" sx={{ 
            minWidth: { xs: '100%', sm: '150px' },
            '& .MuiInputLabel-root': {
              fontSize: { xs: '0.85rem', sm: '0.95rem' },
            },
          }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
              }}
            >
              <MenuItem value="">All</MenuItem>
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 0.5, sm: 1 },
          flexWrap: 'wrap',
          width: { xs: '100%', sm: 'auto' },
        }}>
          {isAdmin && (
            <>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => exportToCSV(projects, 'projects')}
                size="small"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.9rem' },
                  py: { xs: 0.8, sm: 1 },
                  px: { xs: 1, sm: 1.5 },
                  minHeight: '36px',
                  flex: { xs: 1, sm: 'auto' },
                }}
              >
                CSV
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => exportToJSON(projects, 'projects')}
                size="small"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.9rem' },
                  py: { xs: 0.8, sm: 1 },
                  px: { xs: 1, sm: 1.5 },
                  minHeight: '36px',
                  flex: { xs: 1, sm: 'auto' },
                }}
              >
                JSON
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{
                  background: 'linear-gradient(135deg, hsl(173, 80%, 40%), hsl(195, 80%, 45%))',
                  fontSize: { xs: '0.75rem', sm: '0.9rem' },
                  py: { xs: 0.8, sm: 1 },
                  px: { xs: 1.5, sm: 2 },
                  minHeight: '36px',
                  flex: { xs: 1, sm: 'auto' },
                  '&:hover': {
                    background: 'linear-gradient(135deg, hsl(173, 80%, 35%), hsl(195, 80%, 40%))',
                  },
                }}
              >
                Add Project
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Projects Grid */}
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} ref={gridRef}>
        {filteredProjects.map((project) => {
          const projectWorkers = project.assignedWorkers
            .map((wId) => getWorkerById(wId))
            .filter(Boolean);

          return (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={project.id}>
              <Card
                onClick={() => navigate(`/projects/${project.id}`)}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {/* Header */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start', 
                  mb: { xs: 1.5, sm: 2 },
                  gap: 1,
                }}>
                  <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 }, alignItems: 'flex-start', minWidth: 0 }}>
                    <Avatar sx={{ 
                      bgcolor: 'primary.main', 
                      width: { xs: 36, sm: 40 }, 
                      height: { xs: 36, sm: 40 },
                      flexShrink: 0,
                    }}>
                      <Folder />
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '0.95rem', sm: '1rem' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {project.name}
                      </Typography>
                      {getStatusChip(project.status)}
                    </Box>
                  </Box>
                  {isAdmin && (
                    <Box onClick={(e) => e.stopPropagation()} sx={{ display: 'flex', gap: 0 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog(project)}
                        sx={{ minWidth: '36px', minHeight: '36px' }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(project)}
                        sx={{ color: 'error.main', minWidth: '36px', minHeight: '36px' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                {/* Description */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '0.8rem', sm: '0.85rem' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    flex: 1,
                  }}
                >
                  {project.description}
                </Typography>

                {/* Technologies */}
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: { xs: 1.5, sm: 2 } }}>
                  {project.technologies.slice(0, 4).map((tech) => (
                    <Chip
                      key={tech}
                      label={tech}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        fontSize: { xs: '0.65rem', sm: '0.7rem' }, 
                        height: { xs: 20, sm: 22 },
                      }}
                    />
                  ))}
                  {project.technologies.length > 4 && (
                    <Chip
                      label={`+${project.technologies.length - 4}`}
                      size="small"
                      sx={{ 
                        fontSize: { xs: '0.65rem', sm: '0.7rem' }, 
                        height: { xs: 20, sm: 22 },
                        bgcolor: 'action.hover' 
                      }}
                    />
                  )}
                </Box>

                {/* Footer */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  pt: { xs: 1.5, sm: 2 }, 
                  borderTop: 1, 
                  borderColor: 'divider',
                  gap: 1,
                  flexWrap: 'wrap',
                }}>
                  <AvatarGroup 
                    max={3} 
                    sx={{ 
                      '& .MuiAvatar-root': { 
                        width: { xs: 24, sm: 28 }, 
                        height: { xs: 24, sm: 28 }, 
                        fontSize: { xs: '0.65rem', sm: '0.75rem' } 
                      } 
                    }}
                  >
                    {projectWorkers.map((worker) => (
                      <Tooltip key={worker!.id} title={worker!.name}>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>{worker!.name.charAt(0)}</Avatar>
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                  {project.deadline && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                      <CalendarToday sx={{ fontSize: 14 }} />
                      <Typography variant="caption">{project.deadline}</Typography>
                    </Box>
                  )}
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filteredProjects.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Folder sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No projects found
          </Typography>
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              label="Project Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Technologies</InputLabel>
              <Select
                multiple
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value as string[] })}
                input={<OutlinedInput label="Technologies" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {TECHNOLOGIES.map((tech) => (
                  <MenuItem key={tech} value={tech}>
                    <Checkbox checked={formData.technologies.includes(tech)} />
                    <ListItemText primary={tech} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Assign Workers</InputLabel>
              <Select
                multiple
                value={formData.assignedWorkers}
                onChange={(e) => setFormData({ ...formData, assignedWorkers: e.target.value as string[] })}
                input={<OutlinedInput label="Assign Workers" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const worker = workers.find((w) => w.id === value);
                      return <Chip key={value} label={worker?.name || value} size="small" />;
                    })}
                  </Box>
                )}
              >
                {workers.map((worker) => (
                  <MenuItem key={worker.id} value={worker.id}>
                    <Checkbox checked={formData.assignedWorkers.includes(worker.id)} />
                    <ListItemText primary={worker.name} secondary={worker.role} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Budget"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.name}
            sx={{
              background: 'linear-gradient(135deg, hsl(173, 80%, 40%), hsl(195, 80%, 45%))',
            }}
          >
            {editingProject ? 'Save Changes' : 'Create Project'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{projectToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
