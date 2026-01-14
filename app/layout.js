import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ background: 'none' }}>{children}</body>
    </html>
  );
}