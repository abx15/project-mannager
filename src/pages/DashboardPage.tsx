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
    <Card ref={cardRef} sx={{ p: 3, height: '100%' }} data-animate="card">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            {value}
          </Typography>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="caption" color="success.main">
                {trend}
              </Typography>
            </Box>
          )}
        </Box>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: `${color}20`,
            color: color,
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.currency,
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
        <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportCSV}
            size="small"
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportJSON}
            size="small"
          >
            Export JSON
          </Button>
        </Box>
      )}

      {/* Stats Grid */}
      <Box ref={cardsRef}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
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
      <Box ref={chartsRef} sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Analytics Overview
        </Typography>
        <Grid container spacing={3}>
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
      <Grid container spacing={3} sx={{ mb: 4 }}>
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
      <Grid container spacing={3}>
        {/* Recent Projects */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 3, height: '100%' }} data-animate="card">
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Recent Projects
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {projects.slice(0, 4).map((project) => (
                <Box
                  key={project.id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'background.default',
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {project.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                      }}>
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
          <Card sx={{ p: 3, height: '100%' }} data-animate="card">
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Project Costs
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {projectCosts.slice(0, 5).map((cost) => {
                const percentage = totalCost > 0 ? (cost.totalCost / totalCost) * 100 : 0;
                return (
                  <Box key={cost.projectId}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {cost.projectName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(cost.totalCost)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 8,
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
          <Card sx={{ p: 3 }} data-animate="card">
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Team Overview
            </Typography>
            <Grid container spacing={2}>
              {workers.slice(0, 6).map((worker) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={worker.id}>
                  <Box
                    sx={{
                      p: 2,
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
