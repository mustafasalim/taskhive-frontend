# Taskhive Frontend

A modern task management application built with React, TypeScript, and Vite.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd Taskhive-frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

```bash
cp .env-example .env
```

Fill in the required environment variables in the `.env` file:

- `VITE_API_URL`: Backend API URL
- `VITE_LIVEKIT_URL`: LiveKit server URL for real-time features

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

## 🛠️ Tech Stack

- **Framework:** React
- **Build Tool:** Vite
- **Language:** TypeScript
- **State Management:** React Query
- **Styling:** Tailwind CSS
- **Real-time Features:** LiveKit
- **UI Components:** Shadcn UI

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Application pages/routes
├── services/      # API service functions
├── queries/       # React Query hooks
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
└── types/         # TypeScript type definitions
```

## 🔑 Features

- User Authentication
- Workspace Management
- Task Creation and Management
- Real-time Collaboration
- Team Member Management
- Issue Tracking
- Status Management
