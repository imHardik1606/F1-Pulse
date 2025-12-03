// app/layout.jsx
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'F1 Pulse - Modern F1 Analytics',
  description: 'Experience Formula 1 like never before with real-time analytics and stunning visualizations',
   icons: {
    icon: '/assets/f1-favicon.ico', // You can use .png or .svg as well
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}