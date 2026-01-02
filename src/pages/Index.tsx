import { AppLayout } from '@/components/layout/AppLayout';
import { ProfileCard } from '@/components/dashboard/ProfileCard';
import { AttendanceRing } from '@/components/dashboard/AttendanceRing';
import { TodaysClasses } from '@/components/dashboard/TodaysClasses';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';

export default function Index() {
  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Dashboard</h1>
            <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
              <CalendarDays className="w-4 h-4" />
              {format(new Date(), 'EEEE, MMM d')}
            </p>
          </div>
        </div>

        <ProfileCard />
        <AttendanceRing />
        <TodaysClasses />
      </div>
    </AppLayout>
  );
}
