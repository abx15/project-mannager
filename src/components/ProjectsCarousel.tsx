import { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import { Box, Typography, Chip, Card, CardContent, Avatar, AvatarGroup } from '@mui/material';
import { TrendingUp, CheckCircle, AccessTime, Lightbulb } from '@mui/icons-material';
import gsap from 'gsap';
import { useData } from '@/contexts/DataContext';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const statusConfig = {
  active: { color: 'success', icon: TrendingUp, label: 'Active' },
  completed: { color: 'info', icon: CheckCircle, label: 'Completed' },
  'on-hold': { color: 'warning', icon: AccessTime, label: 'On Hold' },
  planning: { color: 'secondary', icon: Lightbulb, label: 'Planning' },
} as const;

export function ProjectsCarousel() {
  const { projects, workers } = useData();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.3,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getWorkersByProject = (workerIds: string[]) => {
    return workerIds.map((id) => workers.find((w) => w.id === id)).filter(Boolean);
  };

  return (
    <Box ref={containerRef} sx={{ py: 2 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Project Highlights
      </Typography>
      
      <Swiper
        modules={[Autoplay, Pagination, EffectCoverflow]}
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
          slideShadows: false,
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        loop
        style={{ paddingBottom: '40px' }}
      >
        {projects.map((project) => {
          const StatusIcon = statusConfig[project.status].icon;
          const projectWorkers = getWorkersByProject(project.assignedWorkers);

          return (
            <SwiperSlide
              key={project.id}
              style={{ width: '340px', maxWidth: '90%' }}
            >
              <Card
                sx={{
                  height: '100%',
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(145deg, hsl(222, 47%, 12%), hsl(222, 47%, 9%))'
                      : 'linear-gradient(145deg, #ffffff, hsl(210, 20%, 98%))',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '0 12px 40px rgba(0,0,0,0.4)'
                        : '0 12px 40px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Chip
                      icon={<StatusIcon sx={{ fontSize: 16 }} />}
                      label={statusConfig[project.status].label}
                      color={statusConfig[project.status].color}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                    {project.budget && (
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        ${project.budget.toLocaleString()}
                      </Typography>
                    )}
                  </Box>

                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {project.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {project.description}
                  </Typography>

                  <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
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
                        sx={{ fontSize: '0.7rem', height: 24 }}
                      />
                    )}
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.75rem' } }}>
                      {projectWorkers.map((worker) => (
                        <Avatar key={worker?.id} sx={{ bgcolor: 'primary.main' }}>
                          {worker?.name.charAt(0)}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                    
                    {project.deadline && (
                      <Typography variant="caption" color="text.secondary">
                        Due: {new Date(project.deadline).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
}
