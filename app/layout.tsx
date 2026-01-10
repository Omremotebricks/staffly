import "./globals.css";
import { AuthProvider } from "./lib/auth";
import { Toaster } from "sonner";
import { ConfirmationProvider } from "./components/ConfirmationContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ConfirmationProvider>
            {children}
            <Toaster position="top-right" richColors  />
          </ConfirmationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
