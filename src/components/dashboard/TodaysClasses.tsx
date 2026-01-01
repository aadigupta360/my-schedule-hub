import { useSubjects } from '@/hooks/useSubjects';
import { useAttendance } from '@/hooks/useAttendance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Ban, Clock, MapPin } from 'lucide-react';
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
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Today's Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No classes scheduled for today!</p>
            <p className="text-sm mt-1">Enjoy your day off 🎉</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Today's Classes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {todaysClasses.map((subject) => {
          const status = getStatus(subject.id);
          const isOngoing = currentTime >= subject.start_time && currentTime <= subject.end_time;
          const isPast = currentTime > subject.end_time;

          return (
            <div
              key={subject.id}
              className={cn(
                'p-3 rounded-lg border-l-4 bg-card transition-all',
                isOngoing && 'ring-2 ring-primary/50 shadow-md',
                isPast && !status && 'opacity-60'
              )}
              style={{ borderLeftColor: subject.color }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{subject.name}</h3>
                    {isOngoing && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full animate-pulse-ring">
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {subject.start_time.slice(0, 5)} - {subject.end_time.slice(0, 5)}
                    </span>
                    {subject.room && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {subject.room}
                      </span>
                    )}
                  </div>
                </div>

                {status ? (
                  <div className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    status === 'present' && 'bg-success/10 text-success',
                    status === 'absent' && 'bg-destructive/10 text-destructive',
                    status === 'cancelled' && 'bg-muted text-muted-foreground'
                  )}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-success hover:bg-success/10 hover:text-success"
                      onClick={() => markAttendance(subject.id, todayStr, 'present')}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => markAttendance(subject.id, todayStr, 'absent')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:bg-muted"
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
      </CardContent>
    </Card>
  );
}
