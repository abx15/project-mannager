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
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Person,
  GridView,
  ViewList,
  Email,
  AttachMoney,
  Download,
} from '@mui/icons-material';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Worker } from '@/types';
import { exportToCSV, exportToJSON } from '@/utils/exportData';
import { usePageAnimation, useTableRowAnimation } from '@/hooks/useGsapAnimations';
import gsap from 'gsap';

const SKILLS = [
  // Frontend
  'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js',
  'Angular', 'Svelte', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'Chakra UI',
  'ShadCN UI', 'SCSS', 'Styled Components', 'Three.js', 'Framer Motion',
  'GSAP', 'Swiper.js', 'Lenis', 'Locomotive Scroll',

  // Mobile App
  'React Native', 'Flutter', 'Expo', 'Swift', 'Kotlin', 'Jetpack Compose',
  'Android Studio', 'iOS Development',

  // Backend
  'Node.js', 'Express.js', 'NestJS', 'Python', 'Django', 'FastAPI',
  'Flask', 'PHP', 'Laravel', 'Spring Boot', 'REST APIs', 'GraphQL',
  'WebSockets', 'Microservices',

  // Databases
  'MongoDB', 'MySQL', 'PostgreSQL', 'SQLite', 'Firebase', 'Supabase',
  'Redis', 'DynamoDB',

  // DevOps & Cloud
  'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes',
  'CI/CD', 'GitHub Actions', 'Terraform', 'Vercel', 'Netlify',
  'Railway', 'Render', 'Nginx',

  // AI / ML
  'OpenAI API', 'Gemini API', 'LangChain', 'TensorFlow',
  'PyTorch', 'Hugging Face', 'Computer Vision', 'NLP',
  'Chatbot Development', 'AI Integrations',

  // Tools
  'Git', 'GitHub', 'GitLab', 'Postman', 'Insomnia',
  'Figma', 'Canva', 'Adobe XD', 'VS Code',
  'Jira', 'Notion', 'Trello',

  // Security & Auth
  'JWT', 'OAuth', 'Firebase Auth', 'Clerk', 'Auth0',
  'Encryption', 'API Security',

  // Testing
  'Jest', 'Playwright', 'Cypress', 'Vitest',
  'Unit Testing', 'E2E Testing',

  // UI/UX
  'User Research', 'Wireframing', 'Prototyping',
  'UX Design', 'Accessibility (a11y)',

  // Performance
  'SEO Optimization', 'Web Performance', 'Lazy Loading',
  'Code Splitting', 'Lighthouse',

  // Misc
  'Agile', 'Scrum', 'System Design', 'Clean Architecture',
  'API Documentation', 'Technical Writing'
];


const ROLES = [
  'Frontend Developer',
  'Senior Frontend Developer',
  'Backend Developer',
  'Senior Backend Developer',
  'Full Stack Developer',
  'Mobile Developer',
  'DevOps Engineer',
  'UI/UX Designer',
  'Product Manager',
  'QA Engineer',
];

