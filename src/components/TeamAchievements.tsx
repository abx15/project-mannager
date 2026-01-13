import { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Box, Typography, Card, CardContent, Avatar, LinearProgress } from '@mui/material';
import { EmojiEvents, Star, Rocket, Code } from '@mui/icons-material';
import gsap from 'gsap';
import { useData } from '@/contexts/DataContext';

import 'swiper/css';
import 'swiper/css/navigation';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: typeof EmojiEvents;
  color: string;
  progress?: number;
}

export function TeamAchievements() {
  const { workers, projects } = useData();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.5,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const activeWorkers = workers.filter((w) => w.status === 'active').length;
  const totalSkills = [...new Set(workers.flatMap((w) => w.skills))].length;

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Projects Delivered',
      description: `${completedProjects} projects successfully completed`,
      icon: EmojiEvents,
      color: '#FFD700',
      progress: (completedProjects / projects.length) * 100,
    },
    {
      id: '2',
      title: 'Active Team',
      description: `${activeWorkers} talented professionals on board`,
      icon: Star,
      color: '#4CAF50',
      progress: (activeWorkers / workers.length) * 100,
    },
    {
      id: '3',
      title: 'Tech Stack Mastery',
      description: `${totalSkills} unique technologies in our arsenal`,
      icon: Code,
      color: '#2196F3',
      progress: Math.min((totalSkills / 20) * 100, 100),
    },
    {
      id: '4',
      title: 'Active Projects',
      description: `${projects.filter((p) => p.status === 'active').length} projects in progress`,
      icon: Rocket,
      color: '#FF5722',
      progress: (projects.filter((p) => p.status === 'active').length / projects.length) * 100,
    },
  ];

  return (
    <Box ref={containerRef} sx={{ py: 2 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Team Achievements
      </Typography>

      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        navigation
        loop
      >
        {achievements.map((achievement) => {
          const IconComponent = achievement.icon;

          return (
            <SwiperSlide key={achievement.id}>
              <Card
                sx={{
                  height: '100%',
                  minHeight: 180,
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(145deg, hsl(222, 47%, 12%), hsl(222, 47%, 9%))'
                      : 'linear-gradient(145deg, #ffffff, hsl(210, 20%, 98%))',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: `0 8px 24px ${achievement.color}25`,
                  },
                }}
              >
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Avatar
                    sx={{
                      bgcolor: `${achievement.color}20`,
                      width: 48,
                      height: 48,
                      mb: 2,
                    }}
                  >
                    <IconComponent sx={{ color: achievement.color, fontSize: 24 }} />
                  </Avatar>

                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {achievement.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                    {achievement.description}
                  </Typography>

                  {achievement.progress !== undefined && (
                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          Progress
                        </Typography>
                        <Typography variant="caption" fontWeight={600}>
                          {Math.round(achievement.progress)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={achievement.progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: `${achievement.color}20`,
                          '& .MuiLinearProgress-bar': {
                            bgcolor: achievement.color,
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
}
