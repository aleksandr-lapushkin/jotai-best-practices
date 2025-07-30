# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Jotai Best Practices** educational website built with React, TypeScript, and Vite. The site demonstrates best practices for using Jotai state management library through interactive examples and detailed explanations.

## Development Commands

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production (runs TypeScript compilation then Vite build)
- `pnpm lint` - Run ESLint with auto-fix
- `pnpm preview` - Preview production build locally

## Architecture

### Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **State Management**: Jotai with Jotai DevTools enabled
- **Routing**: TanStack Router with file-based routing and auto-code splitting
- **Styling**: Tailwind CSS v4 with Radix UI components
- **UI Components**: shadcn/ui component library

### Project Structure

The codebase follows a domain-driven structure organized around educational content:

```
src/
├── routes/                 # File-based routing structure
│   ├── concepts/          # Core Jotai concepts (declaring atoms, effects, etc.)
│   ├── examples/          # Interactive code examples
│   ├── utilities/         # Jotai utility functions
│   ├── advanced/          # Advanced patterns (async, testing)
│   └── overview/          # Getting started content
├── components/
│   ├── ui/               # Reusable UI components (shadcn/ui)
│   ├── app-sidebar.tsx   # Main navigation sidebar
│   └── dynamic-breadcrumb.tsx # Route-based breadcrumbs
└── lib/utils.ts          # Utility functions
```

### Key Architectural Patterns

1. **File-based Routing**: Uses TanStack Router with automatic route generation from file structure
2. **Global Jotai Store**: Single store instance created in `__root.tsx` with DevTools integration
3. **Component-Based Architecture**: Each route is a self-contained React component with educational content
4. **Theme System**: Dark/light mode toggle with system preference detection

### State Management Setup

- Jotai store is initialized in `src/routes/__root.tsx:16`
- DevTools are enabled in development for debugging state
- Babel preset configured for Jotai optimizations in `vite.config.ts:16`

### UI Components

The project uses shadcn/ui components with:
- `CodeBlock` component for syntax-highlighted code examples
- `SectionCard` for consistent content layout
- Theme provider for dark/light mode switching
- Responsive sidebar navigation

### Development Notes

- All educational content is written as TSX files in the routes directory
- Code examples are embedded as strings in `CodeBlock` components
- The site structure mirrors Jotai learning progression from basic to advanced concepts
- Components follow the established shadcn/ui patterns and styling conventions