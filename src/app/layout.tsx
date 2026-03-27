import type { Metadata } from "next";
// Import Poppins from Google Fonts
import { Poppins } from "next/font/google";
import "./globals.css";

// 1. Define and load the Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: "--font-poppins", // Define a new CSS variable for Poppins
});

// Since you are replacing the Geist fonts, you can remove or comment out these imports
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Judel Bagisan - Portfolio",
  description: "Graphic Designer with Web Development Experience — building visuals that don't just look good, but function with purpose.",
  openGraph: {
    title: "Judel Bagisan - Portfolio",
    description: "Graphic Designer with Web Development Experience",
    url: "judelbagisan.dev", // Feel free to update this later
    siteName: "Judel Bagisan Portfolio",
    images: [
      {
        url: "/images/portfolio-open-graph.png", // Ensure you save the attached image as "og-image.png" in the "public/images" folder
        width: 1200,
        height: 630,
        alt: "Judel Bagisan - Portfolio Open Graph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Add the Poppins font variable to the <html> tag
    <html lang="en" className={`${poppins.variable}`}>
      <body
        // 2. Replace Geist variables with the Poppins variable
        // 3. Add the Tailwind class for your gradient background
        className={`font-poppins bg-customdarkgrey-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}