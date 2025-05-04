
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Send } from "lucide-react";
import { chatConversation, heritageSites } from "@/data/mockData";
import BackButton from "@/components/BackButton";

const Chatbot = () => {
  const { id } = useParams<{ id: string }>();
  const site = heritageSites.find(site => site.id === id);
  const initialMessages = chatConversation[id || "1"] || [];
  
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      sender: "user" as const,
      text: input,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMsg]);
    setInput("");
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: "bot" as const,
        text: `Thank you for your message about ${site?.title || 'this heritage site'}. How else can I assist you?`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-heritage-primary p-4 flex items-center shadow-sm">
        <BackButton className="mr-3" />
        <h1 className="text-xl font-bold text-white">AI Chat</h1>
        {site && <span className="ml-2 text-white/80 text-sm">- {site.title}</span>}
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`rounded-lg p-4 max-w-[85%] shadow-sm ${
                  message.sender === "user" 
                    ? "bg-heritage-primary text-white rounded-tr-none" 
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                }`}
              >
                <p>{message.text}</p>
                {message.image && (
                  <img 
                    src={message.image} 
                    alt="Heritage site" 
                    className="mt-2 rounded-md w-full h-48 object-cover"
                  />
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form 
        onSubmit={handleSubmit}
        className="border-t border-gray-200 bg-white p-4"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 py-3 px-4 rounded-full border border-gray-300 focus:outline-none focus:border-heritage-primary"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className={`rounded-full w-12 h-12 flex items-center justify-center ${
              input.trim() 
                ? "bg-heritage-primary text-white" 
                : "bg-gray-200 text-gray-400"
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
