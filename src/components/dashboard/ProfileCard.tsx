import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export function ProfileCard() {
  const { profile } = useProfile();
  const { signOut, user } = useAuth();

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-14 h-14 border-2 border-primary-foreground/30">
            <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-lg font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold truncate">
              {profile?.full_name || 'Student'}
            </h2>
            <div className="flex flex-wrap gap-2 text-sm text-primary-foreground/80">
              {profile?.roll_number && (
                <span className="bg-primary-foreground/10 px-2 py-0.5 rounded-full">
                  {profile.roll_number}
                </span>
              )}
              {profile?.semester && (
                <span className="bg-primary-foreground/10 px-2 py-0.5 rounded-full">
                  Sem {profile.semester}
                </span>
              )}
            </div>
            {profile?.department && (
              <p className="text-sm text-primary-foreground/70 mt-1 truncate">
                {profile.department}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            onClick={signOut}
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
