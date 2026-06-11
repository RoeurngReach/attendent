import { Kantumruy_Pro } from 'next/font/google';
import './globals.css';

const kantumruy = Kantumruy_Pro({
  subsets: ['khmer', 'latin'],
  variable: '--font-kantumruy',
  weight: ['100', '200', '300', '400', '500', '600', '700'],
});

export const metadata = {
  title: 'SecureAttend',
  description: 'Multi-tenant employee attendance and HR/payroll system with Khmer UI.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${kantumruy.variable} h-full m-0`}>
      <body className="font-sans antialiased text-slate-800 bg-slate-50 selection:bg-indigo-500/30 h-full m-0 flex flex-col overflow-x-hidden">
          {children}
      </body>
    </html>
  );
}
