import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Tabs,
  Tab,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  InputAdornment,
  Grid,
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  Person,
  Folder,
  Edit,
  Download,
} from '@mui/icons-material';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { exportToCSV, exportToJSON } from '@/utils/exportData';
import { usePageAnimation, useTableRowAnimation } from '@/hooks/useGsapAnimations';
import gsap from 'gsap';

export function SalaryPage() {
  const { workers, projects, getSalaryData, getProjectCosts, getTotalMonthlyCost, updateWorker } = useData();
  const { isAdmin } = useAuth();
  const { settings } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<{ id: string; name: string; salary: number } | null>(null);
  const [newSalary, setNewSalary] = useState('');
  const pageRef = usePageAnimation();
  const tableRef = useTableRowAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  const salaryData = getSalaryData();
  const projectCosts = getProjectCosts();
  const totalCost = getTotalMonthlyCost();

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleEditSalary = (workerId: string, name: string, currentSalary: number) => {
    setEditingWorker({ id: workerId, name, salary: currentSalary });
    setNewSalary(currentSalary.toString());
    setEditDialogOpen(true);
  };

  const handleSaveSalary = () => {
    if (editingWorker && newSalary) {
      updateWorker(editingWorker.id, { monthlySalary: parseInt(newSalary) });
    }
    setEditDialogOpen(false);
    setEditingWorker(null);
  };

  const averageSalary = workers.length > 0 ? Math.round(totalCost / workers.length) : 0;
  const highestSalary = Math.max(...workers.map((w) => w.monthlySalary), 0);
  const activeWorkers = workers.filter((w) => w.status === 'active').length;

  return (
    <Box ref={pageRef} sx={{ width: '100%' }}>
      {/* Export Buttons */}
      {isAdmin && (
        <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => exportToCSV(salaryData.map(d => ({
              name: d.workerName,
              role: d.role,
              salary: d.salary,
              projects: d.projects.length
            })), 'salary-report')}
            size="small"
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => exportToJSON({ salaryData, projectCosts, totalCost }, 'salary-report')}
            size="small"
          >
            Export JSON
          </Button>
        </Box>
      )}

      {/* Summary Cards */}
      <Box ref={containerRef}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Total Monthly Cost
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {formatCurrency(totalCost)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                  <AttachMoney />
                </Avatar>
              </Box>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Average Salary
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {formatCurrency(averageSalary)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main', width: 48, height: 48 }}>
                  <TrendingUp />
                </Avatar>
              </Box>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Highest Salary
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {formatCurrency(highestSalary)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main', width: 48, height: 48 }}>
                  <Person />
                </Avatar>
              </Box>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Active Workers
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {activeWorkers}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48 }}>
                  <Person />
                </Avatar>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab icon={<Person />} iconPosition="start" label="Worker Salaries" />
            <Tab icon={<Folder />} iconPosition="start" label="Project Costs" />
          </Tabs>
        </Box>

        {/* Worker Salaries Tab */}
        {activeTab === 0 && (
          <TableContainer ref={tableRef}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Team Member</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Projects</TableCell>
                  <TableCell align="right">Monthly Salary</TableCell>
                  <TableCell align="right">% of Total</TableCell>
                  {isAdmin && <TableCell align="right">Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {salaryData.map((data) => {
                  const percentage = totalCost > 0 ? (data.salary / totalCost) * 100 : 0;
                  return (
                    <TableRow 
                      key={data.workerId} 
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
                            {data.workerName.split(' ').map((n) => n[0]).join('')}
                          </Avatar>
                          <Typography variant="subtitle2">{data.workerName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{data.role}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {data.projects.slice(0, 2).map((p) => (
                            <Chip
                              key={p.projectId}
                              label={p.projectName}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                          {data.projects.length > 2 && (
                            <Chip
                              label={`+${data.projects.length - 2}`}
                              size="small"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(data.salary)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ flex: 1, minWidth: 60 }}>
                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: 'action.hover',
                                '& .MuiLinearProgress-bar': { borderRadius: 3 },
                              }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                            {percentage.toFixed(1)}%
                          </Typography>
                        </Box>
                      </TableCell>
                      {isAdmin && (
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleEditSalary(data.workerId, data.workerName, data.salary)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Project Costs Tab */}
        {activeTab === 1 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project</TableCell>
                  <TableCell>Team Members</TableCell>
                  <TableCell align="right">Monthly Cost</TableCell>
                  <TableCell align="right">% of Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projectCosts.map((cost) => {
                  const percentage = totalCost > 0 ? (cost.totalCost / totalCost) * 100 : 0;
                  return (
                    <TableRow 
                      key={cost.projectId} 
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
                            <Folder />
                          </Avatar>
                          <Typography variant="subtitle2">{cost.projectName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {cost.workers.slice(0, 3).map((w) => (
                            <Chip
                              key={w.workerId}
                              label={`${w.workerName} (${formatCurrency(w.cost)})`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                          {cost.workers.length > 3 && (
                            <Chip
                              label={`+${cost.workers.length - 3}`}
                              size="small"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(cost.totalCost)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ flex: 1, minWidth: 60 }}>
                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: 'action.hover',
                                '& .MuiLinearProgress-bar': { borderRadius: 3 },
                              }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                            {percentage.toFixed(1)}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Edit Salary Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Update Salary</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Update monthly salary for {editingWorker?.name}
          </Typography>
          <TextField
            fullWidth
            label="Monthly Salary"
            type="number"
            value={newSalary}
            onChange={(e) => setNewSalary(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveSalary}
            sx={{
              background: 'linear-gradient(135deg, hsl(173, 80%, 40%), hsl(195, 80%, 45%))',
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
