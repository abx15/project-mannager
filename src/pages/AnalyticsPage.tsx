import React, { useEffect, useRef } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  People,
  Folder,
  Speed,
  Timeline,
  Assessment,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { useData } from '@/contexts/DataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { usePageAnimation, useSectionReveal, useChartAnimation } from '@/hooks/useGsapAnimations';
import gsap from 'gsap';

const COLORS = [
  'hsl(173, 80%, 40%)',
  'hsl(217, 91%, 60%)',
  'hsl(38, 92%, 50%)',
  'hsl(142, 76%, 36%)',
  'hsl(0, 84%, 60%)',
  'hsl(280, 70%, 50%)',
  'hsl(200, 70%, 50%)',
  'hsl(320, 70%, 50%)',
];

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

function MetricCard({ title, value, change, icon, color }: MetricCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      const handleMouseEnter = () => {
        gsap.to(cardRef.current, {
          scale: 1.02,
          y: -4,
          boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
          scale: 1,
          y: 0,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      cardRef.current.addEventListener('mouseenter', handleMouseEnter);
      cardRef.current.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        cardRef.current?.removeEventListener('mouseenter', handleMouseEnter);
        cardRef.current?.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  const isPositive = change >= 0;

  return (
    <Card ref={cardRef} sx={{ p: { xs: 2, sm: 2.5, md: 3 }, cursor: 'pointer' }} data-animate="card">
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
              mb: 1,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              wordBreak: 'break-word',
            }}
          >
            {value}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
            {isPositive ? (
              <TrendingUp sx={{ fontSize: { xs: 14, sm: 16 }, color: 'success.main' }} />
            ) : (
              <TrendingDown sx={{ fontSize: { xs: 14, sm: 16 }, color: 'error.main' }} />
            )}
            <Typography
              variant="caption"
              sx={{ 
                color: isPositive ? 'success.main' : 'error.main', 
                fontWeight: 600,
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
              }}
            >
              {isPositive ? '+' : ''}{change}%
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
              }}
            >
              vs last month
            </Typography>
          </Box>
        </Box>
        <Avatar sx={{ 
          width: { xs: 40, sm: 48 }, 
          height: { xs: 40, sm: 48 }, 
          bgcolor: `${color}20`, 
          color: color,
          flexShrink: 0,
          fontSize: { xs: '1.2rem', sm: '1.5rem' },
        }}>
          {icon}
        </Avatar>
      </Box>
    </Card>
  );
}

