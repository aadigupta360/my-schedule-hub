import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface AttendanceRecord {
  id: string;
  user_id: string;
  subject_id: string;
  date: string;
  status: 'present' | 'absent' | 'cancelled';
}

export function useAttendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRecords([]);
      setLoading(false);
      return;
    }

    fetchRecords();
  }, [user]);

  const fetchRecords = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (!error && data) {
      setRecords(data as AttendanceRecord[]);
    }
    setLoading(false);
  };

  const markAttendance = async (subjectId: string, date: string, status: 'present' | 'absent' | 'cancelled') => {
    if (!user) return { error: new Error('Not authenticated') };

    // Check if record exists
    const { data: existing } = await supabase
      .from('attendance_records')
      .select('id')
      .eq('subject_id', subjectId)
      .eq('date', date)
      .maybeSingle();

    let error;

    if (existing) {
      const result = await supabase
        .from('attendance_records')
        .update({ status })
        .eq('id', existing.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('attendance_records')
        .insert({ user_id: user.id, subject_id: subjectId, date, status });
      error = result.error;
    }

    if (!error) {
      await fetchRecords();
    }

    return { error };
  };

  const getAttendanceStats = (subjectId?: string) => {
    const filtered = subjectId 
      ? records.filter(r => r.subject_id === subjectId)
      : records;

    const total = filtered.filter(r => r.status !== 'cancelled').length;
    const present = filtered.filter(r => r.status === 'present').length;
    const absent = filtered.filter(r => r.status === 'absent').length;
    const cancelled = filtered.filter(r => r.status === 'cancelled').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 100;

    return { total, present, absent, cancelled, percentage };
  };

  return { records, loading, markAttendance, getAttendanceStats, refetch: fetchRecords };
}
