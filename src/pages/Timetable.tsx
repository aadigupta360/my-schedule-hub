import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSubjects } from '@/hooks/useSubjects';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Timetable() {
  const { subjects, loading } = useSubjects();
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

  const daySubjects = subjects
    .filter(s => !s.is_extra && s.day_of_week === selectedDay)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const goToPrevDay = () => setSelectedDay(d => (d === 0 ? 6 : d - 1));
  const goToNextDay = () => setSelectedDay(d => (d === 6 ? 0 : d + 1));

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Timetable</h1>

        {/* Day Selector */}
        <div className="flex items-center gap-2 justify-center">
          <Button variant="ghost" size="icon" onClick={goToPrevDay}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex gap-1 overflow-x-auto py-2 px-1">
            {SHORT_DAYS.map((day, index) => (
              <Button
                key={day}
                variant={selectedDay === index ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  'min-w-[3rem]',
                  selectedDay === index && 'shadow-md'
                )}
                onClick={() => setSelectedDay(index)}
              >
                {day}
              </Button>
            ))}
          </div>

          <Button variant="ghost" size="icon" onClick={goToNextDay}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <h2 className="text-lg font-semibold text-center text-muted-foreground">
          {DAYS[selectedDay]}
        </h2>

        {/* Classes List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : daySubjects.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-8 text-center text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No classes on {DAYS[selectedDay]}</p>
              </CardContent>
            </Card>
          ) : (
            daySubjects.map((subject, index) => (
              <Card
                key={subject.id}
                className="border-0 shadow-lg overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex">
                  <div 
                    className="w-2" 
                    style={{ backgroundColor: subject.color }}
                  />
                  <CardContent className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{subject.name}</h3>
                        {subject.short_name && (
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {subject.short_name}
                          </span>
                        )}
                      </div>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {subject.start_time.slice(0, 5)} - {subject.end_time.slice(0, 5)}
                      </span>
                      {subject.room && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {subject.room}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
