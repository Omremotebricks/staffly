import "./globals.css";
import { AuthProvider } from "./lib/auth";
import { ToastProvider } from "./components/ToastContext";
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
            <ToastProvider>{children}</ToastProvider>
          </ConfirmationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
