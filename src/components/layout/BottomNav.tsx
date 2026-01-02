import { NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, ClipboardCheck, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/timetable', icon: Calendar, label: 'Schedule' },
  { to: '/attendance', icon: ClipboardCheck, label: 'Mark' },
  { to: '/stats', icon: BarChart3, label: 'Stats' },
  { to: '/manage', icon: Settings, label: 'Manage' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 max-w-lg mx-auto">
      <div className="glass-card px-2 py-3">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-300',
                  isActive 
                    ? 'bg-primary/20 text-primary glow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                )}
              >
                <item.icon className={cn(
                  'w-5 h-5 mb-1 transition-transform',
                  isActive && 'scale-110'
                )} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
