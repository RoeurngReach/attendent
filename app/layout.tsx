import { Kantumruy_Pro } from 'next/font/google';
import './globals.css';

const kantumruy = Kantumruy_Pro({
  subsets: ['khmer', 'latin'],
  variable: '--font-kantumruy',
  weight: ['100', '200', '300', '400', '500', '600', '700'],
});

export const metadata = {
  title: 'SecureAttend - HR & Payroll',
  description: 'Multi-tenant employee attendance and HR/payroll system with Khmer UI.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={kantumruy.variable} style={{ height: '100%', margin: 0 }}>
      <body className="font-sans antialiased text-white selection:bg-indigo-500/30" style={{ margin: 0, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'linear-gradient(135deg, #0F0C29 0%, #302b63 50%, #24243e 100%)' }}>
          {children}
      </body>
    </html>
  );
}
