import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/components/providers/QueryProvider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ScrollToTopButton } from '@/components/shared/ScrollToTop';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: {
        default: 'Echo Notes',
        template: '%s | Echo Notes',
    },
    description:
        'Echo Notes is a collaborative, real-time note-taking app designed for teams and individuals to write, edit, and share ideas effortlessly.',
    applicationName: 'Echo Notes',
    authors: [{ name: 'Your Name', url: 'https://yourwebsite.com' }],
    generator: 'Next.js',
    keywords: [
        'notes',
        'collaboration',
        'real-time editing',
        'Echo Notes',
        'markdown',
        'team productivity',
    ],
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange
                >
                    <QueryProvider>{children}</QueryProvider>
                    <ScrollToTopButton />
                </ThemeProvider>
            </body>
        </html>
    );
}
