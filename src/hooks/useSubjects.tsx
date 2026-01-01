import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Subject {
  id: string;
  user_id: string;
  name: string;
  short_name: string | null;
  color: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room: string | null;
  is_extra: boolean;
  extra_date: string | null;
}

export function useSubjects() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubjects([]);
      setLoading(false);
      return;
    }

    fetchSubjects();
  }, [user]);

  const fetchSubjects = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('user_id', user.id)
      .order('day_of_week')
      .order('start_time');

    if (!error && data) {
      setSubjects(data);
    }
    setLoading(false);
  };

  const addSubject = async (subject: Omit<Subject, 'id' | 'user_id'>) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('subjects')
      .insert({ ...subject, user_id: user.id });

    if (!error) {
      await fetchSubjects();
    }

    return { error };
  };

  const updateSubject = async (id: string, updates: Partial<Subject>) => {
    const { error } = await supabase
      .from('subjects')
      .update(updates)
      .eq('id', id);

    if (!error) {
      await fetchSubjects();
    }

    return { error };
  };

  const deleteSubject = async (id: string) => {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id);

    if (!error) {
      await fetchSubjects();
    }

    return { error };
  };

  return { subjects, loading, addSubject, updateSubject, deleteSubject, refetch: fetchSubjects };
}
