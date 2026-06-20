import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Siddhartha Dhakal — Frontend Web Developer | The Museum",
  description:
    "The Museum of Siddhartha Dhakal — a 3D portfolio by a frontend web developer in Kathmandu. Explore selected work in Blazor, React and Flutter.",
  openGraph: {
    title: "Siddhartha Dhakal — Frontend Web Developer | The Museum",
    description:
      "Step inside a 3D museum of interfaces, experiments and code by Siddhartha Dhakal, frontend developer.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Siddhartha Dhakal — Frontend Web Developer | The Museum",
    description:
      "Step inside a 3D museum of interfaces, experiments and code by Siddhartha Dhakal, frontend developer.",
  },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Siddhartha Dhakal',
  jobTitle: 'Frontend Web Developer',
  email: 'siddharthadhakal0@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kathmandu',
    addressCountry: 'NP',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Texas College of Management and IT',
  },
  worksFor: {
    '@type': 'Organization',
    name: 'The High Innovations',
  },
  sameAs: [
    'https://www.linkedin.com/in/siddhartha-dhakal-778003261',
    'https://github.com/SiddharthaDhakalO',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
