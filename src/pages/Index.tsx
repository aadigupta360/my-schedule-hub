import { AppLayout } from '@/components/layout/AppLayout';
import { ProfileCard } from '@/components/dashboard/ProfileCard';
import { AttendanceRing } from '@/components/dashboard/AttendanceRing';
import { TodaysClasses } from '@/components/dashboard/TodaysClasses';
import { format } from 'date-fns';

export default function Index() {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">{format(new Date(), 'EEEE, MMM d')}</p>
          </div>
        </div>

        <ProfileCard />
        <AttendanceRing />
        <TodaysClasses />
      </div>
    </AppLayout>
  );
}
