import { Orbitron, Racing_Sans_One, Oxanium } from 'next/font/google';
import './globals.css';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-orbitron'
});

const racingSans = Racing_Sans_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-racing'
});

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["400", "700"], // choose weights you need
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
    <html lang="en" className={`${orbitron.variable} ${racingSans.variable} ${oxanium.className}`} suppressHydrationWarning>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}