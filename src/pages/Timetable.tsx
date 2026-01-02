import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSubjects } from '@/hooks/useSubjects';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
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

  const isToday = selectedDay === new Date().getDay();

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold gradient-text">Timetable</h1>
        </div>

        {/* Day Selector */}
        <div className="glass-card p-3">
          <div className="flex items-center gap-2 justify-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={goToPrevDay}
              className="rounded-xl hover:bg-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex gap-1 overflow-x-auto py-1 px-1 flex-1 justify-center">
              {SHORT_DAYS.map((day, index) => (
                <Button
                  key={day}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'min-w-[2.75rem] rounded-xl transition-all',
                    selectedDay === index 
                      ? 'bg-primary text-primary-foreground shadow-lg glow-sm' 
                      : 'hover:bg-white/10'
                  )}
                  onClick={() => setSelectedDay(index)}
                >
                  {day}
                </Button>
              ))}
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={goToNextDay}
              className="rounded-xl hover:bg-white/10"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">
            {DAYS[selectedDay]}
          </h2>
          {isToday && (
            <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full font-medium">
              Today
            </span>
          )}
        </div>

        {/* Classes List */}
        <div className="space-y-3">
          {loading ? (
            <div className="glass-card p-8 text-center text-muted-foreground">
              <div className="animate-pulse">Loading...</div>
            </div>
          ) : daySubjects.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No classes on {DAYS[selectedDay]}</p>
              <p className="text-sm text-muted-foreground/60 mt-1">Enjoy your free day! 🎉</p>
            </div>
          ) : (
            daySubjects.map((subject, index) => (
              <div
                key={subject.id}
                className="glass-card p-4 animate-slide-up"
                style={{ 
                  animationDelay: `${index * 0.05}s`,
                  borderLeftWidth: '4px',
                  borderLeftColor: subject.color,
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{subject.name}</h3>
                      {subject.short_name && (
                        <span className="text-xs text-muted-foreground bg-white/10 px-2 py-0.5 rounded-full">
                          {subject.short_name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {subject.start_time.slice(0, 5)} - {subject.end_time.slice(0, 5)}
                      </span>
                      {subject.room && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {subject.room}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full ring-2 ring-white/20"
                    style={{ backgroundColor: subject.color }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
