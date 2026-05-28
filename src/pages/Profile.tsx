import { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  Star, 
  CheckCircle2, 
  History,
  ChevronRight,
  Car,
  Package,
  IdCard,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { auth, db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) return;
    const unsubscribe = onSnapshot(doc(db, 'users', auth.currentUser.uid), (doc) => {
      if (doc.exists()) {
        setProfile(doc.data());
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const verifyDoc = async (field: string) => {
    if (!auth.currentUser) return;
    toast.success(`${field} uploaded! Our team will verify it shortly.`);
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      [field]: true
    });
  };

  if (!profile) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col md:flex-row items-center gap-6 px-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-3xl bg-primary/10 flex items-center justify-center border-4 border-background shadow-xl overflow-hidden">
             {profile.photoURL ? (
               <img src={profile.photoURL} className="w-full h-full object-cover" />
             ) : (
               <UserIcon size={64} className="text-primary/40" />
             )}
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg border-2 border-background">
             <Star size={18} />
          </div>
        </div>

        <div className="text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{profile.displayName}</h1>
            {profile.isVerified && <CheckCircle2 className="text-blue-500" size={24} />}
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground mb-4 font-medium">
             <div className="flex items-center gap-1">
               <Star size={14} className="fill-yellow-400 text-yellow-400" />
               <span className="font-bold text-foreground">{profile.ratings}</span> (124 reviews)
             </div>
             <div className="flex items-center gap-1">
               <ShieldCheck size={14} className="text-green-500" />
               Trust Score: <span className="font-bold text-foreground">{profile.trustScore}</span>
             </div>
          </div>
          <div className="flex gap-2 justify-center md:justify-start">
             <Badge variant="outline" className="rounded-full px-3 py-0.5 capitalize bg-secondary border-none">{profile.role}</Badge>
             <Badge variant="outline" className="rounded-full px-3 py-0.5 border-primary text-primary">Bronze Member</Badge>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl">
             <Settings size={20} />
          </Button>
          <Button variant="destructive" size="icon" className="h-12 w-12 rounded-xl" onClick={handleLogout}>
             <LogOut size={20} />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <Card className="rounded-3xl border-none shadow-sm col-span-1 md:col-span-2">
           <CardHeader>
              <CardTitle className="text-lg">Trust Center</CardTitle>
              <CardDescription>Verify your identity to unlock higher limits and premium features.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border-2 border-transparent hover:border-primary/20 transition-all cursor-pointer group" onClick={() => verifyDoc('aadhaarVerified')}>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary">
                       <IdCard size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-bold">Aadhaar Verification</p>
                       <p className="text-xs text-muted-foreground">Mandatory for all users</p>
                    </div>
                 </div>
                 {profile.aadhaarVerified ? <CheckCircle2 className="text-green-500" /> : <ChevronRight className="text-muted-foreground group-hover:text-primary" />}
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border-2 border-transparent hover:border-primary/20 transition-all cursor-pointer group" onClick={() => verifyDoc('licenseVerified')}>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary">
                       <Car size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-bold">Driving License</p>
                       <p className="text-xs text-muted-foreground">Only required for Travelers</p>
                    </div>
                 </div>
                 {profile.licenseVerified ? <CheckCircle2 className="text-green-500" /> : <ChevronRight className="text-muted-foreground group-hover:text-primary" />}
              </div>
           </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-sm flex flex-col items-center justify-center text-center p-8 bg-primary/5 border border-primary/10">
           <Package className="text-primary mb-4" size={40} />
           <h3 className="font-bold mb-2">Invite Friends</h3>
           <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
             Get ₹50 ShareWay credit for every friend who completes their first trip!
           </p>
           <Button className="w-full rounded-xl font-bold shadow-md shadow-primary/10">Share Link</Button>
        </Card>
      </div>

      <section className="space-y-4 px-4">
         <h2 className="text-xl font-bold">Account Overview</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-3xl border-none shadow-sm p-6 space-y-1">
               <p className="text-[10px] uppercase font-bold text-muted-foreground">Earnings</p>
               <p className="text-2xl font-black">₹{profile.walletBalance}</p>
            </Card>
            <Card className="rounded-3xl border-none shadow-sm p-6 space-y-1">
               <p className="text-[10px] uppercase font-bold text-muted-foreground">Rides Completed</p>
               <p className="text-2xl font-black">28</p>
            </Card>
            <Card className="rounded-3xl border-none shadow-sm p-6 space-y-1">
               <p className="text-[10px] uppercase font-bold text-muted-foreground">Parcels Sent</p>
               <p className="text-2xl font-black">12</p>
            </Card>
            <Card className="rounded-3xl border-none shadow-sm p-6 space-y-1">
               <p className="text-[10px] uppercase font-bold text-muted-foreground">Badges</p>
               <p className="text-2xl font-black">4</p>
            </Card>
         </div>
      </section>
    </div>
  );
}
