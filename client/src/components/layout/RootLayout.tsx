import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { Footer } from './Footer';

export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
