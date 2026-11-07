
import "./globals.css";
import { DemoAuthProvider } from "@/lib/demo-auth-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <DemoAuthProvider>{children}</DemoAuthProvider>
      </body>
    </html>
  );
}
