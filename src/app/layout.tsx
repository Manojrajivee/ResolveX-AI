import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Runbook-Following Agent | Enterprise AI Incident Resolution',
  description: 'AI-Powered Intelligent Incident Resolution System for Enterprise DevOps & SRE Teams',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('runbook_agent_theme');
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased min-h-screen relative selection:bg-blue-500 selection:text-white transition-colors duration-300">
        <div className="ambient-bg-mesh">
          <div className="ambient-glow-1" />
          <div className="ambient-glow-2" />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
