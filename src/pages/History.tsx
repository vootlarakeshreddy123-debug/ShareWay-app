import { useState } from 'react';
import { 
  History as HistoryIcon, 
  Car, 
  Package, 
  ShoppingBag, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const MOCK_HISTORY = [
  { id: '1', type: 'ride', title: 'Hitech → Airport', date: 'Oct 12, 2024', status: 'completed', amount: '₹450', partner: 'Priya K.' },
  { id: '2', type: 'parcel', title: 'Secunderabad → Gachibowli', date: 'Oct 10, 2024', status: 'delivered', amount: '₹120', partner: 'Rahul S.' },
  { id: '3', type: 'errand', title: 'Ratnadeep Grocery', date: 'Oct 08, 2024', status: 'completed', amount: '₹80', partner: 'Traveler #2' }
];

export default function History() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
         <h1 className="text-3xl font-bold tracking-tight">History</h1>
         <p className="text-muted-foreground">Your past contributions and requests.</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
         {MOCK_HISTORY.map((item) => (
           <Card key={item.id} className="rounded-3xl border-none shadow-sm hover:shadow-md transition-shadow group overflow-hidden relative">
              <div className={cn(
                "absolute top-0 left-0 w-1.5 h-full",
                item.type === 'ride' ? "bg-blue-500" : item.type === 'parcel' ? "bg-orange-500" : "bg-green-500"
              )} />
              <CardContent className="p-6">
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                       <div className={cn(
                         "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                         item.type === 'ride' ? "bg-blue-500" : item.type === 'parcel' ? "bg-orange-500" : "bg-green-500"
                       )}>
                          {item.type === 'ride' && <Car size={24} />}
                          {item.type === 'parcel' && <Package size={24} />}
                          {item.type === 'errand' && <ShoppingBag size={24} />}
                       </div>
                       <div>
                          <p className="font-bold text-lg">{item.title}</p>
                          <div className="flex items-center gap-4">
                             <div className="flex items-center gap-1 text-xs text-muted-foreground uppercase tracking-widest font-bold">
                                <Clock size={12} />
                                {item.date}
                             </div>
                             <div className="flex items-center gap-1 text-xs text-primary font-bold">
                                <CheckCircle2 size={12} />
                                {item.status}
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-none pt-4 sm:pt-0 border-dashed">
                       <div className="text-right">
                          <p className="text-lg font-black text-foreground">{item.amount}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Partner: {item.partner}</p>
                       </div>
                       <Button variant="outline" className="rounded-xl px-4 font-bold border-2 h-10 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                          Review
                       </Button>
                    </div>
                 </div>
              </CardContent>
           </Card>
         ))}

         <div className="p-12 text-center bg-muted/20 border-2 border-dashed rounded-3xl mt-4">
            <div className="w-16 h-16 rounded-3xl bg-background shadow-inner flex items-center justify-center mx-auto mb-4 text-muted-foreground opacity-40">
               <TrendingUp size={32} />
            </div>
            <h3 className="text-sm font-bold opacity-60">Trips from last month are archived</h3>
            <Button variant="link" className="text-xs font-bold text-primary px-0 h-6">View Archive</Button>
         </div>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