export function WorkersPage() {
  const navigate = useNavigate();
  const { workers, projects, addWorker, updateWorker, deleteWorker, getProjectById } = useData();
  const { isAdmin } = useAuth();
  const { settings } = useTheme();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workerToDelete, setWorkerToDelete] = useState<Worker | null>(null);
  const pageRef = usePageAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const tableRef = useTableRowAnimation();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    skills: [] as string[],
    monthlySalary: '',
    assignedProjects: [] as string[],
    status: 'active' as Worker['status'],
  });

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [workers, search, viewMode]);

  const filteredWorkers = workers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(search.toLowerCase()) ||
      worker.role.toLowerCase().includes(search.toLowerCase()) ||
      worker.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleOpenDialog = (worker?: Worker) => {
    if (worker) {
      setEditingWorker(worker);
      setFormData({
        name: worker.name,
        email: worker.email,
        role: worker.role,
        skills: worker.skills,
        monthlySalary: worker.monthlySalary.toString(),
        assignedProjects: worker.assignedProjects,
        status: worker.status,
      });
    } else {
      setEditingWorker(null);
      setFormData({
        name: '',
        email: '',
        role: '',
        skills: [],
        monthlySalary: '',
        assignedProjects: [],
        status: 'active',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingWorker(null);
  };

  const handleSubmit = () => {
    const workerData = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      skills: formData.skills,
      monthlySalary: parseInt(formData.monthlySalary) || 0,
      assignedProjects: formData.assignedProjects,
      status: formData.status,
    };

    if (editingWorker) {
      updateWorker(editingWorker.id, workerData);
    } else {
      addWorker(workerData);
    }
    handleCloseDialog();
  };

  const handleDeleteClick = (worker: Worker) => {
    setWorkerToDelete(worker);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (workerToDelete) {
      deleteWorker(workerToDelete.id);
    }
    setDeleteDialogOpen(false);
    setWorkerToDelete(null);
  };

  return (
    <Box ref={pageRef} sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search team members..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, value) => value && setViewMode(value)}
            size="small"
          >
            <ToggleButton value="grid">
              <GridView />
            </ToggleButton>
            <ToggleButton value="list">
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {isAdmin && (
            <>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => exportToCSV(workers, 'workers')}
                size="small"
              >
                CSV
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => exportToJSON(workers, 'workers')}
                size="small"
              >
                JSON
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{
                  background: 'linear-gradient(135deg, hsl(173, 80%, 40%), hsl(195, 80%, 45%))',
                  '&:hover': {
                    background: 'linear-gradient(135deg, hsl(173, 80%, 35%), hsl(195, 80%, 40%))',
                  },
                }}
              >
                Add Team Member
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <Grid container spacing={3} ref={containerRef}>
          {filteredWorkers.map((worker) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} key={worker.id}>
              <Card
                onClick={() => navigate(`/workers/${worker.id}`)}
                sx={{
                  p: 3,
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: 'primary.main',
                        fontSize: '1.25rem',
                      }}
                    >
                      {worker.name.split(' ').map((n) => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {worker.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {worker.role}
                      </Typography>
                      <Chip
                        label={worker.status}
                        size="small"
                        color={worker.status === 'active' ? 'success' : worker.status === 'on-leave' ? 'warning' : 'default'}
                        sx={{ mt: 0.5, height: 20, fontSize: '0.65rem' }}
                      />
                    </Box>
                  </Box>
                  {isAdmin && (
                    <Box onClick={(e) => e.stopPropagation()}>
                      <IconButton size="small" onClick={() => handleOpenDialog(worker)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(worker)}
                        sx={{ color: 'error.main' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                {/* Email */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'text.secondary' }}>
                  <Email sx={{ fontSize: 16 }} />
                  <Typography variant="body2">{worker.email}</Typography>
                </Box>

                {/* Skills */}
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2, flex: 1 }}>
                  {worker.skills.slice(0, 4).map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 22 }}
                    />
                  ))}
                  {worker.skills.length > 4 && (
                    <Chip
                      label={`+${worker.skills.length - 4}`}
                      size="small"
                      sx={{ fontSize: '0.7rem', height: 22, bgcolor: 'action.hover' }}
                    />
                  )}
                </Box>

                {/* Footer */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AttachMoney sx={{ fontSize: 18, color: 'success.main' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(worker.monthlySalary)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">/mo</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {worker.assignedProjects.length} project(s)
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }} ref={tableRef}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Team Member</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Skills</TableCell>
                <TableCell>Projects</TableCell>
                <TableCell align="right">Salary</TableCell>
                <TableCell>Status</TableCell>
                {isAdmin && <TableCell align="right">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredWorkers.map((worker) => (
                <TableRow
                  key={worker.id}
                  data-animate="table-row"
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(0, 188, 160, 0.05)',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {worker.name.split(' ').map((n) => n[0]).join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{worker.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {worker.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{worker.role}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {worker.skills.slice(0, 3).map((skill) => (
                        <Chip key={skill} label={skill} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                      ))}
                      {worker.skills.length > 3 && (
                        <Chip label={`+${worker.skills.length - 3}`} size="small" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{worker.assignedProjects.length}</TableCell>
                  <TableCell align="right">{formatCurrency(worker.monthlySalary)}</TableCell>
                  <TableCell>
                    <Chip
                      label={worker.status}
                      size="small"
                      color={worker.status === 'active' ? 'success' : worker.status === 'on-leave' ? 'warning' : 'default'}
                    />
                  </TableCell>
                  {isAdmin && (
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenDialog(worker)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(worker)}
                        sx={{ color: 'error.main' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {filteredWorkers.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Person sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No team members found
          </Typography>
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingWorker ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              label="Full Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                {ROLES.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Skills</InputLabel>
              <Select
                multiple
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value as string[] })}
                input={<OutlinedInput label="Skills" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {SKILLS.map((skill) => (
                  <MenuItem key={skill} value={skill}>
                    <Checkbox checked={formData.skills.includes(skill)} />
                    <ListItemText primary={skill} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Monthly Salary"
              type="number"
              fullWidth
              value={formData.monthlySalary}
              onChange={(e) => setFormData({ ...formData, monthlySalary: e.target.value })}
              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
            />
            <FormControl fullWidth>
              <InputLabel>Assign Projects</InputLabel>
              <Select
                multiple
                value={formData.assignedProjects}
                onChange={(e) => setFormData({ ...formData, assignedProjects: e.target.value as string[] })}
                input={<OutlinedInput label="Assign Projects" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const project = getProjectById(value);
                      return <Chip key={value} label={project?.name || value} size="small" />;
                    })}
                  </Box>
                )}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    <Checkbox checked={formData.assignedProjects.includes(project.id)} />
                    <ListItemText primary={project.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Worker['status'] })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="on-leave">On Leave</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.name || !formData.email}
            sx={{
              background: 'linear-gradient(135deg, hsl(173, 80%, 40%), hsl(195, 80%, 45%))',
            }}
          >
            {editingWorker ? 'Save Changes' : 'Add Member'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Remove Team Member</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove "{workerToDelete?.name}" from the team? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
