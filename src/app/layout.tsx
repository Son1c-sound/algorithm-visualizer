import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Algorithm Visualizer",
  description: "Interactive visualizations for common algorithms",
};

const algorithms = [
  { name: "Contains Duplicate", path: "/contains-duplicate" },
  // Add more algorithms here as you solve them
  // { name: "Two Sum", path: "/two-sum" },
  // { name: "Valid Anagram", path: "/valid-anagram" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900 text-white min-h-screen`}
      >
        <nav className="sticky top-0 z-10 bg-slate-800 border-b border-slate-700 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {algorithms.map((algo) => (
                    <Link
                      key={algo.path}
                      href={algo.path}
                      className="border-transparent text-gray-300 hover:border-violet-400 hover:text-violet-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                    >
                      {algo.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="sm:hidden flex items-center">
                <details className="dropdown dropdown-end">
                  <summary className="m-1 btn btn-ghost text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                  </summary>
                  <div className="dropdown-content z-10 menu p-2 shadow rounded-box w-52 bg-slate-800 mt-4">
                    {algorithms.map((algo) => (
                      <Link
                        key={algo.path}
                        href={algo.path}
                        className="px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-violet-400 rounded-md"
                      >
                        {algo.name}
                      </Link>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        
        <footer className="bg-slate-800 border-t border-slate-700 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-400 text-sm">
              Algorithm Visualizer Project - {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}