import React, { useEffect, useRef } from 'react';
import {
  Box,
  Card,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Grid,
  Button,
} from '@mui/material';
import {
  Folder as ProjectsIcon,
  People as WorkersIcon,
  AttachMoney as SalaryIcon,
  TrendingUp,
  CheckCircle,
  Schedule,
  PlayArrow,
  Download,
} from '@mui/icons-material';
import { useData } from '@/contexts/DataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectsCarousel } from '@/components/ProjectsCarousel';
import { TeamAchievements } from '@/components/TeamAchievements';
import { UpcomingEventsWidget } from '@/components/UpcomingEventsWidget';
import { SalaryTrendsChart, ProjectStatusChart, ProjectCostBarChart, WorkerDistributionChart } from '@/components/DashboardCharts';
import { exportToCSV, exportToJSON } from '@/utils/exportData';
import { usePageAnimation, useCardAnimation, useHoverAnimation, useSectionReveal } from '@/hooks/useGsapAnimations';
import gsap from 'gsap';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <Card ref={cardRef} sx={{ p: { xs: 2, sm: 2.5, md: 3 }, height: '100%' }} data-animate="card">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
        <Box>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 1,
              fontSize: { xs: '0.75rem', sm: '0.85rem' },
              fontWeight: 500,
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 0.5,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              wordBreak: 'break-word',
            }}
          >
            {value}
          </Typography>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUp sx={{ fontSize: { xs: 14, sm: 16 }, color: 'success.main' }} />
              <Typography 
                variant="caption" 
                color="success.main"
                sx={{
                  fontSize: { xs: '0.7rem', sm: '0.8rem' },
                }}
              >
                {trend}
              </Typography>
            </Box>
          )}
        </Box>
        <Avatar
          sx={{
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
            bgcolor: `${color}20`,
            color: color,
            flexShrink: 0,
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
          }}
        >
          {icon}
        </Avatar>
      </Box>
    </Card>
  );
}

