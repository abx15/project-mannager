import React, { useEffect, useRef } from 'react';
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
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Email,
  AttachMoney,
  CalendarToday,
  Work,
  Star,
  TrendingUp,
  Assignment,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { usePageAnimation, useCardAnimation } from '@/hooks/useGsapAnimations';
import gsap from 'gsap';

// Generate mock salary history
const generateSalaryHistory = (currentSalary: number, joinedAt: string) => {
  const joined = new Date(joinedAt);
  const now = new Date();
  const months: { month: string; salary: number }[] = [];
  
  let salary = currentSalary * 0.7; // Start at 70% of current
  const monthsDiff = Math.min(12, (now.getFullYear() - joined.getFullYear()) * 12 + now.getMonth() - joined.getMonth());
  const increment = (currentSalary - salary) / Math.max(1, monthsDiff);
  
  for (let i = monthsDiff; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    months.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      salary: Math.round(salary),
    });
    salary = Math.min(currentSalary, salary + increment + Math.random() * 200);
  }
  
  return months;
};

// Generate skill proficiency data
const generateSkillProficiency = (skills: string[]) => {
  return skills.slice(0, 6).map((skill) => ({
    skill,
    proficiency: 60 + Math.floor(Math.random() * 40),
    fullMark: 100,
  }));
};

// Generate performance metrics
const generatePerformanceMetrics = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month) => ({
    month,
    tasks: 15 + Math.floor(Math.random() * 20),
    commits: 30 + Math.floor(Math.random() * 50),
    reviews: 5 + Math.floor(Math.random() * 15),
  }));
};

const COLORS = ['hsl(173, 80%, 40%)', 'hsl(217, 91%, 60%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)'];

