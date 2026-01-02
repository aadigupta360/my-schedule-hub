import { AppLayout } from '@/components/layout/AppLayout';
import { useSubjects } from '@/hooks/useSubjects';
import { useAttendance } from '@/hooks/useAttendance';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, TrendingDown, BarChart3, Calculator, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Stats() {
  const { subjects } = useSubjects();
  const { getAttendanceStats } = useAttendance();

  const overallStats = getAttendanceStats();

  const subjectStats = subjects
    .filter(s => !s.is_extra)
    .reduce((acc, subject) => {
      const existing = acc.find(s => s.name === subject.name);
      if (!existing) {
        const stats = getAttendanceStats(subject.id);
        acc.push({
          id: subject.id,
          name: subject.name,
          color: subject.color,
          ...stats
        });
      }
      return acc;
    }, [] as Array<{ id: string; name: string; color: string; total: number; present: number; absent: number; cancelled: number; percentage: number }>);

  const exportData = () => {
    const csvContent = [
      ['Subject', 'Total Classes', 'Present', 'Absent', 'Cancelled', 'Percentage'],
      ...subjectStats.map(s => [s.name, s.total, s.present, s.absent, s.cancelled, `${s.percentage}%`]),
      [],
      ['Overall', overallStats.total, overallStats.present, overallStats.absent, overallStats.cancelled, `${overallStats.percentage}%`]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="space-y-5 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold gradient-text">Statistics</h1>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportData}
            className="rounded-xl bg-white/5 border-white/10 hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Overall Stats */}
        <div className="glass-card p-5 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Overall Performance</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <p className={cn(
                'text-4xl font-bold',
                overallStats.percentage < 75 ? 'text-destructive' : 'gradient-text'
              )}>
                {overallStats.percentage}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">Attendance Rate</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-4xl font-bold text-foreground">{overallStats.total}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Classes</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="text-center p-3 bg-success/10 rounded-xl border border-success/20">
              <p className="text-2xl font-bold text-success">{overallStats.present}</p>
              <p className="text-xs text-muted-foreground">Present</p>
            </div>
            <div className="text-center p-3 bg-destructive/10 rounded-xl border border-destructive/20">
              <p className="text-2xl font-bold text-destructive">{overallStats.absent}</p>
              <p className="text-xs text-muted-foreground">Absent</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-xl border border-white/10">
              <p className="text-2xl font-bold text-muted-foreground">{overallStats.cancelled}</p>
              <p className="text-xs text-muted-foreground">Cancelled</p>
            </div>
          </div>
        </div>

        {/* Subject-wise Stats */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Subject Breakdown</h3>
          
          <div className="space-y-4">
            {subjectStats.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No subjects added yet
              </p>
            ) : (
              subjectStats.map((subject, index) => (
                <div 
                  key={subject.id} 
                  className="space-y-2 animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full ring-2 ring-white/20"
                        style={{ backgroundColor: subject.color }}
                      />
                      <span className="font-medium text-sm truncate max-w-[140px]">
                        {subject.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {subject.percentage < 75 ? (
                        <TrendingDown className="w-4 h-4 text-destructive" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-success" />
                      )}
                      <span className={cn(
                        'text-sm font-bold',
                        subject.percentage < 75 ? 'text-destructive' : 'text-success'
                      )}>
                        {subject.percentage}%
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={subject.percentage}
                    className="h-2 bg-white/10"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Present: {subject.present}</span>
                    <span>Absent: {subject.absent}</span>
                    <span>Total: {subject.total}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bunking Calculator */}
        {overallStats.total > 0 && (
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-secondary" />
              <h3 className="font-semibold text-foreground">Bunking Calculator</h3>
            </div>
            
            {(() => {
              const canBunk = Math.floor((overallStats.present - (0.75 * overallStats.total)) / 0.75);
              const needToAttend = Math.ceil(((0.75 * overallStats.total) - overallStats.present) / 0.25);

              if (overallStats.percentage >= 75) {
                return (
                  <div className="text-center p-4 bg-success/10 rounded-xl border border-success/20">
                    <p className="text-3xl font-bold text-success">
                      {Math.max(0, canBunk)} classes
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      You can miss while staying above 75%
                    </p>
                  </div>
                );
              } else {
                return (
                  <div className="text-center p-4 bg-destructive/10 rounded-xl border border-destructive/20">
                    <p className="text-3xl font-bold text-destructive">
                      {needToAttend} classes
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      You need to attend to reach 75%
                    </p>
                  </div>
                );
              }
            })()}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