export function DashboardPage() {
  const { projects, workers, getTotalMonthlyCost, getProjectCosts } = useData();
  const { settings } = useTheme();
  const { isAdmin } = useAuth();
  const containerRef = usePageAnimation();
  const cardsRef = useCardAnimation();
  const chartsRef = useSectionReveal();

  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const activeWorkers = workers.filter((w) => w.status === 'active').length;
  const totalCost = getTotalMonthlyCost();
  const projectCosts = getProjectCosts();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'on-hold':
        return 'warning';
      case 'planning':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <PlayArrow sx={{ fontSize: 14 }} />;
      case 'completed':
        return <CheckCircle sx={{ fontSize: 14 }} />;
      case 'on-hold':
        return <Schedule sx={{ fontSize: 14 }} />;
      default:
        return null;
    }
  };

  const handleExportCSV = () => {
    exportToCSV(projects, 'projects');
    exportToCSV(workers, 'workers');
  };

  const handleExportJSON = () => {
    exportToJSON({ projects, workers }, 'workledger-data');
  };

  return (
    <Box ref={containerRef} sx={{ width: '100%' }}>
      {/* Export Buttons */}
      {isAdmin && (
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 1, sm: 1.5 }, 
          mb: { xs: 2, sm: 3 }, 
          justifyContent: 'flex-end',
          flexWrap: 'wrap',
        }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportCSV}
            size="small"
            sx={{
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              py: { xs: 0.8, sm: 1 },
              px: { xs: 1.5, sm: 2 },
              minHeight: '36px',
            }}
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportJSON}
            size="small"
            sx={{
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              py: { xs: 0.8, sm: 1 },
              px: { xs: 1.5, sm: 2 },
              minHeight: '36px',
            }}
          >
            Export JSON
          </Button>
        </Box>
      )}

      {/* Stats Grid */}
      <Box ref={cardsRef}>
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Total Projects"
              value={projects.length}
              icon={<ProjectsIcon />}
              color="hsl(173, 80%, 40%)"
              trend={`${activeProjects} active`}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Team Members"
              value={workers.length}
              icon={<WorkersIcon />}
              color="hsl(217, 91%, 60%)"
              trend={`${activeWorkers} active`}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Monthly Cost"
              value={formatCurrency(totalCost)}
              icon={<SalaryIcon />}
              color="hsl(38, 92%, 50%)"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title="Completed"
              value={completedProjects}
              icon={<CheckCircle />}
              color="hsl(142, 76%, 36%)"
              trend="Projects finished"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Charts Section */}
      <Box ref={chartsRef} sx={{ mb: { xs: 3, sm: 4 } }}>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: { xs: 2, sm: 3 }, 
            fontWeight: 600,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          }}
        >
          Analytics Overview
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <SalaryTrendsChart />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <ProjectStatusChart />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <ProjectCostBarChart />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <WorkerDistributionChart />
          </Grid>
        </Grid>
      </Box>

      {/* Upcoming Events & Carousels */}
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <UpcomingEventsWidget />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <ProjectsCarousel />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <TeamAchievements />
        </Grid>
      </Grid>

      {/* Projects and Team Overview */}
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
        {/* Recent Projects */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, height: '100%' }} data-animate="card">
            <Typography 
              variant="h6" 
              sx={{ 
                mb: { xs: 2, sm: 3 }, 
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.1rem' },
              }}
            >
              Recent Projects
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
              {projects.slice(0, 4).map((project) => (
                <Box
                  key={project.id}
                  sx={{
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: 2,
                    bgcolor: 'background.default',
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    mb: 1.5,
                    gap: 1,
                    flexWrap: 'wrap',
                  }}>
                    <Box sx={{ flex: 1, minWidth: '200px' }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600, 
                          mb: 0.5,
                          fontSize: { xs: '0.95rem', sm: '1rem' },
                        }}
                      >
                        {project.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          fontSize: { xs: '0.8rem', sm: '0.85rem' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {project.description}
                      </Typography>
                    </Box>
                    <Chip
                      icon={getStatusIcon(project.status) || undefined}
                      label={project.status}
                      size="small"
                      color={getStatusColor(project.status) as any}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {project.technologies.slice(0, 4).map((tech) => (
                      <Chip
                        key={tech}
                        label={tech}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 24 }}
                      />
                    ))}
                    {project.technologies.length > 4 && (
                      <Chip
                        label={`+${project.technologies.length - 4}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 24 }}
                      />
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Project Costs */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, height: '100%' }} data-animate="card">
            <Typography 
              variant="h6" 
              sx={{ 
                mb: { xs: 2, sm: 3 }, 
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.1rem' },
              }}
            >
              Project Costs
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 2.5 } }}>
              {projectCosts.slice(0, 5).map((cost) => {
                const percentage = totalCost > 0 ? (cost.totalCost / totalCost) * 100 : 0;
                return (
                  <Box key={cost.projectId}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, gap: 1, flexWrap: 'wrap' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          fontSize: { xs: '0.8rem', sm: '0.9rem' },
                        }}
                      >
                        {cost.projectName}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: '0.8rem', sm: '0.9rem' },
                        }}
                      >
                        {formatCurrency(cost.totalCost)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: { xs: 6, sm: 8 },
                        borderRadius: 4,
                        bgcolor: 'action.hover',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Card>
        </Grid>

        {/* Team Overview */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 } }} data-animate="card">
            <Typography 
              variant="h6" 
              sx={{ 
                mb: { xs: 2, sm: 3 }, 
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.1rem' },
              }}
            >
              Team Overview
            </Typography>
            <Grid container spacing={{ xs: 1.5, sm: 2 }}>
              {workers.slice(0, 6).map((worker) => (
                <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={worker.id}>
                  <Box
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      borderRadius: 2,
                      bgcolor: 'background.default',
                      border: 1,
                      borderColor: 'divider',
                      textAlign: 'center',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        mx: 'auto',
                        mb: 1.5,
                        bgcolor: 'primary.main',
                      }}
                    >
                      {worker.name.charAt(0)}
                    </Avatar>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {worker.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {worker.role}
                    </Typography>
                    <Chip
                      label={worker.status}
                      size="small"
                      color={worker.status === 'active' ? 'success' : 'warning'}
                      sx={{ mt: 1, fontSize: '0.65rem', height: 20 }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
