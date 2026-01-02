import { useSubjects } from '@/hooks/useSubjects';
import { useAttendance } from '@/hooks/useAttendance';
import { Button } from '@/components/ui/button';
import { Check, X, Ban, Clock, MapPin, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function TodaysClasses() {
  const { subjects } = useSubjects();
  const { records, markAttendance } = useAttendance();
  
  const today = new Date();
  const dayOfWeek = today.getDay();
  const todayStr = format(today, 'yyyy-MM-dd');

  const todaysClasses = subjects.filter(s => {
    if (s.is_extra) {
      return s.extra_date === todayStr;
    }
    return s.day_of_week === dayOfWeek;
  }).sort((a, b) => a.start_time.localeCompare(b.start_time));

  const getStatus = (subjectId: string) => {
    const record = records.find(r => r.subject_id === subjectId && r.date === todayStr);
    return record?.status;
  };

  const currentTime = format(today, 'HH:mm:ss');

  if (todaysClasses.length === 0) {
    return (
      <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Today's Classes</h3>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No classes today!</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Enjoy your day off 🎉</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-foreground">Today's Classes</h3>
        <span className="ml-auto text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
          {todaysClasses.length} classes
        </span>
      </div>
      
      <div className="space-y-3">
        {todaysClasses.map((subject, index) => {
          const status = getStatus(subject.id);
          const isOngoing = currentTime >= subject.start_time && currentTime <= subject.end_time;
          const isPast = currentTime > subject.end_time;

          return (
            <div
              key={subject.id}
              className={cn(
                'p-4 rounded-xl bg-white/5 border border-white/10 transition-all animate-fade-in',
                isOngoing && 'ring-2 ring-primary/50 bg-primary/5 glow-sm',
                isPast && !status && 'opacity-50'
              )}
              style={{ 
                animationDelay: `${0.1 * (index + 1)}s`,
                borderLeftWidth: '4px',
                borderLeftColor: subject.color,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground truncate">{subject.name}</h4>
                    {isOngoing && (
                      <span className="text-[10px] uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold animate-pulse">
                        Live
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {subject.start_time.slice(0, 5)} - {subject.end_time.slice(0, 5)}
                    </span>
                    {subject.room && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {subject.room}
                      </span>
                    )}
                  </div>
                </div>

                {status ? (
                  <div className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-semibold',
                    status === 'present' && 'bg-success/20 text-success',
                    status === 'absent' && 'bg-destructive/20 text-destructive',
                    status === 'cancelled' && 'bg-muted/50 text-muted-foreground'
                  )}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                ) : (
                  <div className="flex gap-1.5">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-xl text-success hover:bg-success/20 hover:text-success"
                      onClick={() => markAttendance(subject.id, todayStr, 'present')}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/20 hover:text-destructive"
                      onClick={() => markAttendance(subject.id, todayStr, 'absent')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-muted/50"
                      onClick={() => markAttendance(subject.id, todayStr, 'cancelled')}
                    >
                      <Ban className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
