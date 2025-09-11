import { Link } from 'react-router';

export default function Index() {
  return (
    <section className="min-h-svh flex items-center justify-center bg-white dark:bg-black">
      <div className="max-w-2xl mx-auto text-center px-6 font-[Poppins]">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">Crop AI 🌱</h1>

        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          A cross-compatible <span className="font-bold">React Native app</span> for farmers —
          powered by AI.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/docs"
            className="px-5 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium"
          >
            Docs
          </Link>
          <a
            href="https://github.com/abhinab-choudhury/crop-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium"
          >
            GitHub
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="font-medium">📱 Cross-Compatible</p>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Android, iOS & Web</p>
          </div>

          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="font-medium">🤖 AI-Powered</p>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Crop disease detection</p>
          </div>

          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="font-medium">🌍 Farmer-Friendly</p>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Offline-first support</p>
          </div>
        </div>
      </div>
    </section>
  );
}
