import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Car, Mail, Smartphone, Github } from 'lucide-react';
import { toast } from 'sonner';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result.user);
      toast.success('Welcome to ShareWay!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (type: 'login' | 'signup') => {
    if (!email || !password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      let result;
      if (type === 'signup') {
        result = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(result.user);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      toast.success(type === 'signup' ? 'Account created!' : 'Logged in!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (user: any) => {
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Traveler',
        role: 'passenger', // Default role
        isVerified: false,
        ratings: 5,
        trustScore: 100,
        walletBalance: 0,
        createdAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] p-4">
      <Card className="w-full max-w-md border-4 border-black rounded-none shadow-bold-lg overflow-hidden bg-white">
        <CardHeader className="text-center pt-10 pb-6 border-b-4 border-black">
          <div className="w-16 h-16 bg-black text-white flex items-center justify-center font-black italic text-2xl mx-auto mb-4 border-2 border-black rotate-3 shadow-bold">
            SW
          </div>
          <CardTitle className="text-5xl font-black italic tracking-tighter uppercase leading-none">ShareWay</CardTitle>
          <CardDescription className="font-bold text-black opacity-60 uppercase tracking-widest text-[10px] mt-2">Join the community of travelers</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8">
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white border-4 border-black h-12 p-1 rounded-none shadow-bold">
              <TabsTrigger value="email" className="gap-2 font-black italic uppercase text-xs tracking-widest">
                <Mail size={14} /> Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="gap-2 font-black italic uppercase text-xs tracking-widest">
                <Smartphone size={14} /> Phone
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-black italic uppercase text-xs tracking-widest">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="NAME@EXAMPLE.COM" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-none border-4 border-black h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-black italic uppercase text-xs tracking-widest">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-none border-4 border-black h-12"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <Button variant="outline" onClick={() => handleEmailAuth('login')} disabled={loading} className="h-12 border-4 border-black font-black uppercase tracking-widest">
                  Login
                </Button>
                <Button onClick={() => handleEmailAuth('signup')} disabled={loading} className="h-12 border-4 border-black bg-black text-white font-black uppercase tracking-widest">
                  Sign Up
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="phone" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-black italic uppercase text-xs tracking-widest">Phone Number</Label>
                <div className="flex gap-2">
                  <div className="bg-black text-white px-4 flex items-center border-4 border-black text-sm font-black italic tracking-tighter leading-none">+91</div>
                  <Input id="phone" type="tel" placeholder="1234567890" className="rounded-none border-4 border-black h-12" />
                </div>
              </div>
              <Button className="w-full h-12 border-4 border-black font-black italic uppercase " variant="secondary" disabled>
                Send OTP (Simulated)
              </Button>
              <p className="text-[10px] text-center font-bold text-black uppercase opacity-40">
                Phone auth is currently in demo mode. Please use Email or Google.
              </p>
            </TabsContent>
          </Tabs>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-4 border-black" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 font-black italic tracking-widest">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Button variant="outline" className="gap-3 h-14 border-4 border-black font-black uppercase tracking-widest shadow-bold hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all" onClick={handleGoogleLogin} disabled={loading}>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google Login
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4 text-center pb-8 border-t-4 border-black pt-6 mt-4">
          <p className="text-[10px] font-bold text-black uppercase opacity-60 px-6 leading-relaxed">
            By clicking continue, you agree to our 
            <span className="underline italic mx-1 cursor-pointer">Terms of Service</span>
            and
            <span className="underline italic mx-1 cursor-pointer">Privacy Policy</span>.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

