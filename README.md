# C3 Chat

## Description

This is a real-time chat application that allows users to chat with AI. It provides a seamless and interactive messaging experience.

## Features

- Real-time messaging
- User authentication
- (Add more features as applicable)

## Tech Stack

- **Frontend:**
  - Next.js
  - React
  - React Router
  - TypeScript
  - Tailwind CSS
  - Shadcn
- **Backend:**
  - Convex

## Project Structure

The project follows a standard Next.js application structure:

```
.
├── app/                  # Main Next.js application pages and layouts
├── components/           # Reusable UI components
├── convex/               # Convex backend functions (database schema, queries, mutations)
├── frontend/             # The react router frontend.
├── lib/                  # Utility functions and shared logic
├── public/               # Static assets (images, fonts, etc.)
├── .env.local            # Environment variables (for Convex, API keys, etc.)
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies and scripts
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

- **`app/`**: Contains the core application routes, pages, and layouts. Next.js 13+ App Router is used.
- **`components/`**: Houses reusable React components used throughout the application.
- **`convex/`**: Includes all backend logic managed by Convex. This typically contains:
  - `schema.ts`: Defines the database schema.
  - `*.ts` (e.g., `messages.ts`, `users.ts`): Contains Convex query and mutation functions.
- **`lib/`**: Holds shared utility functions, helper scripts, or any other code that doesn't fit into the other categories.
- **`public/`**: Stores static assets that are served directly by the web server (e.g., images, favicons).

## Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

Make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Clone the repository (if applicable):**

    ```bash
    git clone <your-repository-url>
    cd <project-directory>
    ```

2. **Install dependencies:**
    Using npm:

    ```bash
    npm install
    ```

### Environment Setup

This project uses Convex for its backend.

1. **Set up Convex:**

    Initialize Convex for your project. This will guide you through creating a new Convex project or linking to an existing one.

    ```bash
    npx convex dev
    ```

    This command will also create necessary Convex configuration files and potentially a `.env.local` file or update your existing one with your Convex deployment URL (e.g., `CONVEX_URL=https://<your-project-name>.convex.cloud`).

2. **Environment Variables:**
    Create a `.env.local` file in the root of your project if it wasn't created by `npx convex dev` or if you have other environment variables to add.
    It should contain your Convex deployment URL:

    ```env
    NEXT_PUBLIC_CONVEX_URL="https://<your-project-name>.convex.cloud"
    # Add any other environment variables here
    ```

    **Important:** The `npx convex dev` command watches your `convex/` directory and pushes changes to your Convex deployment. It also generates TypeScript files for your Convex functions into `convex/_generated/server.ts` and `convex/_generated/client.ts`, which are then used by your frontend. Keep this process running in a separate terminal while developing.

### Running the Development Server

1. **Start the Next.js development server and convex:**
    Using npm:

    ```bash
    npm run dev
    ```

This will typically start the application on `http://localhost:3000`. Open this URL in your browser to see the application.

## Usage

Upon launching the application, users can:

- Sign up or log in.
- Send and receive messages in real-time.
- (Describe other user interactions based on features)
