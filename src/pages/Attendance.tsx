import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSubjects } from '@/hooks/useSubjects';
import { useAttendance } from '@/hooks/useAttendance';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, X, Ban, Clock, MapPin, CalendarIcon, ClipboardCheck } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Attendance() {
  const { subjects } = useSubjects();
  const { records, markAttendance } = useAttendance();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayOfWeek = selectedDate.getDay();

  const dayClasses = subjects.filter(s => {
    if (s.is_extra) {
      return s.extra_date === dateStr;
    }
    return s.day_of_week === dayOfWeek;
  }).sort((a, b) => a.start_time.localeCompare(b.start_time));

  const getStatus = (subjectId: string) => {
    const record = records.find(r => r.subject_id === subjectId && r.date === dateStr);
    return record?.status;
  };

  const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold gradient-text">Mark Attendance</h1>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="gap-2 rounded-xl bg-white/5 border-white/10 hover:bg-white/10"
              >
                <CalendarIcon className="w-4 h-4" />
                {isToday ? 'Today' : format(selectedDate, 'MMM d')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 glass-card" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="glass-card p-4 text-center bg-gradient-to-r from-primary/10 to-secondary/10">
          <p className="text-lg font-semibold text-foreground">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {dayClasses.length} class{dayClasses.length !== 1 ? 'es' : ''} scheduled
          </p>
        </div>

        <div className="space-y-3">
          {dayClasses.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No classes on this day</p>
            </div>
          ) : (
            dayClasses.map((subject, index) => {
              const status = getStatus(subject.id);

              return (
                <div
                  key={subject.id}
                  className={cn(
                    'glass-card p-4 transition-all animate-slide-up',
                    status === 'present' && 'ring-2 ring-success/50',
                    status === 'absent' && 'ring-2 ring-destructive/50',
                    status === 'cancelled' && 'opacity-60'
                  )}
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    borderLeftWidth: '4px',
                    borderLeftColor: subject.color,
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {subject.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
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
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={status === 'present' ? 'default' : 'outline'}
                        className={cn(
                          'flex-1 rounded-xl',
                          status === 'present' 
                            ? 'bg-success hover:bg-success/90 border-success' 
                            : 'bg-white/5 border-white/10 hover:bg-success/20 hover:text-success hover:border-success/50'
                        )}
                        onClick={() => markAttendance(subject.id, dateStr, 'present')}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant={status === 'absent' ? 'default' : 'outline'}
                        className={cn(
                          'flex-1 rounded-xl',
                          status === 'absent' 
                            ? 'bg-destructive hover:bg-destructive/90 border-destructive' 
                            : 'bg-white/5 border-white/10 hover:bg-destructive/20 hover:text-destructive hover:border-destructive/50'
                        )}
                        onClick={() => markAttendance(subject.id, dateStr, 'absent')}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Absent
                      </Button>
                      <Button
                        size="sm"
                        variant={status === 'cancelled' ? 'default' : 'outline'}
                        className={cn(
                          'flex-1 rounded-xl',
                          status === 'cancelled' 
                            ? 'bg-muted-foreground hover:bg-muted-foreground/90' 
                            : 'bg-white/5 border-white/10 hover:bg-muted/50'
                        )}
                        onClick={() => markAttendance(subject.id, dateStr, 'cancelled')}
                      >
                        <Ban className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
}
