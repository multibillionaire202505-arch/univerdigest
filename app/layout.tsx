export const metadata = {
  title: "UniverDigest",
  description: "The world of nutrition – global meals, grocery lists, and more",
};
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
          <nav className="mx-auto max-w-5xl flex items-center gap-4 p-4">
            <a href="/" className="font-semibold text-lg">UniverDigest</a>
            <div className="ml-auto flex gap-4 text-sm">
              <a href="/meal-planner" className="hover:underline">Meal Planner</a>
              <a href="/about" className="hover:underline">About</a>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl p-4 md:p-8">{children}</main>
        <footer className="border-t text-xs text-slate-500 py-6 text-center">© {new Date().getFullYear()} UniverDigest</footer>
      </body>
    </html>
  );
}
