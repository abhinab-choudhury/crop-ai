import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from 'react-router';
import type { Route } from './+types/root';
import './index.css';
import Header from './components/header';
import Footer from './components/ui/footer';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/sonner';
import { useEffect, useState } from 'react';
import { Toaster as HotToaster } from 'react-hot-toast'; // Import the new Toaster

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check system preference or saved theme
    const savedTheme = localStorage.getItem('vite-ui-theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (systemPrefersDark) {
      setTheme('dark');
    }
  }, []);

  return (
    <html lang="en" className={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="CropAI - Empowering farmers with AI-powered insights for better yields and sustainable agriculture"
        />
        <link rel="icon" type="image/svg+xml" href="/leaf-icon.svg" />
        <Meta />
        <Links />
      </head>
      <body className="transition-colors duration-300 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange={false}
      storageKey="vite-ui-theme"
      enableSystem
    >
      <div className="flex flex-col min-h-screen">
        {/* Animated background elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        </div>

        {/* Header */}
        <Header />

        {/* Main Content with enhanced route animations */}
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="flex-grow relative z-0"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>

        {/* Footer */}
        <Footer />
      </div>

      {/* Toast Notifications - Both for sonner and react-hot-toast */}
      <Toaster
        richColors
        position="top-right"
        theme="light"
        expand={true}
        visibleToasts={3}
        closeButton
      />

      {/* Additional Toaster for react-hot-toast (used in footer) */}
      <HotToaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
          },
          success: {
            iconTheme: {
              primary: '#16a34a',
              secondary: '#f0fdf4',
            },
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
            },
            iconTheme: {
              primary: '#dc2626',
              secondary: '#fef2f2',
            },
          },
        }}
      />
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
        >
          <div className="text-6xl mb-4">🌱</div>
        </motion.div>
        <h1 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">{message}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{details}</p>
        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Return Home
        </motion.a>
        {stack && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
            <pre className="w-full p-4 overflow-x-auto bg-gray-100 dark:bg-gray-700 rounded-lg mt-2 text-xs">
              <code>{stack}</code>
            </pre>
          </details>
        )}
      </motion.div>
    </main>
  );
}
