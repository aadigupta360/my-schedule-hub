import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSubjects } from '@/hooks/useSubjects';
import { useAttendance } from '@/hooks/useAttendance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, X, Ban, Clock, MapPin, CalendarIcon } from 'lucide-react';
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
          <h1 className="text-2xl font-bold text-foreground">Mark Attendance</h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="w-4 h-4" />
                {isToday ? 'Today' : format(selectedDate, 'MMM d')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
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

        <Card className="border-0 shadow-lg bg-gradient-to-r from-secondary/10 to-primary/10">
          <CardContent className="py-4 text-center">
            <p className="text-lg font-semibold text-foreground">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </p>
            <p className="text-sm text-muted-foreground">
              {dayClasses.length} class{dayClasses.length !== 1 ? 'es' : ''} scheduled
            </p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {dayClasses.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-8 text-center text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No classes on this day</p>
              </CardContent>
            </Card>
          ) : (
            dayClasses.map((subject) => {
              const status = getStatus(subject.id);

              return (
                <Card
                  key={subject.id}
                  className={cn(
                    'border-0 shadow-lg transition-all',
                    status === 'present' && 'ring-2 ring-success/50',
                    status === 'absent' && 'ring-2 ring-destructive/50',
                    status === 'cancelled' && 'opacity-60'
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-1 h-full min-h-[60px] rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {subject.name}
                        </h3>
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

                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant={status === 'present' ? 'default' : 'outline'}
                            className={cn(
                              'flex-1',
                              status === 'present' && 'bg-success hover:bg-success/90'
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
                              'flex-1',
                              status === 'absent' && 'bg-destructive hover:bg-destructive/90'
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
                              'flex-1',
                              status === 'cancelled' && 'bg-muted-foreground hover:bg-muted-foreground/90'
                            )}
                            onClick={() => markAttendance(subject.id, dateStr, 'cancelled')}
                          >
                            <Ban className="w-4 h-4 mr-1" />
                            Cancelled
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
}
