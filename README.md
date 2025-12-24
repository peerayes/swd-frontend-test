# SWD Frontend Test

This project is a frontend assessment built with **Next.js**, **React**, and **TypeScript**. It demonstrates a Single Page Application (SPA) with advanced layout manipulation, state management, and internationalization.

## ✨ Features

### 1. Auto Layout & Shape Manipulation (`/move-shape`)

A demonstration of layout control and CSS manipulation.

- **Move Shape**: Controls to move shapes between lists.
- **Move Position**: Shift shapes to different positions.
- **Random Position**: Randomly shuffle shape positions.
- **Styling**: utilizes SCSS modules for layout styles.

### 2. Person Management (`/person-management`)

A full CRUD (Create, Read, Update, Delete) application for managing person records.

- **Data Persistence**: Uses `localStorage` to persist data across reloads.
- **State Management**: Powered by **Redux Toolkit** for predictable state updates.
- **Form Handling**: Built with Ant Design forms.
- **Table View**: Data display with pagination and selection support.

### 3. Internationalization (i18n)

Full support for multi-language switching.

- **Languages**: English and Thai (TH).
- **Library**: `react-i18next`.
- **Persistent Locale**: Remembers user language preference.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Library**: [React 18](https://react.dev/)
- **Database**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Ant Design](https://ant.design/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## 🚀 Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── move-shape/       # Shape manipulation feature
│   ├── person-management/# CRUD feature
│   └── page.tsx          # Landing page
├── components/           # Reusable UI components
├── store/                # Redux store slice definitions
├── locales/              # i18n translation JSON files
├── styles/               # Global styles and variables
└── utils/                # Helper functions
```

## 📝 Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm start`: Start production server
- `pnpm lint`: Run ESLint