export function AnalyticsPage() {
  const { projects, workers, getTotalMonthlyCost, getProjectCosts, getSalaryData } = useData();
  const { settings } = useTheme();
  const containerRef = usePageAnimation();
  const chartsRef1 = useSectionReveal();
  const chartsRef2 = useSectionReveal();
  const chartsRef3 = useSectionReveal();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate metrics
  const totalCost = getTotalMonthlyCost();
  const projectCosts = getProjectCosts();
  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const activeWorkers = workers.filter((w) => w.status === 'active').length;
  const avgSalary = workers.length > 0 ? totalCost / workers.length : 0;

  // Monthly trends data (simulated 12-month history)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyTrends = months.map((month, index) => {
    const factor = 0.7 + (index / 12) * 0.3;
    return {
      month,
      actual: Math.round(totalCost * factor),
      budget: Math.round(totalCost * 0.95 * factor),
      forecast: Math.round(totalCost * (1 + 0.05 * (index - 5) / 7)),
    };
  });

  // Project status distribution
  const statusData = [
    { name: 'Active', value: projects.filter((p) => p.status === 'active').length, color: COLORS[0] },
    { name: 'Completed', value: projects.filter((p) => p.status === 'completed').length, color: COLORS[3] },
    { name: 'On Hold', value: projects.filter((p) => p.status === 'on-hold').length, color: COLORS[2] },
    { name: 'Planning', value: projects.filter((p) => p.status === 'planning').length, color: COLORS[1] },
  ].filter((item) => item.value > 0);

  // Worker productivity metrics
  const productivityData = workers.slice(0, 8).map((worker) => ({
    name: worker.name.split(' ')[0],
    projects: worker.assignedProjects.length,
    efficiency: Math.round(70 + Math.random() * 30),
    skills: worker.skills.length,
  }));

  // Skill distribution
  const skillCounts: Record<string, number> = {};
  workers.forEach((worker) => {
    worker.skills.forEach((skill) => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });
  const skillData = Object.entries(skillCounts)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Budget allocation by project
  const budgetData = projectCosts.slice(0, 6).map((cost, index) => ({
    name: cost.projectName.length > 10 ? cost.projectName.substring(0, 10) + '...' : cost.projectName,
    cost: cost.totalCost,
    workers: cost.workers.length,
    color: COLORS[index % COLORS.length],
  }));

  // Team radar chart data
  const teamMetrics = [
    { metric: 'Projects', value: Math.min(100, activeProjects * 20) },
    { metric: 'Team Size', value: Math.min(100, workers.length * 10) },
    { metric: 'Avg Skills', value: Math.min(100, (workers.reduce((acc, w) => acc + w.skills.length, 0) / workers.length) * 15) },
    { metric: 'Active Rate', value: Math.min(100, (activeWorkers / workers.length) * 100) },
    { metric: 'Budget Usage', value: 75 },
    { metric: 'Completion', value: Math.min(100, (projects.filter((p) => p.status === 'completed').length / projects.length) * 100) },
  ];

  // Quarterly comparison
  const quarterlyData = [
    { quarter: 'Q1', revenue: totalCost * 0.8, costs: totalCost * 0.7, profit: totalCost * 0.1 },
    { quarter: 'Q2', revenue: totalCost * 0.9, costs: totalCost * 0.75, profit: totalCost * 0.15 },
    { quarter: 'Q3', revenue: totalCost * 1.0, costs: totalCost * 0.85, profit: totalCost * 0.15 },
    { quarter: 'Q4', revenue: totalCost * 1.1, costs: totalCost * 0.9, profit: totalCost * 0.2 },
  ];

  return (
    <Box ref={containerRef} sx={{ width: '100%' }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 1, 
          fontWeight: 700,
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
        }}
      >
        Analytics Dashboard
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ 
          mb: { xs: 3, sm: 4 },
          fontSize: { xs: '0.85rem', sm: '0.95rem' },
        }}
      >
        Comprehensive insights into your team performance and budget allocation
      </Typography>

      {/* Metric Cards */}
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Total Monthly Cost"
            value={formatCurrency(totalCost)}
            change={12.5}
            icon={<AttachMoney />}
            color="hsl(173, 80%, 40%)"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Active Projects"
            value={activeProjects}
            change={8.2}
            icon={<Folder />}
            color="hsl(217, 91%, 60%)"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Team Members"
            value={workers.length}
            change={5.0}
            icon={<People />}
            color="hsl(38, 92%, 50%)"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Avg. Salary"
            value={formatCurrency(avgSalary)}
            change={-2.3}
            icon={<Speed />}
            color="hsl(142, 76%, 36%)"
          />
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Box ref={chartsRef1} sx={{ mb: { xs: 3, sm: 4 } }}>
        <Typography 
          variant="h5" 
          sx={{ 
            mb: { xs: 2, sm: 3 }, 
            fontWeight: 600,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          }}
        >
          Financial Overview
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card sx={{ p: { xs: 2, sm: 2.5, md: 3 }, height: '100%' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: { xs: 2, sm: 3 }, 
                  fontWeight: 600,
                  fontSize: { xs: '0.95rem', sm: '1.1rem' },
                }}
              >
                Monthly Salary Trends & Forecast
              </Typography>
              <Box sx={{ width: '100%', height: { xs: 250, sm: 300, md: 320 } }}>
                <ResponsiveContainer>
                  <ComposedChart data={monthlyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(173, 80%, 40%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(173, 80%, 40%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 91%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(215, 16%, 47%)' }} />
                    <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: 'hsl(215, 16%, 47%)' }} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Area type="monotone" dataKey="actual" fill="url(#actualGradient)" stroke="hsl(173, 80%, 40%)" strokeWidth={2} name="Actual" />
                    <Line type="monotone" dataKey="budget" stroke="hsl(217, 91%, 60%)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Budget" />
                    <Line type="monotone" dataKey="forecast" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={false} name="Forecast" />
                  </ComposedChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Project Status
              </Typography>
              <Box sx={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Charts Row 2 */}
      <Box ref={chartsRef2} sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Team Performance
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Worker Productivity Metrics
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={productivityData} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 91%)" />
                    <XAxis type="number" tick={{ fontSize: 12, fill: 'hsl(215, 16%, 47%)' }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: 'hsl(215, 16%, 47%)' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="efficiency" fill="hsl(173, 80%, 40%)" name="Efficiency %" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="projects" fill="hsl(217, 91%, 60%)" name="Projects" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Team Capabilities
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <RadarChart data={teamMetrics}>
                    <PolarGrid stroke="hsl(215, 20%, 91%)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: 'hsl(215, 16%, 47%)' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(215, 16%, 47%)' }} />
                    <Radar name="Performance" dataKey="value" stroke="hsl(173, 80%, 40%)" fill="hsl(173, 80%, 40%)" fillOpacity={0.4} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Charts Row 3 */}
      <Box ref={chartsRef3} sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Resource Allocation
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Skill Distribution
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={skillData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 91%)" vertical={false} />
                    <XAxis dataKey="skill" tick={{ fontSize: 10, fill: 'hsl(215, 16%, 47%)' }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(215, 16%, 47%)' }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} name="Team Members" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Quarterly Performance
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={quarterlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 91%)" vertical={false} />
                    <XAxis dataKey="quarter" tick={{ fontSize: 12, fill: 'hsl(215, 16%, 47%)' }} />
                    <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: 'hsl(215, 16%, 47%)' }} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="revenue" fill="hsl(173, 80%, 40%)" name="Revenue" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="costs" fill="hsl(217, 91%, 60%)" name="Costs" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Budget Breakdown */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Budget Allocation by Project
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {budgetData.map((item, index) => {
            const percentage = totalCost > 0 ? (item.cost / totalCost) * 100 : 0;
            return (
              <Box key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.name}
                    </Typography>
                    <Chip label={`${item.workers} workers`} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(item.cost)} ({percentage.toFixed(1)}%)
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
                      bgcolor: item.color,
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </Card>
    </Box>
  );
}