
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Send } from "lucide-react";
import BackButton from "@/components/BackButton";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import TranslationWrapper from "@/components/TranslationWrapper";
import { createChatMessage } from "@/services/apiService";

interface Site {
  id: string;
  title: string;
}

// Sample data for sites
const sites: Record<string, Site> = {
  "1": { id: "1", title: "Fort St. George" },
  "2": { id: "2", title: "Mahabalipuram" },
  "3": { id: "3", title: "Kapaleeshwarar Temple" },
};

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  image?: string;
}

const Chatbot = () => {
  const { id } = useParams<{ id: string }>();
  const site = sites[id || "1"];
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { language, translate } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const labels = {
    chatTitle: "AI Chat",
    inputPlaceholder: "Ask me about this heritage site...",
    aiThinking: "AI is thinking...",
    failedResponse: "Failed to get response from AI",
    errorMessage: "Sorry, I'm having trouble responding right now. Please try again later."
  };

  // Scroll to bottom of chat whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message
    addWelcomeMessage();
  }, [site, language]);

  const addWelcomeMessage = async () => {
    // Construct welcome message
    let welcomeText = `Welcome to the heritage AI chat. I can answer questions about ${site?.title || "heritage sites"}. What would you like to know?`;
    
    // Translate if not English
    if (language !== "English") {
      welcomeText = await translate(welcomeText);
    }

    const welcomeMsg: Message = {
      id: "welcome",
      sender: "bot",
      text: welcomeText,
      timestamp: new Date()
    };
    
    setMessages([welcomeMsg]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isProcessing) return;
    setIsProcessing(true);
    
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    const userQuestion = input;
    setInput("");
    
    // Call the chatbot API
    try {
      const response = await createChatMessage(userQuestion, site?.title || "heritage site");
      
      if (response.success && response.data) {
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: response.data,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMsg]);
      } else {
        // Translate error message
        const errorMessage = await translate(labels.errorMessage);
        
        toast.error(await translate(labels.failedResponse));
        
        // Add error message
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: errorMessage,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (error) {
      console.error("Error getting chat response:", error);
      
      // Translate error message
      const errorMessage = await translate(labels.errorMessage);
      
      toast.error(await translate(labels.failedResponse));
      
      // Add error message
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: errorMessage,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <TranslationWrapper
      textContent={labels}
      render={(translatedLabels) => (
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <div className="bg-heritage-primary p-4 flex items-center shadow-sm">
            <BackButton className="mr-3" />
            <h1 className="text-xl font-bold text-white">{translatedLabels.chatTitle}</h1>
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
                placeholder={translatedLabels.inputPlaceholder}
                className="flex-1 py-3 px-4 rounded-full border border-gray-300 focus:outline-none focus:border-heritage-primary"
                disabled={isProcessing}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isProcessing}
                className={`rounded-full w-12 h-12 flex items-center justify-center ${
                  input.trim() && !isProcessing
                    ? "bg-heritage-primary text-white" 
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                <Send size={20} />
              </button>
            </div>
            {isProcessing && (
              <p className="text-center text-xs text-gray-500 mt-2">{translatedLabels.aiThinking}</p>
            )}
          </form>
        </div>
      )}
    />
  );
};

export default Chatbot;
