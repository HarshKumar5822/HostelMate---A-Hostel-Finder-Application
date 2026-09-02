import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import MobileBottomNav from './MobileBottomNav';
import AIAssistant from '../ai/AIAssistant';
import Footer from './Footer';

export default function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-paper)]">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <AIAssistant />
    </div>
  );
}
