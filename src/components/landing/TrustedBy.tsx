import React from 'react';

export const TrustedBy: React.FC = () => {
  const partners = [
    { name: 'Microsoft Azure', label: 'AZURE' },
    { name: 'Google Cloud Platform', label: 'GCP' },
    { name: 'Amazon Web Services', label: 'AWS' },
    { name: 'Docker Sandbox', label: 'DOCKER' },
    { name: 'Kubernetes Cluster', label: 'K8S' },
    { name: 'GitHub Enterprise', label: 'GITHUB' },
  ];

  return (
    <div className="py-12 border-y border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Trusted by Enterprise DevOps & Site Reliability Engineering Teams
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center opacity-75 hover:opacity-100 transition-opacity">
          {partners.map((partner, idx) => (
            <div
              key={idx}
              className="px-4 py-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 font-extrabold text-sm tracking-wider font-mono hover:border-blue-500/50 hover:text-slate-900 dark:hover:text-white transition-colors shadow-2xs"
            >
              {partner.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
