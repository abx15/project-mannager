import React, { useMemo, useRef, useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Chip,
  IconButton,
  Button,
  Tooltip,
} from '@mui/material';
import {
  CalendarMonth,
  Flag,
  CheckCircle,
  CheckCircleOutline,
  ArrowForward,
  Visibility,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, differenceInDays, isAfter } from 'date-fns';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
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

export function UpcomingEventsWidget() {
  const navigate = useNavigate();
  const { projects, toggleMilestoneComplete } = useData();
  const containerRef = useRef<HTMLDivElement>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const checkmarkRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  // Collect all upcoming events
  const upcomingEvents = useMemo<CalendarEvent[]>(() => {
    const allEvents: CalendarEvent[] = [];
    const today = new Date();

    projects.forEach((project) => {
      // Project deadline
      if (project.deadline) {
        const deadlineDate = parseISO(project.deadline);
        if (isAfter(deadlineDate, today)) {
          allEvents.push({
            id: `deadline-${project.id}`,
            title: `${project.name} Deadline`,
            date: deadlineDate,
            type: 'deadline',
            projectId: project.id,
            projectName: project.name,
          });
        }
      }

      // Project milestones
      if (project.milestones) {
        project.milestones.forEach((milestone) => {
          const milestoneDate = parseISO(milestone.dueDate);
          if (isAfter(milestoneDate, today) && !milestone.completed) {
            allEvents.push({
              id: milestone.id,
              title: milestone.title,
              date: milestoneDate,
              type: 'milestone',
              projectId: project.id,
              projectName: project.name,
              completed: milestone.completed,
            });
          }
        });
      }
    });

    // Sort by date and take first 5
    return allEvents
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  }, [projects]);

  const getDaysRemaining = (date: Date) => {
    const days = differenceInDays(date, new Date());
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days`;
  };

  const getUrgencyColor = (date: Date) => {
    const days = differenceInDays(date, new Date());
    if (days <= 3) return 'error';
    if (days <= 7) return 'warning';
    return 'success';
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleViewCalendar = () => {
    navigate('/calendar');
  };

  const handleCompleteMilestone = (event: CalendarEvent) => {
    if (event.type !== 'milestone') return;

    setCompletingId(event.id);
    const buttonEl = checkmarkRefs.current.get(event.id);

    if (buttonEl) {
      // Animate the checkmark
      const tl = gsap.timeline({
        onComplete: () => {
          // Actually complete the milestone
          toggleMilestoneComplete(event.projectId, event.id);
          toast.success(`"${event.title}" marked as complete!`, {
            description: event.projectName,
          });
          setCompletingId(null);
        },
      });

      // Scale up and rotate
      tl.to(buttonEl, {
        scale: 1.3,
        rotation: 360,
        duration: 0.3,
        ease: 'back.out(1.7)',
      });

      // Change color with a pulse
      tl.to(buttonEl, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out',
      });

      // Fade out the entire row
      const row = buttonEl.closest('[data-event-row]');
      if (row) {
        tl.to(
          row,
          {
            opacity: 0,
            x: 50,
            height: 0,
            padding: 0,
            marginBottom: 0,
            duration: 0.4,
            ease: 'power2.in',
          },
          '-=0.1'
        );
      }
    } else {
      // Fallback if no animation
      toggleMilestoneComplete(event.projectId, event.id);
      toast.success(`"${event.title}" marked as complete!`);
      setCompletingId(null);
    }
  };

  return (
    <Card ref={containerRef} sx={{ p: 3, height: '100%' }} data-animate="card">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarMonth color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Upcoming Events
          </Typography>
        </Box>
        <Button
          size="small"
          endIcon={<ArrowForward />}
          onClick={handleViewCalendar}
          sx={{ textTransform: 'none' }}
        >
          View Calendar
        </Button>
      </Box>

      {upcomingEvents.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            color: 'text.secondary',
          }}
        >
          <CheckCircle sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
          <Typography variant="body2">No upcoming events</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {upcomingEvents.map((event) => (
            <Box
              key={event.id}
              data-event-row
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.default',
                border: 1,
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'all 0.2s ease',
                overflow: 'hidden',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: 1,
                  transform: 'translateX(4px)',
                },
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: event.type === 'deadline' ? 'error.main' : 'primary.main',
                  color: 'white',
                  flexShrink: 0,
                }}
              >
                {event.type === 'deadline' ? (
                  <Flag fontSize="small" />
                ) : (
                  <CheckCircle fontSize="small" />
                )}
              </Box>

              {/* Content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {event.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {event.projectName} • {format(event.date, 'MMM d, yyyy')}
                </Typography>
              </Box>

              {/* Days remaining */}
              <Chip
                label={getDaysRemaining(event.date)}
                size="small"
                color={getUrgencyColor(event.date)}
                sx={{ fontWeight: 500, minWidth: 80 }}
              />

              {/* Complete Action (for milestones only) */}
              {event.type === 'milestone' && (
                <Tooltip title="Mark as Complete">
                  <IconButton
                    ref={(el) => {
                      if (el) checkmarkRefs.current.set(event.id, el);
                    }}
                    size="small"
                    onClick={() => handleCompleteMilestone(event)}
                    disabled={completingId === event.id}
                    sx={{
                      color: completingId === event.id ? 'success.main' : 'text.secondary',
                      '&:hover': { 
                        color: 'success.main',
                        bgcolor: 'success.main',
                        '& svg': { color: 'white' },
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {completingId === event.id ? (
                      <CheckCircle fontSize="small" />
                    ) : (
                      <CheckCircleOutline fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              )}

              {/* View Action */}
              <Tooltip title="View Project">
                <IconButton
                  size="small"
                  onClick={() => handleViewProject(event.projectId)}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
        </Box>
      )}
    </Card>
  );
}
