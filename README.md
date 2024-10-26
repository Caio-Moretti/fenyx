# FENYX

A minimalist, mobile-first workout tracking application focused on providing an efficient experience for logging and monitoring gym progress.

## Tech Stack

- Frontend:
  - Next.js 14.2.7 (App Router)
  - TypeScript
  - Tailwind CSS
  - Shadcn/UI
  - next-intl for i18n

- Backend:
  - Next.js Server Actions
  - Supabase

## Features

- 🔐 Authentication with email/password and Google SSO
- 🌍 Internationalization (PT-BR and EN)
- 💪 Workout program management
- 📱 Mobile-first workout tracking interface
- 📊 Progress tracking and history
- 🌙 Dark mode by default

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fenyx.git
```

2. Install dependencies:
```bash
cd fenyx
npm install
```

3. Copy the environment variables template:
```bash
cp .env.example .env.local
```

4. Update the environment variables with your Supabase credentials

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Development

### Project Structure

The project follows a feature-based structure with clear separation of concerns:

- `src/app`: Next.js 14 App Router pages and layouts
- `src/components`: Reusable React components
- `src/server`: Server-side logic and database operations
- `src/lib`: Shared utilities and configurations
- `src/types`: TypeScript type definitions

### Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

[MIT](https://choosealicense.com/licenses/mit/)