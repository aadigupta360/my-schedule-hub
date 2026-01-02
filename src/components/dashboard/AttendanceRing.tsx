import { useAttendance } from '@/hooks/useAttendance';
import { AlertTriangle, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AttendanceRing() {
  const { getAttendanceStats } = useAttendance();
  const stats = getAttendanceStats();

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (stats.percentage / 100) * circumference;

  const isLow = stats.percentage < 75;
  const isGood = stats.percentage >= 85;

  return (
    <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Overall Attendance</h3>
        {isLow && <AlertTriangle className="w-4 h-4 text-destructive ml-auto" />}
      </div>
      
      <div className="flex items-center gap-6">
        {/* Ring */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg className="w-28 h-28 transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted/50"
            />
            <circle
              cx="56"
              cy="56"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className="transition-all duration-1000 drop-shadow-lg"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
                filter: isLow ? 'none' : 'drop-shadow(0 0 8px hsl(var(--primary) / 0.5))',
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={isLow ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'} />
                <stop offset="100%" stopColor={isLow ? 'hsl(var(--destructive))' : 'hsl(var(--secondary))'} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn(
              'text-3xl font-bold',
              isLow ? 'text-destructive' : 'gradient-text'
            )}>
              {stats.percentage}%
            </span>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex-1 space-y-3">
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
          <div className="pt-2 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-bold text-foreground">{stats.total}</span>
            </div>
          </div>
        </div>
      </div>

      {isLow && (
        <div className="mt-4 p-3 bg-destructive/10 rounded-xl flex items-center gap-2 border border-destructive/20">
          <TrendingDown className="w-4 h-4 text-destructive flex-shrink-0" />
          <span className="text-destructive text-sm font-medium">
            Attendance below 75%! Attend more classes.
          </span>
        </div>
      )}

      {isGood && stats.total > 0 && (
        <div className="mt-4 p-3 bg-success/10 rounded-xl flex items-center gap-2 border border-success/20">
          <TrendingUp className="w-4 h-4 text-success flex-shrink-0" />
          <span className="text-success text-sm font-medium">
            Great attendance! Keep it up! 🎉
          </span>
        </div>
      )}
    </div>
  );
}
