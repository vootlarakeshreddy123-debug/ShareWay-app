import { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Settings, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MOCK_USERS = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Traveler', status: 'verified', joined: 'Jan 2024' },
  { id: '2', name: 'Priya Kapoor', email: 'priya@example.com', role: 'Requester', status: 'pending', joined: 'Feb 2024' },
  { id: '3', name: 'Amit Verma', email: 'amit@example.com', role: 'Passenger', status: 'verified', joined: 'Dec 2023' },
  { id: '4', name: 'Sneha Reddy', email: 'sneha@example.com', role: 'Sender', status: 'flagged', joined: 'Mar 2024' },
];

export default function Admin() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
           <p className="text-muted-foreground">Monitor system health and verify users.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="rounded-xl font-bold">Export Logs</Button>
           <Button className="rounded-xl font-bold">System Refresh</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <Card className="rounded-3xl border-none shadow-sm p-6 space-y-1">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Active Users</p>
            <p className="text-2xl font-black">1,284</p>
            <p className="text-[10px] text-green-500 font-bold">+12% this week</p>
         </Card>
         <Card className="rounded-3xl border-none shadow-sm p-6 space-y-1">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Total Trips</p>
            <p className="text-2xl font-black">12,450</p>
            <p className="text-[10px] text-green-500 font-bold">+5% this week</p>
         </Card>
         <Card className="rounded-3xl border-none shadow-sm p-6 space-y-1">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Reports</p>
            <p className="text-2xl font-black text-red-500">14</p>
            <p className="text-[10px] text-destructive font-bold">Action Needed</p>
         </Card>
         <Card className="rounded-3xl border-none shadow-sm p-6 space-y-1">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Revenue</p>
            <p className="text-2xl font-black text-green-600">₹84K</p>
            <p className="text-[10px] text-green-500 font-bold">+18% this month</p>
         </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-muted/50 rounded-2xl h-11 p-1 border">
           <TabsTrigger value="users" className="rounded-xl font-bold gap-2"><Users size={14} /> User Management</TabsTrigger>
           <TabsTrigger value="verifications" className="rounded-xl font-bold gap-2"><ShieldCheck size={14} /> KYC Queue</TabsTrigger>
           <TabsTrigger value="fraud" className="rounded-xl font-bold gap-2"><AlertTriangle size={14} /> Fraud Detection</TabsTrigger>
           <TabsTrigger value="stats" className="rounded-xl font-bold gap-2"><TrendingUp size={14} /> Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4 animate-in fade-in duration-300">
           <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                 <div>
                    <CardTitle className="text-lg">Platform Users</CardTitle>
                    <CardDescription>View and manage all registered accounts.</CardDescription>
                 </div>
                 <div className="flex gap-2">
                    <div className="relative">
                       <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                       <Input placeholder="Search users..." className="pl-9 h-10 w-64 rounded-xl text-sm" />
                    </div>
                    <Button variant="outline" size="icon" className="rounded-xl h-10 w-10"><Filter size={16} /></Button>
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                 <Table>
                    <TableHeader className="bg-muted/30">
                       <TableRow>
                          <TableHead className="pl-6 font-bold">User</TableHead>
                          <TableHead className="font-bold">Role</TableHead>
                          <TableHead className="font-bold">Status</TableHead>
                          <TableHead className="font-bold">Joined</TableHead>
                          <TableHead className="pr-6 text-right font-bold tracking-tight">Manage</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {MOCK_USERS.map((u) => (
                         <TableRow key={u.id} className="hover:bg-muted/10 transition-colors">
                            <TableCell className="pl-6">
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                                     {u.name[0]}
                                  </div>
                                  <div>
                                     <p className="font-bold text-sm">{u.name}</p>
                                     <p className="text-[10px] text-muted-foreground">{u.email}</p>
                                  </div>
                               </div>
                            </TableCell>
                            <TableCell>
                               <Badge variant="outline" className="rounded-full text-[10px] uppercase font-bold">{u.role}</Badge>
                            </TableCell>
                            <TableCell>
                               <div className="flex items-center gap-1.5">
                                  {u.status === 'verified' && <CheckCircle2 size={14} className="text-green-500" />}
                                  {u.status === 'pending' && <TrendingUp size={14} className="text-yellow-500" />}
                                  {u.status === 'flagged' && <AlertTriangle size={14} className="text-red-500" />}
                                  <span className="text-xs font-medium capitalize">{u.status}</span>
                               </div>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground font-medium">{u.joined}</TableCell>
                            <TableCell className="pr-6 text-right">
                               <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
                                  <MoreVertical size={16} />
                               </Button>
                            </TableCell>
                         </TableRow>
                       ))}
                    </TableBody>
                 </Table>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="verifications" className="text-center p-12">
            <div className="max-w-xs mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
                 <ShieldCheck size={32} />
              </div>
              <h3 className="text-lg font-bold">No Pending Verifications</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All 48 user verification requests from the last 24 hours have been processed successfully.
              </p>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
