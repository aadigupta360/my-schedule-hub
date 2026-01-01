import { useAttendance } from '@/hooks/useAttendance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AttendanceRing() {
  const { getAttendanceStats } = useAttendance();
  const stats = getAttendanceStats();

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (stats.percentage / 100) * circumference;

  const isLow = stats.percentage < 75;
  const isGood = stats.percentage >= 85;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          Overall Attendance
          {isLow && <AlertTriangle className="w-4 h-4 text-destructive" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="45"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="56"
                cy="56"
                r="45"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                className={cn(
                  'transition-all duration-1000',
                  isLow ? 'text-destructive' : isGood ? 'text-success' : 'text-primary'
                )}
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn(
                'text-2xl font-bold',
                isLow ? 'text-destructive' : isGood ? 'text-success' : 'text-primary'
              )}>
                {stats.percentage}%
              </span>
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Present</span>
              <span className="font-semibold text-success">{stats.present}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Absent</span>
              <span className="font-semibold text-destructive">{stats.absent}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Cancelled</span>
              <span className="font-semibold text-muted-foreground">{stats.cancelled}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Classes</span>
                <span className="font-semibold">{stats.total}</span>
              </div>
            </div>
          </div>
        </div>

        {isLow && (
          <div className="mt-4 p-3 bg-destructive/10 rounded-lg flex items-center gap-2 text-sm">
            <TrendingDown className="w-4 h-4 text-destructive" />
            <span className="text-destructive font-medium">
              Warning: Your attendance is below 75%!
            </span>
          </div>
        )}

        {isGood && stats.total > 0 && (
          <div className="mt-4 p-3 bg-success/10 rounded-lg flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-success font-medium">
              Great job! Keep up the good attendance!
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
