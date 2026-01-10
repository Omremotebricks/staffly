import "./globals.css";
import { AuthProvider } from "./lib/auth";
import { Toaster } from "sonner";
import { ConfirmationProvider } from "./components/ConfirmationContext";
import { ToastProvider } from "./components/ToastContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <ConfirmationProvider>
              {children}
              <Toaster position="top-right" richColors />
            </ConfirmationProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
