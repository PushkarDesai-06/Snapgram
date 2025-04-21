# Snapgram - Social Media Platform

## Project Overview

Snapgram is a modern social media application designed to share moments through images and connect with friends. The platform offers a clean, intuitive interface with real-time interactions, allowing users to post images, engage with content through likes and saves, and maintain personal profiles.

## Description

Snapgram is built with a focus on performance and user experience. The application leverages the power of React for the frontend and Appwrite as the backend service, creating a seamless experience for users to share their stories through images. With responsive design at its core, Snapgram offers an optimal viewing experience across various devices from desktops to mobile phones.

## Key Features

- **User Authentication**

  - Secure signup and login functionality using email/password
  - Profile creation with customizable avatars
  - Session management and persistence

- **Post Management**

  - Create posts with images, captions, locations, and tags
  - Update and delete functionality for existing posts
  - Image optimization for faster loading

- **Social Interaction**

  - Like, save and Edit posts
  - View posts from other users
  - Real-time updates of interactions

- **User Interface**

  - Responsive design for various screen sizes
  - Intuitive navigation with sidebar
  - Dark mode aesthetic

- **Performance**
  - Optimized image loading and caching
  - Efficient data fetching with React Query
  - Minimal re-renders with optimized component structure

## Tech Stack

### Frontend

- **React**: Library for building the user interface
- **TypeScript**: For type-safe code
- **React Router**: For navigation and routing
- **TanStack Query (React Query)**: For efficient data fetching and caching
- **Zod**: For form validation
- **Tailwind CSS**: For styling with utility-first approach
- **Shadcn UI**: For reusable UI components

### Backend

- **Appwrite**: Backend-as-a-Service (BaaS) platform providing:
  - Authentication
  - Database
  - Storage
  - Serverless functions

### Tools & Utilities

- **Vite**: For fast development and optimized builds
- **React Hook Form**: For form state management
- **React Hot Toast**: For notifications

## Getting Started

### Prerequisites

- Node.js (v14.0 or higher)
- npm or yarn
- Appwrite account

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/snapgram.git
   cd snapgram
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Appwrite**

   - Create an Appwrite project
   - Set up collections for Users, Posts, and Saves with proper attributes and permissions
   - Create storage bucket for images

4. **Environment Configuration**

   - Create a `.env` file in the root directory with the following variables:

   ```
   VITE_APPWRITE_URL=your-appwrite-endpoint
   VITE_APPWRITE_PROJECT_ID=your-project-id
   VITE_APPWRITE_DATABASE_ID=your-database-id
   VITE_APPWRITE_STORAGE_ID=your-storage-id
   VITE_APPWRITE_USER_COLLECTION_ID=your-user-collection-id
   VITE_APPWRITE_POST_COLLECTION_ID=your-post-collection-id
   VITE_APPWRITE_SAVES_COLLECTION_ID=your-saves-collection-id
   ```

5. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Build for production**
   ```bash
   vite build
   ```

## Project Structure

```
snapgram/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── constants/      # Application constants
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and API integrations
│   ├── pages/          # Page components
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── .env                # Environment variables
├── package.json        # Project dependencies and scripts
└── vite.config.ts      # Vite configuration
```

## Database Schema

**Users Collection**

- `$id`: Unique identifier
- `name`: User's full name
- `username`: Unique username
- `email`: User's email address
- `imageUrl`: Profile image URL
- `accountId`: Reference to Appwrite account

**Posts Collection**

- `$id`: Unique identifier
- `creator`: Reference to user who created the post
- `caption`: Post description
- `imageUrl`: URL of the uploaded image
- `imageId`: ID of the image in storage
- `location`: Optional location tag
- `tags`: Array of hashtags
- `likes`: Array of user references who liked the post

**Saves Collection**

- `$id`: Unique identifier
- `user`: Reference to user who saved the post
- `post`: Reference to the saved post

## Future Enhancements

- Comment functionality for posts
- Direct messaging between users
- Explore page with trending content
- Follow/unfollow functionality
- Notifications system
- Video content support


## Acknowledgements

- [Appwrite](https://appwrite.io/) for providing the backend services
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React Query](https://tanstack.com/query/latest/) for data-fetching
- All open-source packages that made this project possible
