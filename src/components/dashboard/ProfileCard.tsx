import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, Sparkles } from 'lucide-react';

export function ProfileCard() {
  const { profile } = useProfile();
  const { signOut } = useAuth();

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <div className="glass-card p-4 glow animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="w-16 h-16 border-2 border-primary/30 ring-2 ring-primary/20 ring-offset-2 ring-offset-transparent">
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-accent animate-pulse" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-foreground truncate">
            {profile?.full_name || 'Student'}
          </h2>
          <div className="flex flex-wrap gap-2 mt-1">
            {profile?.roll_number && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                {profile.roll_number}
              </span>
            )}
            {profile?.semester && (
              <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full font-medium">
                Sem {profile.semester}
              </span>
            )}
          </div>
          {profile?.department && (
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {profile.department}
            </p>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
          onClick={signOut}
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
