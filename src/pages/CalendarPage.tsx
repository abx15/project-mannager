import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  useTheme,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  CalendarMonth,
  ViewWeek,
  Today,
} from '@mui/icons-material';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  addWeeks,
  subMonths,
  subWeeks,
  isSameMonth,
  isSameDay,
  parseISO,
  isWithinInterval,
} from 'date-fns';
import { useData } from '@/contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'deadline' | 'milestone';
  projectId: string;
  projectName: string;
  completed?: boolean;
}

const CalendarPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { projects } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const calendarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Animate on mount and view change
  useEffect(() => {
    if (calendarRef.current) {
      gsap.fromTo(
        calendarRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [viewMode]);

  // Animate header
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [currentDate]);

  // Collect all events from projects
  const events = useMemo<CalendarEvent[]>(() => {
    const allEvents: CalendarEvent[] = [];

    projects.forEach((project) => {
      // Project deadline
      if (project.deadline) {
        allEvents.push({
          id: `deadline-${project.id}`,
          title: `${project.name} Deadline`,
          date: parseISO(project.deadline),
          type: 'deadline',
          projectId: project.id,
          projectName: project.name,
        });
      }

      // Project milestones
      if (project.milestones) {
        project.milestones.forEach((milestone) => {
          allEvents.push({
            id: milestone.id,
            title: milestone.title,
            date: parseISO(milestone.dueDate),
            type: 'milestone',
            projectId: project.id,
            projectName: project.name,
            completed: milestone.completed,
          });
        });
      }
    });

    return allEvents;
  }, [projects]);

  // Get days to display based on view mode
  const calendarDays = useMemo(() => {
    if (viewMode === 'month') {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const startDate = startOfWeek(monthStart);
      const endDate = endOfWeek(monthEnd);

      const days: Date[] = [];
      let day = startDate;
      while (day <= endDate) {
        days.push(day);
        day = addDays(day, 1);
      }
      return days;
    } else {
      const weekStart = startOfWeek(currentDate);
      const days: Date[] = [];
      for (let i = 0; i < 7; i++) {
        days.push(addDays(weekStart, i));
      }
      return days;
    }
  }, [currentDate, viewMode]);

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(event.date, day));
  };

  // Navigation handlers
  const goToPrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const goToNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: 'month' | 'week') => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    navigate(`/projects/${event.projectId}`);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        ref={headerRef}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            {viewMode === 'month'
              ? format(currentDate, 'MMMM yyyy')
              : `Week of ${format(startOfWeek(currentDate), 'MMM d, yyyy')}`}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton onClick={goToPrevious} size="small">
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={goToNext} size="small">
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={goToToday} color="primary" size="small">
            <Today />
          </IconButton>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            size="small"
          >
            <ToggleButton value="month">
              <CalendarMonth sx={{ mr: 0.5 }} fontSize="small" />
              Month
            </ToggleButton>
            <ToggleButton value="week">
              <ViewWeek sx={{ mr: 0.5 }} fontSize="small" />
              Week
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: 'error.main',
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Deadline
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: 'primary.main',
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Milestone
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: 'success.main',
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Completed
          </Typography>
        </Box>
      </Box>

      {/* Calendar Grid */}
      <Paper
        ref={calendarRef}
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {/* Week days header */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            bgcolor: 'background.default',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          {weekDays.map((day) => (
            <Box
              key={day}
              sx={{
                p: 1.5,
                textAlign: 'center',
                fontWeight: 600,
                color: 'text.secondary',
              }}
            >
              {day}
            </Box>
          ))}
        </Box>

        {/* Calendar days */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            minHeight: viewMode === 'month' ? 600 : 400,
          }}
        >
          {calendarDays.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <Box
                key={day.toISOString()}
                sx={{
                  p: 1,
                  minHeight: viewMode === 'month' ? 100 : 350,
                  borderRight:
                    index % 7 !== 6 ? `1px solid ${theme.palette.divider}` : 'none',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  bgcolor: isToday
                    ? 'action.selected'
                    : !isCurrentMonth && viewMode === 'month'
                    ? 'action.hover'
                    : 'background.paper',
                  opacity: !isCurrentMonth && viewMode === 'month' ? 0.5 : 1,
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isToday ? 700 : 400,
                    color: isToday ? 'primary.main' : 'text.primary',
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: isToday ? 'primary.main' : 'transparent',
                    ...(isToday && { color: 'primary.contrastText' }),
                  }}
                >
                  {format(day, 'd')}
                </Typography>

                {/* Events */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {dayEvents.slice(0, viewMode === 'month' ? 3 : 10).map((event) => (
                    <Chip
                      key={event.id}
                      label={event.title}
                      size="small"
                      onClick={() => handleEventClick(event)}
                      sx={{
                        height: 'auto',
                        py: 0.25,
                        px: 0.5,
                        fontSize: '0.7rem',
                        bgcolor: event.completed
                          ? 'success.main'
                          : event.type === 'deadline'
                          ? 'error.main'
                          : 'primary.main',
                        color: 'white',
                        cursor: 'pointer',
                        '& .MuiChip-label': {
                          px: 0.5,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '100%',
                        },
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: 2,
                        },
                        transition: 'all 0.2s ease',
                      }}
                    />
                  ))}
                  {dayEvents.length > (viewMode === 'month' ? 3 : 10) && (
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', ml: 0.5 }}
                    >
                      +{dayEvents.length - (viewMode === 'month' ? 3 : 10)} more
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* Upcoming Events Summary */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>
          Upcoming Events
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
          {events
            .filter((event) => event.date >= new Date())
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, 6)
            .map((event) => (
              <Paper
                key={event.id}
                elevation={0}
                onClick={() => handleEventClick(event)}
                sx={{
                  p: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                      {event.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {event.projectName}
                    </Typography>
                  </Box>
                  <Chip
                    label={event.type}
                    size="small"
                    sx={{
                      bgcolor: event.type === 'deadline' ? 'error.light' : 'primary.light',
                      color: event.type === 'deadline' ? 'error.dark' : 'primary.dark',
                      textTransform: 'capitalize',
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <CalendarMonth fontSize="small" />
                  {format(event.date, 'EEEE, MMMM d, yyyy')}
                </Typography>
              </Paper>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CalendarPage;
