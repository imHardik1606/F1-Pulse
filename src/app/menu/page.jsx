"use client";
import Link from 'next/link';
import React from 'react';

export default function MenuPage() {

  const menuItems = [
    { 
      id: 1, 
      title: 'Drivers', 
      description: 'All the endpoints related to the drivers.',
      icon: '🏎️',
      bgImage: 'https://images.unsplash.com/photo-1504620776737-8965fde5c079?q=80&w=873&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&q=80',
    },
    { 
      id: 2, 
      title: 'Seasons', 
      description: 'All the endpoints related to the seasons.',
      icon: '📅',
      bgImage: 'https://imgs.search.brave.com/ZY-3n7lxDNN4x1nrZZTYGKM6dEGHusjWXXGFWQwAH7g/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/dGhlbWFudWFsLmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvc2l0/ZXMvOS8yMDI1LzEx/L0xvdWlzLVZ1aXR0/b24tRjEtMjAyNS1M/YXMtVmVnYXMtR3Jh/bmQtUHJpeC1Ucm9w/aHktVHJ1bmsuanBn/P3Jlc2l6ZT0xMjAw/LDcyMCZwPTE?auto=format&fit=crop&q=80',
    },
    { 
      id: 3, 
      title: 'Standings', 
      description: 'All the endpoints related to the standings.',
      icon: '🏆',
      bgImage: 'https://imgs.search.brave.com/Zoi_MT3_irxbqNTRtwKZPJRIuyS2d5TQlyH-rYoeHR4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjE1/ODg2MTMzNS9waG90/by9iYXJjZWxvbmEt/c3BhaW4tYS1nZW5l/cmFsLXZpZXctb2Yt/dGhlLXBvZGl1bS1h/cy1yYWNlLXdpbm5l/ci1tYXgtdmVyc3Rh/cHBlbi1vZi10aGUt/bmV0aGVybGFuZHMu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PUpzdGpGamEwa19H/c2t4aVFMVi1hcjM3/c0kwdkZoQk5MQlBv/OVhUcmQxM0U9?auto=format&fit=crop&q=80',
    },
    { 
      id: 4, 
      title: 'Races', 
      description: 'All the endpoints related to the races data.',
      icon: '🏁',
      bgImage: 'https://imgs.search.brave.com/fOQ_9dyEB7MHRIgdKtMlOJFSH5MTYecqwIv7BVexdIk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9lMC4z/NjVkbS5jb20vMjUv/MDYvNzY4eDQzMi9z/a3lzcG9ydHMtZjEt/Y2FuYWRpYW4tZ3Bf/Njk0NDI4NS5qcGc_/MjAyNTA2MTcxMzA4/MjE?auto=format&fit=crop&q=80',
    },
    { 
      id: 5, 
      title: 'Teams', 
      description: 'All the endpoints related to the teams.',
      icon: '👥',
      bgImage: 'https://imgs.search.brave.com/fICa7jU2kUpgrLtUYJbfYbJ8Y56vG0XBK_hHf6lFwxI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzJkLzdj/LzhmLzJkN2M4ZmNh/YTM5ZTIxNmQxMTY5/NDRmMTc2ZWQ3MjMw/LmpwZw?auto=format&fit=crop&q=80',
    },
    { 
      id: 6, 
      title: 'Results', 
      description: 'All the endpoints related to the race results.',
      icon: '📊',
      bgImage: 'https://imgs.search.brave.com/ZcbbFkgmUgcuGJ6jXHzlKuQ7wBLRNm0Okp40EjYwPK8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/Zm9ybXVsYW9uZWhp/c3RvcnkuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDI1LzEw/L0xhbmRvLU5vcnJp/cy0yMDI1LU1leGlj/by1DaXR5LUdQLVdp/bm5lci03MjB4NDUw/LndlYnA?auto=format&fit=crop&q=80',
    },
    { 
      id: 7, 
      title: 'Circuits', 
      description: 'All the endpoints related to the circuits.',
      icon: '📍',
      bgImage: 'https://imgs.search.brave.com/MKVRX8G--0ntyINX4noNRQIKjLdqxkq6okhhdwoAcqU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODErKzRwR0c4R0wu/anBn?auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-racing" style={{ color: 'rgb(220, 38, 38)' }}>
          Formula 1 API
        </h1>
        <p className="text-gray-300 text-lg font-orbitron">Explore all F1 data endpoints</p>
      </header>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {menuItems.map((item, index) => (
            <Link href={`/${item.title.toLowerCase()}`} key={item.id} className="no-underline">
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 animate-slide-in"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both',
                animationDuration: '0.8s',
              }}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.9)), url(${item.bgImage})`,
                }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-70"></div>
                {/* Red gradient overlay on hover */}
                <div className="absolute inset-0 bg-linear-to-br from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 md:p-8 h-64 flex flex-col justify-between">
                {/* Top section with icon */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{item.icon}</span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors duration-300 font-orbitron">
                    {item.title}
                  </h2>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm md:text-base mb-6 group-hover:text-gray-200 transition-colors duration-300 font-racing">
                  {item.description}
                </p>

                {/* Hover indicator */}
                {/* <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary/80 group-hover:text-primary transition-colors duration-300">
                    Click to explore →
                  </span>
                  <div className="w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center group-hover:bg-primary/10 transition-all duration-300">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div> */}
              </div>

              {/* Shine effect on hover */}
              <div className="absolute top-0 -left-full w-1/2 h-full bg-linear-to-r from-transparent via-white/10 to-transparent group-hover:left-full transition-all duration-1000"></div>
            </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} F1 API Dashboard • All data is fetched from official sources</p>
      </footer>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in {
          animation-name: slide-in;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Custom primary color utility */
        .bg-primary {
          background-color: rgb(220 38 38 / var(--tw-bg-opacity));
        }
        
        .text-primary {
          color: rgb(220 38 38 / var(--tw-text-opacity));
        }
        
        .border-primary {
          border-color: rgb(220 38 38 / var(--tw-border-opacity));
        }
      `}</style>
    </div>
  );
};