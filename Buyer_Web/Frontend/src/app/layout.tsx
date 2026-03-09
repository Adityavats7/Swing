import "./globals.css";

export const metadata = {
  title: "Buyer Web",
  description: "Quick commerce buyer app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>

  );
}