export function WorkerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWorkerById, projects, getProjectById } = useData();
  const { isAdmin } = useAuth();
  const { settings } = useTheme();
  
  const containerRef = usePageAnimation();
  const cardsRef = useCardAnimation();
  const chartsRef = useRef<HTMLDivElement>(null);
  
  const worker = getWorkerById(id || '');
  
  useEffect(() => {
    if (chartsRef.current) {
      gsap.fromTo(
        chartsRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }
  }, [worker]);
  
  if (!worker) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          Worker not found
        </Typography>
        <Button onClick={() => navigate('/workers')} sx={{ mt: 2 }}>
          Back to Team
        </Button>
      </Box>
    );
  }
  
  const assignedProjects = worker.assignedProjects
    .map((pId) => getProjectById(pId))
    .filter(Boolean);
  
  const salaryHistory = generateSalaryHistory(worker.monthlySalary, worker.joinedAt);
  const skillProficiency = generateSkillProficiency(worker.skills);
  const performanceMetrics = generatePerformanceMetrics();
  
  const projectAllocation = assignedProjects.map((project, index) => ({
    name: project!.name,
    value: Math.round(100 / assignedProjects.length),
    color: COLORS[index % COLORS.length],
  }));
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.currency || 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  const tenure = Math.floor(
    (new Date().getTime() - new Date(worker.joinedAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
  );
  
  return (
    <Box ref={containerRef} sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 4 }}>
        <IconButton onClick={() => navigate('/workers')} sx={{ bgcolor: 'background.paper', mt: 1 }}>
          <ArrowBack />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              fontSize: '2rem',
            }}
          >
            {worker.name.split(' ').map((n) => n[0]).join('')}
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {worker.name}
              </Typography>
              <Chip
                label={worker.status}
                size="small"
                color={worker.status === 'active' ? 'success' : worker.status === 'on-leave' ? 'warning' : 'default'}
              />
            </Box>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              {worker.role}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                <Email fontSize="small" />
                <Typography variant="body2">{worker.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                <CalendarToday fontSize="small" />
                <Typography variant="body2">Joined {new Date(worker.joinedAt).toLocaleDateString()}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        
        {isAdmin && (
          <Button variant="contained" startIcon={<Edit />}>
            Edit Profile
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
            <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: 'success.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AttachMoney sx={{ color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Monthly Salary</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{formatCurrency(worker.monthlySalary)}</Typography>
            </Box>
          </Box>
        </Paper>
        
        <Paper data-animate="card" sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Work sx={{ color: 'primary.contrastText' }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Active Projects</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{assignedProjects.length}</Typography>
            </Box>
          </Box>
        </Paper>
        
        <Paper data-animate="card" sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: 'info.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star sx={{ color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Skills</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{worker.skills.length}</Typography>
            </Box>
          </Box>
        </Paper>
        
        <Paper data-animate="card" sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: 'warning.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp sx={{ color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Tenure</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{tenure} months</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
      
      {/* Main Content */}
      <Box ref={chartsRef} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
        {/* Left Column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Skills */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Skills & Expertise</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {worker.skills.map((skill) => (
                <Chip key={skill} label={skill} variant="outlined" sx={{ borderRadius: 2 }} />
              ))}
            </Box>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillProficiency}>
                  <PolarGrid stroke="hsl(215, 20%, 80%)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'hsl(215, 16%, 47%)' }} />
                  <Radar
                    name="Proficiency"
                    dataKey="proficiency"
                    stroke="hsl(173, 80%, 40%)"
                    fill="hsl(173, 80%, 40%)"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
          
          {/* Salary History */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Salary History</Typography>
            <Box sx={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salaryHistory}>
                  <defs>
                    <linearGradient id="salaryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }} />
                  <YAxis
                    tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <RechartsTooltip
                    formatter={(value: number) => [formatCurrency(value), 'Salary']}
                    contentStyle={{ borderRadius: 8, border: '1px solid hsl(215, 20%, 90%)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="salary"
                    stroke="hsl(142, 76%, 36%)"
                    strokeWidth={2}
                    fill="url(#salaryGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
          
          {/* Performance Metrics */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Performance Metrics</Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }} />
                  <RechartsTooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(215, 20%, 90%)' }} />
                  <Legend />
                  <Bar dataKey="tasks" name="Tasks Completed" fill="hsl(173, 80%, 40%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="commits" name="Code Commits" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reviews" name="Code Reviews" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>
        
        {/* Right Column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Project Allocation */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Assignment color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Project Allocation</Typography>
            </Box>
            {assignedProjects.length > 0 ? (
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${value}%`}
                    >
                      {projectAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <RechartsTooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No projects assigned
              </Typography>
            )}
          </Paper>
          
          {/* Assigned Projects List */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Assigned Projects</Typography>
            {assignedProjects.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No projects assigned yet
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {assignedProjects.map((project) => (
                  <Box
                    key={project!.id}
                    onClick={() => navigate(`/projects/${project!.id}`)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'action.hover',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'action.selected',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {project!.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {project!.technologies.slice(0, 3).join(', ')}
                      </Typography>
                    </Box>
                    <Chip
                      label={project!.status}
                      size="small"
                      color={
                        project!.status === 'active'
                          ? 'success'
                          : project!.status === 'completed'
                          ? 'info'
                          : project!.status === 'on-hold'
                          ? 'warning'
                          : 'default'
                      }
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
          
          {/* Quick Stats */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Annual Summary</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">Annual Salary</Typography>
                  <Typography variant="body2" fontWeight={600}>{formatCurrency(worker.monthlySalary * 12)}</Typography>
                </Box>
                <LinearProgress variant="determinate" value={75} sx={{ height: 6, borderRadius: 3 }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">Project Load</Typography>
                  <Typography variant="body2" fontWeight={600}>{Math.min(100, assignedProjects.length * 25)}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, assignedProjects.length * 25)}
                  color={assignedProjects.length > 3 ? 'warning' : 'primary'}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">Skill Diversity</Typography>
                  <Typography variant="body2" fontWeight={600}>{Math.min(100, worker.skills.length * 10)}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, worker.skills.length * 10)}
                  color="success"
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
