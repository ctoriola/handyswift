import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { PageTransition } from "../components/PageTransition";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Search, Send, MoreVertical } from "lucide-react";
import { useState } from "react";

interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

interface Conversation {
  id: number;
  provider: {
    name: string;
    image: string;
    service: string;
  };
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: 1,
    provider: {
      name: "Adebayo Ogundimu",
      image: "https://images.unsplash.com/photo-1740754699699-c8b4b1635faf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoYW5keW1hbiUyMHdvcmtlcnxlbnwxfHx8fDE3NjE2MDcwNTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      service: "Plumbing"
    },
    lastMessage: "I can come tomorrow at 10 AM",
    timestamp: "2m ago",
    unread: true
  },
  {
    id: 2,
    provider: {
      name: "Fatima Aliyu",
      image: "https://images.unsplash.com/photo-1679137315174-ff25263f2e1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjbGVhbmVyJTIwc2VydmljZXxlbnwxfHx8fDE3NjE2MDcwNTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      service: "Cleaning"
    },
    lastMessage: "Thank you for choosing our service!",
    timestamp: "1h ago",
    unread: false
  }
];

export function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState("");

  const mockMessages: Message[] = selectedConversation ? [
    {
      id: 1,
      senderId: 1,
      text: "Hi! I need help with a plumbing issue",
      timestamp: "10:30 AM",
      isOwn: true
    },
    {
      id: 2,
      senderId: 2,
      text: "Hello! I'd be happy to help. What seems to be the problem?",
      timestamp: "10:32 AM",
      isOwn: false
    },
    {
      id: 3,
      senderId: 1,
      text: "My kitchen sink is leaking",
      timestamp: "10:33 AM",
      isOwn: true
    },
    {
      id: 4,
      senderId: 2,
      text: "I can come tomorrow at 10 AM",
      timestamp: "10:35 AM",
      isOwn: false
    }
  ] : [];

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <Navbar />
        
        <div className="pt-20 min-h-screen bg-slate-50">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl text-slate-900 mb-6">Messages</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
              {/* Conversations List */}
              <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      placeholder="Search conversations..."
                      className="pl-10 h-11 rounded-xl border-slate-300"
                    />
                  </div>
                </div>
                
                <div className="overflow-y-auto h-full">
                  {mockConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`w-full p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors border-b border-slate-100 ${
                        selectedConversation?.id === conversation.id ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="relative">
                        <ImageWithFallback
                          src={conversation.provider.image}
                          alt={conversation.provider.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {conversation.unread && (
                          <span className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-white"></span>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-slate-900">{conversation.provider.name}</h3>
                          <span className="text-xs text-slate-500">{conversation.timestamp}</span>
                        </div>
                        <p className="text-sm text-slate-500">{conversation.provider.service}</p>
                        <p className={`text-sm mt-1 ${conversation.unread ? 'text-slate-900' : 'text-slate-500'}`}>
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Window */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ImageWithFallback
                          src={selectedConversation.provider.image}
                          alt={selectedConversation.provider.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-slate-900">{selectedConversation.provider.name}</h3>
                          <p className="text-sm text-slate-500">{selectedConversation.provider.service}</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-slate-600" />
                      </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {mockMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-2' : 'order-1'}`}>
                            <div
                              className={`rounded-2xl px-4 py-3 ${
                                message.isOwn
                                  ? 'bg-primary text-white'
                                  : 'bg-slate-100 text-slate-900'
                              }`}
                            >
                              <p>{message.text}</p>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 px-2">{message.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-slate-200">
                      <div className="flex items-center gap-3">
                        <Input
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 h-11 rounded-xl border-slate-300"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              setMessageText("");
                            }
                          }}
                        />
                        <Button className="bg-primary hover:bg-primary/90 rounded-xl px-6">
                          <Send className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-slate-500">Select a conversation to start messaging</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
}