import { useState } from 'react';
import { 
  Search, 
  MoreVertical, 
  Send, 
  Image as ImageIcon, 
  Smile, 
  Phone, 
  Video,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const MOCK_CHATS = [
  { id: '1', name: 'Rahul S.', lastMsg: 'I will reach Hitech City in 5 mins', time: '12:45 PM', unread: 2, online: true },
  { id: '2', name: 'Priya K.', lastMsg: 'Is the medicine prescription clear?', time: '11:20 AM', unread: 0, online: false },
  { id: '3', name: 'Courier Team', lastMsg: 'Your parcel has been picked up', time: 'Yesterday', unread: 0, online: true },
  { id: '4', name: 'Amit V.', lastMsg: 'Where exactly are you standing?', time: 'Yesterday', unread: 0, online: false },
];

export default function Chat() {
  const [activeChat, setActiveChat] = useState<any>(MOCK_CHATS[0]);
  const [msg, setMsg] = useState('');

  return (
    <div className="h-[calc(100vh-140px)] flex bg-card rounded-3xl overflow-hidden shadow-2xl border">
      {/* Search & List */}
      <div className="w-full md:w-80 border-r flex flex-col bg-muted/10">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input placeholder="Search people..." className="pl-10 rounded-xl h-11 bg-muted/40 border-none" />
          </div>
        </div>
        <ScrollArea className="flex-1">
           {MOCK_CHATS.map((chat) => (
             <div 
               key={chat.id} 
               onClick={() => setActiveChat(chat)}
               className={cn(
                 "flex items-center gap-4 p-4 px-6 cursor-pointer transition-colors border-l-4",
                 activeChat?.id === chat.id ? "bg-primary/10 border-primary" : "border-transparent hover:bg-muted/30"
               )}
             >
                <div className="relative">
                  <Avatar className="h-12 w-12 rounded-2xl">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{chat.name[0]}</AvatarFallback>
                  </Avatar>
                  {chat.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                   <div className="flex justify-between items-center mb-1">
                      <p className="font-bold text-sm truncate">{chat.name}</p>
                      <p className="text-[10px] text-muted-foreground whitespace-nowrap">{chat.time}</p>
                   </div>
                   <p className="text-xs text-muted-foreground truncate leading-relaxed">{chat.lastMsg}</p>
                </div>
                {chat.unread > 0 && (
                   <div className="w-5 h-5 rounded-lg bg-primary text-[10px] text-primary-foreground font-bold flex items-center justify-center">
                      {chat.unread}
                   </div>
                )}
             </div>
           ))}
        </ScrollArea>
      </div>

      {/* Main Chat Window */}
      <div className="hidden md:flex flex-1 flex-col relative">
        {activeChat ? (
          <>
            <header className="h-20 border-b flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <Avatar className="h-11 w-11 rounded-2xl">
                   <AvatarFallback className="bg-primary/10 text-primary font-bold">{activeChat.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                   <h3 className="font-bold">{activeChat.name}</h3>
                   <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active Now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-primary"><Phone size={20} /></Button>
                 <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-primary"><Video size={20} /></Button>
                 <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-primary"><Info size={20} /></Button>
              </div>
            </header>

            <ScrollArea className="flex-1 p-8 pb-20 space-y-6">
               <div className="flex flex-col gap-6">
                 <div className="flex gap-4 max-w-[80%]">
                    <Avatar className="h-8 w-8 rounded-xl shrink-0 mt-1">
                       <AvatarFallback className="text-[10px] font-bold">{activeChat.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="p-4 rounded-3xl rounded-tl-none bg-muted break-words text-sm font-medium leading-relaxed">
                       Hi, I've started the ride. I'll reach Hitech City in 5 mins. Are you near the main gate?
                    </div>
                 </div>

                 <div className="flex gap-4 max-w-[80%] self-end flex-row-reverse">
                    <div className="p-4 rounded-3xl rounded-tr-none bg-primary text-primary-foreground break-words text-sm font-medium leading-relaxed shadow-lg">
                       Yes, I am near the Axis Bank ATM. Let me know when you arrive.
                    </div>
                 </div>

                 <div className="flex gap-4 max-w-[80%]">
                    <Avatar className="h-8 w-8 rounded-xl shrink-0 mt-1">
                       <AvatarFallback className="text-[10px] font-bold">{activeChat.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="p-4 rounded-3xl rounded-tl-none bg-muted break-words text-sm font-medium leading-relaxed">
                       Sure, I am on the way! Just take a right turn from the signal.
                    </div>
                 </div>
               </div>
            </ScrollArea>

            <div className="absolute bottom-0 left-0 right-0 p-6 pt-0 bg-gradient-to-t from-background to-transparent">
               <div className="bg-background border shadow-2xl rounded-2xl flex items-center p-2 px-4 gap-2">
                  <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground"><ImageIcon size={20} /></Button>
                  <Input 
                    placeholder="Type a message..." 
                    value={msg}
                    className="border-none focus-visible:ring-0 bg-transparent"
                    onChange={(e) => setMsg(e.target.value)}
                  />
                  <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground"><Smile size={20} /></Button>
                  <Button className="rounded-xl px-4 gap-2 font-bold h-10">
                     <Send size={18} />
                  </Button>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-muted/5">
             <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center mb-6 text-primary/40">
                <MessageSquare size={40} />
             </div>
             <h3 className="text-xl font-bold mb-2">Your Conversations</h3>
             <p className="text-sm text-muted-foreground max-w-xs">
                Select a chat from the sidebar to start connected with other ShareWay members.
             </p>
          </div>
        )}
      </div>
    </div>
  );
}

import { MessageSquare } from 'lucide-react';
