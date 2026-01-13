# WorkLedger Hub

A professional, modern Project Management and Team Analytics Dashboard built with React, TypeScript, and Tailwind CSS.

## Overview

WorkLedger Hub is a comprehensive SaaS application for managing projects, team members, salaries, and analytics. It features a clean, responsive UI with real-time data visualization and seamless user experience.

## Features

- **Dashboard** - Overview of key metrics and project status
- **Projects Management** - Create, track, and manage projects
- **Team Management** - Manage team members and track performance
- **Salary Management** - Handle salary information and payroll
- **Analytics** - Comprehensive analytics and reporting
- **Calendar Integration** - Integrated calendar for scheduling
- **Settings** - User and application preferences
- **Dark/Light Theme** - Full theme support for better accessibility
- **Responsive Design** - Works seamlessly on desktop and mobile

## Tech Stack

- **Frontend Framework**: React 18.3
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS + shadcn/ui components
- **Build Tool**: Vite 5.4
- **State Management**: React Context API + TanStack Query
- **Routing**: React Router DOM 6
- **Charts**: Recharts 2.15
- **Animations**: GSAP 3.14 + Lenis smooth scroll
- **Form Handling**: React Hook Form + Zod validation
- **UI Components**: Radix UI + Material-UI
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js v16+ 
- npm v8+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project-manager
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your configuration values

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Building for Production

Build the production bundle:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

The built files will be in the `dist/` directory, ready for deployment.

### Linting

Check code quality:
```bash
npm run lint
```

Fix linting issues automatically:
```bash
npm run lint:fix
```

### Type Checking

Run TypeScript type checking:
```bash
npm run type-check
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── layout/       # Layout components (AppLayout, Topbar)
│   └── ui/           # shadcn/ui component library
├── pages/            # Page components for each route
├── contexts/         # React Context providers
│   ├── AuthContext   # Authentication state
│   ├── DataContext   # Application data state
│   └── ThemeContext  # Theme management
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── types/            # TypeScript type definitions
├── utils/            # Helper functions
├── App.tsx           # Main application component
├── App.css           # Application styles
├── index.css         # Global styles & design tokens
└── main.tsx          # Application entry point
```

## Environment Variables

See `.env.example` for all available configuration options:

- `VITE_API_BASE_URL` - Backend API endpoint
- `VITE_ENV` - Environment (development/production)
- `VITE_THEME_DEFAULT` - Default theme (light/dark)
- `VITE_ANIMATIONS_ENABLED` - Enable/disable animations
- And more...

## Design System

The application uses a professional, modern design system with:

- **Color Palette**: Teal primary with slate and blue accents
- **Typography**: System fonts with consistent sizing
- **Spacing**: 4px base unit for consistent spacing
- **Border Radius**: 12px (0.75rem) standard
- **Shadows**: Layered shadows for depth
- **Animations**: Smooth transitions and micro-interactions

### Theme Colors

- **Primary**: Teal (#1F8B7E)
- **Secondary**: Slate (#F1F5F9)
- **Success**: Green (#22C55E)
- **Warning**: Amber (#F59E0B)
- **Destructive**: Red (#EF4444)
- **Info**: Blue (#3B82F6)

## Best Practices

### Code Organization
- Keep components small and focused
- Use TypeScript for type safety
- Organize imports logically
- Use meaningful variable and function names

### Performance
- Use React.memo for expensive components
- Implement code splitting with dynamic imports
- Optimize images and assets
- Use TanStack Query for data caching

### Accessibility
- Use semantic HTML
- Include proper ARIA labels
- Ensure keyboard navigation
- Maintain proper color contrast

### Styling
- Use Tailwind CSS utilities for consistency
- Avoid inline styles
- Use CSS variables for theming
- Maintain responsive breakpoints

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

The application is ready for deployment to any static hosting service:

1. Build for production: `npm run build`
2. Deploy the `dist/` directory to your hosting provider
3. Configure environment variables on your hosting platform
4. Ensure proper routing configuration for SPA

### Recommended Hosting
- Vercel
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps
- GitHub Pages

## Performance Metrics

- **Build Time**: ~23 seconds
- **Bundle Size**: ~1.5 MB (uncompressed), ~450 KB (gzipped)
- **Core Web Vitals**: Optimized for LCP, FID, CLS

## Troubleshooting

### Port Already in Use
If port 8080 is already in use, update `vite.config.ts`:
```typescript
server: {
  port: 3000, // or your preferred port
}
```

### Build Failures
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist/`
- Check Node.js version: `node --version` (should be v16+)

### Performance Issues
- Check browser DevTools for slow components
- Use React DevTools Profiler
- Analyze bundle with `npm run build -- --outDir report`

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "feat: add new feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request

## License

This project is proprietary and confidential.

## Support

For issues, questions, or suggestions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Built with ❤️ by WorkLedger Team**
