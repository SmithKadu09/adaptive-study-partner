import "./globals.css";

export const metadata = {
  title: "Adaptive Learning Partner",
  description: "AI-powered adaptive learning platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}