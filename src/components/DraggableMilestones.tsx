import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, IconButton, Tooltip, TextField, Button } from '@mui/material';
import { CheckCircle, DragIndicator, Add, Delete, Edit, Save, Close } from '@mui/icons-material';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

export interface Milestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}

interface DraggableMilestonesProps {
  milestones: Milestone[];
  onReorder: (milestones: Milestone[]) => void;
  onToggleComplete: (id: string) => void;
  onAdd: (milestone: Omit<Milestone, 'id'>) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Milestone>) => void;
  isAdmin: boolean;
}

export function DraggableMilestones({
  milestones,
  onReorder,
  onToggleComplete,
  onAdd,
  onDelete,
  onUpdate,
  isAdmin,
}: DraggableMilestonesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const draggablesRef = useRef<Draggable[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ title: '', date: '' });

  useEffect(() => {
    if (!containerRef.current || !isAdmin) return;

    // Clean up previous draggables
    draggablesRef.current.forEach((d) => d.kill());
    draggablesRef.current = [];

    const items = itemsRef.current.filter(Boolean);
    const itemHeight = 72;

    items.forEach((item, index) => {
      if (!item) return;

      const draggable = Draggable.create(item, {
        type: 'y',
        bounds: containerRef.current,
        edgeResistance: 0.65,
        inertia: true,
        cursor: 'grab',
        activeCursor: 'grabbing',
        trigger: item.querySelector('.drag-handle'),
        onDragStart: function () {
          gsap.to(item, {
            scale: 1.02,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            zIndex: 100,
            duration: 0.2,
          });
        },
        onDrag: function () {
          const y = this.y;
          const newIndex = Math.round(y / itemHeight);
          const clampedIndex = Math.max(0, Math.min(items.length - 1, index + newIndex));

          items.forEach((otherItem, otherIndex) => {
            if (otherItem === item) return;

            let offset = 0;
            if (otherIndex > index && otherIndex <= clampedIndex) {
              offset = -itemHeight;
            } else if (otherIndex < index && otherIndex >= clampedIndex) {
              offset = itemHeight;
            }

            gsap.to(otherItem, {
              y: offset,
              duration: 0.2,
              ease: 'power2.out',
            });
          });
        },
        onDragEnd: function () {
          const y = this.y;
          const movement = Math.round(y / itemHeight);
          const newIndex = Math.max(0, Math.min(items.length - 1, index + movement));

          // Reset all items
          items.forEach((otherItem) => {
            gsap.to(otherItem, {
              y: 0,
              scale: 1,
              boxShadow: 'none',
              zIndex: 1,
              duration: 0.3,
              ease: 'power2.out',
            });
          });

          // Reorder milestones
          if (newIndex !== index) {
            const newMilestones = [...milestones];
            const [removed] = newMilestones.splice(index, 1);
            newMilestones.splice(newIndex, 0, removed);
            onReorder(newMilestones);
          }

          gsap.to(item, {
            y: 0,
            scale: 1,
            boxShadow: 'none',
            zIndex: 1,
            duration: 0.3,
            ease: 'power2.out',
          });
        },
      })[0];

      draggablesRef.current.push(draggable);
    });

    return () => {
      draggablesRef.current.forEach((d) => d.kill());
    };
  }, [milestones, isAdmin, onReorder]);

  // Animate items on mount
  useEffect(() => {
    const items = itemsRef.current.filter(Boolean);
    gsap.fromTo(
      items,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power3.out',
      }
    );
  }, []);

  const handleStartEdit = (milestone: Milestone) => {
    setEditingId(milestone.id);
    setEditTitle(milestone.title);
  };

  const handleSaveEdit = (id: string) => {
    onUpdate(id, { title: editTitle });
    setEditingId(null);
    setEditTitle('');
  };

  const handleAddMilestone = () => {
    if (newMilestone.title && newMilestone.date) {
      onAdd({
        title: newMilestone.title,
        date: newMilestone.date,
        completed: false,
      });
      setNewMilestone({ title: '', date: '' });
      setShowAddForm(false);
    }
  };

  return (
    <Box>
      <Box ref={containerRef} sx={{ position: 'relative' }}>
        {/* Timeline line */}
        <Box
          sx={{
            position: 'absolute',
            left: isAdmin ? 43 : 15,
            top: 0,
            bottom: 0,
            width: 2,
            bgcolor: 'divider',
          }}
        />

        {milestones.map((milestone, index) => (
          <Box
            key={milestone.id}
            ref={(el: HTMLDivElement) => (itemsRef.current[index] = el)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: index === milestones.length - 1 ? 0 : 2,
              position: 'relative',
              p: 1.5,
              borderRadius: 2,
              bgcolor: 'background.paper',
              transition: 'background-color 0.2s ease',
              '&:hover': {
                bgcolor: isAdmin ? 'action.hover' : 'background.paper',
              },
            }}
          >
            {/* Drag Handle */}
            {isAdmin && (
              <Box
                className="drag-handle"
                sx={{
                  cursor: 'grab',
                  color: 'text.disabled',
                  '&:hover': { color: 'text.secondary' },
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <DragIndicator />
              </Box>
            )}

            {/* Completion Circle */}
            <Box
              onClick={() => isAdmin && onToggleComplete(milestone.id)}
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: milestone.completed ? 'success.main' : 'grey.300',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                zIndex: 1,
                cursor: isAdmin ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                '&:hover': isAdmin
                  ? {
                      transform: 'scale(1.1)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }
                  : {},
              }}
            >
              <CheckCircle
                sx={{
                  fontSize: 18,
                  color: milestone.completed ? 'white' : 'text.disabled',
                }}
              />
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1 }}>
              {editingId === milestone.id ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    size="small"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    autoFocus
                    sx={{ flex: 1 }}
                  />
                  <IconButton size="small" onClick={() => handleSaveEdit(milestone.id)} color="primary">
                    <Save fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => setEditingId(null)}>
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      color: milestone.completed ? 'text.primary' : 'text.secondary',
                      textDecoration: milestone.completed ? 'none' : 'none',
                    }}
                  >
                    {milestone.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(milestone.date).toLocaleDateString()}
                  </Typography>
                </>
              )}
            </Box>

            {/* Actions */}
            {isAdmin && editingId !== milestone.id && (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => handleStartEdit(milestone)}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={() => onDelete(milestone.id)} sx={{ color: 'error.main' }}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* Add Milestone Form */}
      {isAdmin && (
        <Box sx={{ mt: 3 }}>
          {showAddForm ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
              <TextField
                size="small"
                label="Milestone Title"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                fullWidth
              />
              <TextField
                size="small"
                type="date"
                label="Date"
                value={newMilestone.date}
                onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" size="small" onClick={handleAddMilestone} disabled={!newMilestone.title || !newMilestone.date}>
                  Add Milestone
                </Button>
                <Button size="small" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <Button startIcon={<Add />} onClick={() => setShowAddForm(true)} size="small" sx={{ mt: 1 }}>
              Add Milestone
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
