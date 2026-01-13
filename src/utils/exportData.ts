import { Project, Worker } from '@/types';

export function exportToJSON(data: object, filename: string) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  downloadBlob(blob, `${filename}.json`);
}

export function exportToCSV<T extends Record<string, any>>(data: T[], filename: string) {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const rows = data.map((item) =>
    headers.map((header) => {
      const value = item[header];
      if (value === null || value === undefined) return '';
      if (Array.isArray(value)) return `"${value.join(', ')}"`;
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return String(value);
    }).join(',')
  );

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
}

export function exportProjectsToCSV(projects: Project[]) {
  const headers = [
    'ID',
    'Name',
    'Description',
    'Status',
    'Technologies',
    'Assigned Workers',
    'Created At',
    'Updated At',
    'Budget',
    'Deadline',
  ];

  const rows = projects.map((p) => [
    p.id,
    `"${p.name.replace(/"/g, '""')}"`,
    `"${p.description.replace(/"/g, '""')}"`,
    p.status,
    `"${p.technologies.join(', ')}"`,
    `"${p.assignedWorkers.join(', ')}"`,
    p.createdAt,
    p.updatedAt,
    p.budget?.toString() || '',
    p.deadline || '',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, 'projects.csv');
}

export function exportWorkersToCSV(workers: Worker[]) {
  const headers = [
    'ID',
    'Name',
    'Email',
    'Role',
    'Skills',
    'Monthly Salary',
    'Assigned Projects',
    'Joined At',
    'Status',
  ];

  const rows = workers.map((w) => [
    w.id,
    `"${w.name.replace(/"/g, '""')}"`,
    w.email,
    `"${w.role.replace(/"/g, '""')}"`,
    `"${w.skills.join(', ')}"`,
    w.monthlySalary.toString(),
    `"${w.assignedProjects.join(', ')}"`,
    w.joinedAt,
    w.status,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, 'workers.csv');
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportAllData(projects: Project[], workers: Worker[]) {
  const data = {
    exportedAt: new Date().toISOString(),
    projects,
    workers,
  };
  exportToJSON(data, 'workledger-export');
}