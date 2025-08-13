# EchoGrade React Frontend

A modern React.js frontend for the EchoGrade application, built with Vite, TypeScript, and Tailwind CSS.

## Features

- **Smart Feedback System**: AI-powered grading and feedback for mathematical proofs
- **Modern UI**: Built with Radix UI components and Tailwind CSS
- **Responsive Design**: Works seamlessly across all devices
- **TypeScript**: Full type safety and better development experience

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_ECHOGRADE_API_URL=http://localhost:8000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:9002](http://localhost:9002) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/            # UI component library
│   ├── echo-grade-client.tsx
│   └── score-display.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── config/             # Configuration files
├── app/                # Global styles and assets
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

## Environment Variables

- `VITE_ECHOGRADE_API_URL` - Backend API URL (default: http://localhost:8000)

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.
