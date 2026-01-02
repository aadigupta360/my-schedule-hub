import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSubjects, Subject } from '@/hooks/useSubjects';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Trash2, User, Book, CalendarPlus, CalendarIcon, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const COLORS = [
  '#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#14b8a6',
  '#22c55e', '#eab308', '#f97316', '#ef4444', '#ec4899', '#d946ef'
];

export default function Manage() {
  const { subjects, addSubject, deleteSubject } = useSubjects();
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isExtraOpen, setIsExtraOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('1');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [room, setRoom] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [extraDate, setExtraDate] = useState<Date>();

  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [semester, setSemester] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setRollNumber(profile.roll_number || '');
      setSemester(profile.semester || '');
      setDepartment(profile.department || '');
    }
  }, [profile]);

  const resetForm = () => {
    setName('');
    setShortName('');
    setDayOfWeek('1');
    setStartTime('09:00');
    setEndTime('10:00');
    setRoom('');
    setColor(COLORS[0]);
    setExtraDate(undefined);
  };

  const handleAddSubject = async () => {
    if (!name.trim()) {
      toast({ title: 'Error', description: 'Subject name is required', variant: 'destructive' });
      return;
    }

    const { error } = await addSubject({
      name: name.trim(),
      short_name: shortName.trim() || null,
      day_of_week: parseInt(dayOfWeek),
      start_time: startTime,
      end_time: endTime,
      room: room.trim() || null,
      color,
      is_extra: false,
      extra_date: null,
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Subject added' });
      resetForm();
      setIsAddOpen(false);
    }
  };

  const handleAddExtraClass = async () => {
    if (!name.trim() || !extraDate) {
      toast({ title: 'Error', description: 'Name and date required', variant: 'destructive' });
      return;
    }

    const { error } = await addSubject({
      name: name.trim(),
      short_name: shortName.trim() || null,
      day_of_week: extraDate.getDay(),
      start_time: startTime,
      end_time: endTime,
      room: room.trim() || null,
      color,
      is_extra: true,
      extra_date: format(extraDate, 'yyyy-MM-dd'),
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Extra class added' });
      resetForm();
      setIsExtraOpen(false);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    const { error } = await deleteSubject(id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Subject removed' });
    }
  };

  const handleUpdateProfile = async () => {
    const { error } = await updateProfile({
      full_name: fullName,
      roll_number: rollNumber || null,
      semester: semester || null,
      department: department || null,
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Updated', description: 'Profile saved' });
    }
  };

  const regularSubjects = subjects.filter(s => !s.is_extra);
  const extraClasses = subjects.filter(s => s.is_extra);

  return (
    <AppLayout>
      <div className="space-y-5 animate-fade-in">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold gradient-text">Manage</h1>
        </div>

        <Tabs defaultValue="subjects">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 rounded-xl p-1">
            <TabsTrigger value="subjects" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Subjects
            </TabsTrigger>
            <TabsTrigger value="extra" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Extra
            </TabsTrigger>
            <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subjects" className="space-y-4 mt-4">
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="w-full rounded-xl h-12 bg-gradient-to-r from-primary to-secondary glow-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Regular Subject
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/10">
                <DialogHeader>
                  <DialogTitle>Add New Subject</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm">Name *</Label>
                      <Input value={name} onChange={e => setName(e.target.value)} placeholder="Mathematics" className="bg-white/5 border-white/10 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Short Name</Label>
                      <Input value={shortName} onChange={e => setShortName(e.target.value)} placeholder="MATH" className="bg-white/5 border-white/10 rounded-xl" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Day</Label>
                    <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                      <SelectTrigger className="bg-white/5 border-white/10 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS.map((day, i) => (
                          <SelectItem key={i} value={i.toString()}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm">Start Time</Label>
                      <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">End Time</Label>
                      <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Room</Label>
                    <Input value={room} onChange={e => setRoom(e.target.value)} placeholder="Room 101" className="bg-white/5 border-white/10 rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Color</Label>
                    <div className="flex gap-2 flex-wrap">
                      {COLORS.map(c => (
                        <button
                          key={c}
                          type="button"
                          className={cn(
                            'w-8 h-8 rounded-full transition-all',
                            color === c && 'ring-2 ring-offset-2 ring-offset-background ring-white'
                          )}
                          style={{ backgroundColor: c }}
                          onClick={() => setColor(c)}
                        />
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleAddSubject} className="w-full rounded-xl h-11">Add Subject</Button>
                </div>
              </DialogContent>
            </Dialog>

            {regularSubjects.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                  <Book className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No subjects yet</p>
                <p className="text-sm text-muted-foreground/60 mt-1">Add your first subject above</p>
              </div>
            ) : (
              regularSubjects.map((subject, index) => (
                <div 
                  key={subject.id} 
                  className="glass-card p-4 animate-slide-up"
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    borderLeftWidth: '4px',
                    borderLeftColor: subject.color,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{subject.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {DAYS[subject.day_of_week]} • {subject.start_time.slice(0, 5)} - {subject.end_time.slice(0, 5)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/20 rounded-xl"
                      onClick={() => handleDeleteSubject(subject.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="extra" className="space-y-4 mt-4">
            <Dialog open={isExtraOpen} onOpenChange={setIsExtraOpen}>
              <DialogTrigger asChild>
                <Button className="w-full rounded-xl h-12" variant="secondary">
                  <CalendarPlus className="w-4 h-4 mr-2" />
                  Add Extra Class
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/10">
                <DialogHeader>
                  <DialogTitle>Add Extra Class</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Subject Name *</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Mathematics" className="bg-white/5 border-white/10 rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start bg-white/5 border-white/10 rounded-xl">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {extraDate ? format(extraDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 glass-card">
                        <Calendar
                          mode="single"
                          selected={extraDate}
                          onSelect={setExtraDate}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm">Start Time</Label>
                      <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">End Time</Label>
                      <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="bg-white/5 border-white/10 rounded-xl" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Room</Label>
                    <Input value={room} onChange={e => setRoom(e.target.value)} placeholder="Room 101" className="bg-white/5 border-white/10 rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Color</Label>
                    <div className="flex gap-2 flex-wrap">
                      {COLORS.map(c => (
                        <button
                          key={c}
                          type="button"
                          className={cn(
                            'w-8 h-8 rounded-full transition-all',
                            color === c && 'ring-2 ring-offset-2 ring-offset-background ring-white'
                          )}
                          style={{ backgroundColor: c }}
                          onClick={() => setColor(c)}
                        />
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleAddExtraClass} className="w-full rounded-xl h-11">Add Extra Class</Button>
                </div>
              </DialogContent>
            </Dialog>

            {extraClasses.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                  <CalendarPlus className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No extra classes</p>
                <p className="text-sm text-muted-foreground/60 mt-1">Add makeup or extra classes here</p>
              </div>
            ) : (
              extraClasses.map((subject, index) => (
                <div 
                  key={subject.id} 
                  className="glass-card p-4 animate-slide-up"
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    borderLeftWidth: '4px',
                    borderLeftColor: subject.color,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{subject.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {subject.extra_date} • {subject.start_time.slice(0, 5)} - {subject.end_time.slice(0, 5)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/20 rounded-xl"
                      onClick={() => handleDeleteSubject(subject.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="profile" className="mt-4">
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-5">
                <User className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Your Profile</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Full Name</Label>
                  <Input 
                    value={fullName} 
                    onChange={e => setFullName(e.target.value)} 
                    placeholder="John Doe"
                    className="bg-white/5 border-white/10 rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Roll Number</Label>
                  <Input 
                    value={rollNumber} 
                    onChange={e => setRollNumber(e.target.value)} 
                    placeholder="2021CSE001"
                    className="bg-white/5 border-white/10 rounded-xl h-11"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Semester</Label>
                    <Input 
                      value={semester} 
                      onChange={e => setSemester(e.target.value)} 
                      placeholder="6"
                      className="bg-white/5 border-white/10 rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Department</Label>
                    <Input 
                      value={department} 
                      onChange={e => setDepartment(e.target.value)} 
                      placeholder="CSE"
                      className="bg-white/5 border-white/10 rounded-xl h-11"
                    />
                  </div>
                </div>
                <Button onClick={handleUpdateProfile} className="w-full rounded-xl h-11 bg-gradient-to-r from-primary to-secondary">
                  Save Profile
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
