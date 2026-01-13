import React from 'react';
import { Card, Typography, Box } from '@mui/material';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useData } from '@/contexts/DataContext';
import { useTheme } from '@/contexts/ThemeContext';

const COLORS = [
  'hsl(173, 80%, 40%)',
  'hsl(217, 91%, 60%)',
  'hsl(38, 92%, 50%)',
  'hsl(142, 76%, 36%)',
  'hsl(0, 84%, 60%)',
  'hsl(280, 70%, 50%)',
];

export function SalaryTrendsChart() {
  const { workers, getTotalMonthlyCost } = useData();
  const { settings } = useTheme();

  // Generate monthly salary data (simulated trends)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const currentTotal = getTotalMonthlyCost();
  
  const salaryData = months.map((month, index) => {
    const variance = 1 - (0.15 * (months.length - 1 - index) / months.length);
    return {
      month,
      salary: Math.round(currentTotal * variance),
      projected: Math.round(currentTotal * (1 + 0.05 * (index + 1) / months.length)),
    };
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card sx={{ p: 3, height: '100%' }} data-animate="card">
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Salary Trends
      </Typography>
      <Box sx={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <AreaChart data={salaryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salaryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(173, 80%, 40%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(173, 80%, 40%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 91%)" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: 'hsl(215, 16%, 47%)' }}
              axisLine={{ stroke: 'hsl(215, 20%, 91%)' }}
            />
            <YAxis 
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12, fill: 'hsl(215, 16%, 47%)' }}
              axisLine={{ stroke: 'hsl(215, 20%, 91%)' }}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(215, 20%, 91%)',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="salary"
              stroke="hsl(173, 80%, 40%)"
              strokeWidth={2}
              fill="url(#salaryGradient)"
              name="Actual"
            />
            <Area
              type="monotone"
              dataKey="projected"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#projectedGradient)"
              name="Projected"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
}

export function ProjectStatusChart() {
  const { projects } = useData();

  const statusData = [
    { name: 'Active', value: projects.filter(p => p.status === 'active').length, color: COLORS[0] },
    { name: 'Completed', value: projects.filter(p => p.status === 'completed').length, color: COLORS[3] },
    { name: 'On Hold', value: projects.filter(p => p.status === 'on-hold').length, color: COLORS[2] },
    { name: 'Planning', value: projects.filter(p => p.status === 'planning').length, color: COLORS[1] },
  ].filter(item => item.value > 0);

  return (
    <Card sx={{ p: 3, height: '100%' }} data-animate="card">
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Project Status Distribution
      </Typography>
      <Box sx={{ width: '100%', height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={{ stroke: 'hsl(215, 16%, 47%)' }}
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(215, 20%, 91%)',
                borderRadius: 8,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
}

export function ProjectCostBarChart() {
  const { getProjectCosts } = useData();
  const { settings } = useTheme();
  const projectCosts = getProjectCosts();

  const chartData = projectCosts.slice(0, 6).map((cost) => ({
    name: cost.projectName.length > 12 ? cost.projectName.substring(0, 12) + '...' : cost.projectName,
    cost: cost.totalCost,
    workers: cost.workers.length,
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card sx={{ p: 3, height: '100%' }} data-animate="card">
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Project Costs Comparison
      </Typography>
      <Box sx={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(173, 80%, 40%)" stopOpacity={1} />
                <stop offset="95%" stopColor="hsl(173, 80%, 50%)" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 91%)" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11, fill: 'hsl(215, 16%, 47%)' }}
              axisLine={{ stroke: 'hsl(215, 20%, 91%)' }}
            />
            <YAxis 
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 12, fill: 'hsl(215, 16%, 47%)' }}
              axisLine={{ stroke: 'hsl(215, 20%, 91%)' }}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(215, 20%, 91%)',
                borderRadius: 8,
              }}
            />
            <Bar 
              dataKey="cost" 
              fill="url(#barGradient)" 
              radius={[4, 4, 0, 0]}
              name="Cost"
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
}

export function WorkerDistributionChart() {
  const { workers } = useData();

  // Group workers by role
  const roleDistribution = workers.reduce((acc, worker) => {
    const role = worker.role;
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(roleDistribution)
    .map(([name, value], index) => ({
      name: name.length > 15 ? name.substring(0, 15) + '...' : name,
      value,
      color: COLORS[index % COLORS.length],
    }))
    .slice(0, 6);

  return (
    <Card sx={{ p: 3, height: '100%' }} data-animate="card">
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Team by Role
      </Typography>
      <Box sx={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 80, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 91%)" horizontal={false} />
            <XAxis 
              type="number"
              tick={{ fontSize: 12, fill: 'hsl(215, 16%, 47%)' }}
              axisLine={{ stroke: 'hsl(215, 20%, 91%)' }}
            />
            <YAxis 
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: 'hsl(215, 16%, 47%)' }}
              axisLine={{ stroke: 'hsl(215, 20%, 91%)' }}
              width={75}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 100%)',
                border: '1px solid hsl(215, 20%, 91%)',
                borderRadius: 8,
              }}
            />
            <Bar 
              dataKey="value" 
              radius={[0, 4, 4, 0]}
              name="Workers"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
}
