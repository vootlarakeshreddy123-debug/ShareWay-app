import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  History, 
  Wallet as WalletIcon,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { db, auth } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { toast } from 'sonner';

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;
    const unsubscribe = onSnapshot(doc(db, 'users', auth.currentUser.uid), (doc) => {
      if (doc.exists()) {
        setBalance(doc.data().walletBalance || 0);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddMoney = () => {
    toast.info('Linking to payment gateway (Simulation)...');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Financials</h1>
           <p className="text-muted-foreground">Manage your earnings and payments</p>
        </div>
        <Button onClick={handleAddMoney} className="rounded-xl gap-2 font-bold h-12 px-6">
           <Plus size={18} /> Add Money
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 rounded-3xl border-none bg-primary text-primary-foreground shadow-2xl overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
           <CardContent className="p-10 relative z-10">
              <div className="flex items-center gap-2 mb-2 opacity-80">
                 <WalletIcon size={16} />
                 <span className="text-sm font-bold uppercase tracking-wider">Total Balance</span>
              </div>
              <h2 className="text-6xl font-black mb-10 tracking-tighter">₹{balance.toLocaleString('en-IN')}</h2>
              
              <div className="flex gap-10">
                 <div>
                    <p className="text-xs font-bold opacity-60 uppercase mb-1">Monthly Earnings</p>
                    <p className="text-xl font-bold">₹12,450</p>
                 </div>
                 <div>
                    <p className="text-xs font-bold opacity-60 uppercase mb-1">Total Trips</p>
                    <p className="text-xl font-bold">48</p>
                 </div>
              </div>
           </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-sm flex flex-col justify-center p-8 bg-secondary/50">
           <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <TrendingUp size={24} />
           </div>
           <h3 className="font-bold mb-1">Top Earner</h3>
           <p className="text-sm text-muted-foreground leading-relaxed">
             You are in the top 5% of travelers this month. Keep offering rides!
           </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-4">
           <h2 className="text-xl font-bold flex items-center gap-2">
              <History size={20} />
              Recent Transactions
           </h2>
           <Card className="rounded-3xl border-none shadow-sm pb-4">
              <CardContent className="p-0">
                 {[
                   { id: '1', title: 'Payment for Ride #420', amount: '+150', time: '2 hours ago', status: 'success' },
                   { id: '2', title: 'Wallet Recharge', amount: '+500', time: 'Yesterday', status: 'success' },
                   { id: '3', title: 'Payment to Traveler #9', amount: '-120', time: 'Yesterday', status: 'success' },
                   { id: '4', title: 'Medicine errand payout', amount: '+80', time: '2 days ago', status: 'success' }
                 ].map((tx) => (
                   <div key={tx.id} className="flex items-center justify-between p-4 px-6 border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          tx.amount.startsWith('+') ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        )}>
                           {tx.amount.startsWith('+') ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                        </div>
                        <div>
                           <p className="text-sm font-bold">{tx.title}</p>
                           <p className="text-[10px] text-muted-foreground uppercase">{tx.time}</p>
                        </div>
                      </div>
                      <p className={cn("font-bold text-sm", tx.amount.startsWith('+') ? "text-green-600" : "text-foreground")}>
                         ₹{tx.amount.replace('+', '').replace('-', '')}
                      </p>
                   </div>
                 ))}
              </CardContent>
           </Card>
        </section>

        <section className="space-y-4">
           <h2 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck size={20} />
              Redeem Earnings
           </h2>
           <Card className="rounded-3xl border-none shadow-sm">
              <CardContent className="p-8 space-y-6">
                 <div className="space-y-2">
                    <Label>Amount to Withdraw</Label>
                    <Input placeholder="Enter amount" className="h-12 rounded-xl" />
                 </div>
                 <div className="space-y-2">
                    <Label>Select Bank/UPI</Label>
                    <div className="grid grid-cols-2 gap-3">
                       <Button variant="outline" className="h-12 rounded-xl bg-muted/20 border-2">UPI ID</Button>
                       <Button variant="outline" className="h-12 rounded-xl bg-muted/20 border-2">Bank Transfer</Button>
                    </div>
                 </div>
                 <Button className="w-full h-12 rounded-xl font-bold">Process Withdrawal</Button>
                 <p className="text-[10px] text-center text-muted-foreground">
                    Withdrawal processing can take up to 24-48 working hours.
                 </p>
              </CardContent>
           </Card>
        </section>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
