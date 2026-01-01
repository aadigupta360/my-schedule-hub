import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSubjects, Subject } from '@/hooks/useSubjects';
import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Trash2, Edit2, User, Book, CalendarPlus, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const COLORS = [
  '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6'
];

export default function Manage() {
  const { subjects, addSubject, updateSubject, deleteSubject } = useSubjects();
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isExtraOpen, setIsExtraOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('1');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [room, setRoom] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [extraDate, setExtraDate] = useState<Date>();

  // Profile form
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [rollNumber, setRollNumber] = useState(profile?.roll_number || '');
  const [semester, setSemester] = useState(profile?.semester || '');
  const [department, setDepartment] = useState(profile?.department || '');

  const resetForm = () => {
    setName('');
    setShortName('');
    setDayOfWeek('1');
    setStartTime('09:00');
    setEndTime('10:00');
    setRoom('');
    setColor(COLORS[0]);
    setExtraDate(undefined);
    setEditingSubject(null);
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
      toast({ title: 'Success', description: 'Subject added successfully' });
      resetForm();
      setIsAddOpen(false);
    }
  };

  const handleAddExtraClass = async () => {
    if (!name.trim() || !extraDate) {
      toast({ title: 'Error', description: 'Subject name and date are required', variant: 'destructive' });
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
      toast({ title: 'Success', description: 'Extra class added successfully' });
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
      toast({ title: 'Updated', description: 'Profile saved successfully' });
    }
  };

  const regularSubjects = subjects.filter(s => !s.is_extra);
  const extraClasses = subjects.filter(s => s.is_extra);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Manage</h1>

        <Tabs defaultValue="subjects">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="extra">Extra Class</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="subjects" className="space-y-4 mt-4">
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Regular Subject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Subject</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Subject Name *</Label>
                      <Input value={name} onChange={e => setName(e.target.value)} placeholder="Mathematics" />
                    </div>
                    <div className="space-y-2">
                      <Label>Short Name</Label>
                      <Input value={shortName} onChange={e => setShortName(e.target.value)} placeholder="MATH" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Day</Label>
                    <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS.map((day, i) => (
                          <SelectItem key={i} value={i.toString()}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Room/Location</Label>
                    <Input value={room} onChange={e => setRoom(e.target.value)} placeholder="Room 101" />
                  </div>

                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex gap-2 flex-wrap">
                      {COLORS.map(c => (
                        <button
                          key={c}
                          type="button"
                          className={cn(
                            'w-8 h-8 rounded-full transition-all',
                            color === c && 'ring-2 ring-offset-2 ring-primary'
                          )}
                          style={{ backgroundColor: c }}
                          onClick={() => setColor(c)}
                        />
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleAddSubject} className="w-full">Add Subject</Button>
                </div>
              </DialogContent>
            </Dialog>

            {regularSubjects.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="py-8 text-center text-muted-foreground">
                  <Book className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No subjects added yet</p>
                  <p className="text-sm mt-1">Click the button above to add your first subject</p>
                </CardContent>
              </Card>
            ) : (
              regularSubjects.map(subject => (
                <Card key={subject.id} className="border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-12 rounded-full" style={{ backgroundColor: subject.color }} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{subject.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {DAYS[subject.day_of_week]} • {subject.start_time.slice(0, 5)} - {subject.end_time.slice(0, 5)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteSubject(subject.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="extra" className="space-y-4 mt-4">
            <Dialog open={isExtraOpen} onOpenChange={setIsExtraOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" variant="secondary">
                  <CalendarPlus className="w-4 h-4 mr-2" />
                  Add Extra Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Extra Class</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Subject Name *</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Mathematics" />
                  </div>

                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {extraDate ? format(extraDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={extraDate}
                          onSelect={setExtraDate}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Room/Location</Label>
                    <Input value={room} onChange={e => setRoom(e.target.value)} placeholder="Room 101" />
                  </div>

                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex gap-2 flex-wrap">
                      {COLORS.map(c => (
                        <button
                          key={c}
                          type="button"
                          className={cn(
                            'w-8 h-8 rounded-full transition-all',
                            color === c && 'ring-2 ring-offset-2 ring-primary'
                          )}
                          style={{ backgroundColor: c }}
                          onClick={() => setColor(c)}
                        />
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleAddExtraClass} className="w-full">Add Extra Class</Button>
                </div>
              </DialogContent>
            </Dialog>

            {extraClasses.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="py-8 text-center text-muted-foreground">
                  <CalendarPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No extra classes scheduled</p>
                  <p className="text-sm mt-1">Add one-time makeup or extra classes here</p>
                </CardContent>
              </Card>
            ) : (
              extraClasses.map(subject => (
                <Card key={subject.id} className="border-0 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-12 rounded-full" style={{ backgroundColor: subject.color }} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{subject.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {subject.extra_date} • {subject.start_time.slice(0, 5)} - {subject.end_time.slice(0, 5)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteSubject(subject.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="profile" className="mt-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    value={fullName} 
                    onChange={e => setFullName(e.target.value)} 
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Roll Number</Label>
                  <Input 
                    value={rollNumber} 
                    onChange={e => setRollNumber(e.target.value)} 
                    placeholder="2021CSE001"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Semester</Label>
                    <Input 
                      value={semester} 
                      onChange={e => setSemester(e.target.value)} 
                      placeholder="6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input 
                      value={department} 
                      onChange={e => setDepartment(e.target.value)} 
                      placeholder="Computer Science"
                    />
                  </div>
                </div>
                <Button onClick={handleUpdateProfile} className="w-full">
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
