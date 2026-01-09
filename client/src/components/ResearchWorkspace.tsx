import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Sparkles, 
  Book, 
  Scale, 
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Citation } from "@/pages/Home";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: string[];
  type?: "answer" | "warning" | "suggestion";
  timestamp: Date;
}

interface ResearchWorkspaceProps {
  onCitationAdd: (citation: Citation) => void;
}

const suggestedQuestions = [
  "What notice is required to amend parking rules?",
  "Can the president call an emergency meeting?",
  "What are the requirements for a 209 letter?",
  "How to handle a homeowner refusing access?",
];

export function ResearchWorkspace({ onCitationAdd }: ResearchWorkspaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your HOA Governance AI Assistant. I can help you research governance questions, find relevant CC&R sections, and understand Texas Property Code requirements. What would you like to know?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (question?: string) => {
    const text = question || input.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(text),
        citations: ["CC&Rs Section 4.2", "Texas Property Code §209.0052"],
        type: "answer",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (question: string): string => {
    if (question.toLowerCase().includes("notice") || question.toLowerCase().includes("amend")) {
      return `Based on your governing documents and Texas law:

**Your CC&Rs (Section 3.5)** require written notice 30 days before any meeting where rule amendments will be voted upon.

**Texas Property Code §209.0052** requires the association to give written notice of a proposed rule change to each owner before a meeting at which the proposed rule change will be considered.

⚠️ **Key Point:** Your CC&Rs' 30-day requirement is stricter than the state minimum, so the 30-day rule applies.

**Next Steps:**
1. Draft the proposed rule amendment
2. Prepare notice with specific rule text and meeting date
3. Distribute to all owners at least 30 days before meeting
4. Document delivery method for each owner`;
    }
    
    if (question.toLowerCase().includes("emergency") || question.toLowerCase().includes("meeting")) {
      return `Regarding emergency meetings:

**Your Bylaws (Section 4.1)** state: "The president may call a special meeting upon 48 hours' notice..."

**Texas Property Code §209.0053** states: "Notice of meeting must be provided no less than 72 hours in advance..."

⚠️ **Potential Conflict:** Your bylaws say 48 hours, but state law requires 72 hours—**state law prevails**.

**Important:** Under Chapter 209.0053, boards can only call emergency meetings every 90 days for true emergencies.

**Recommendation:** Always provide at least 72 hours notice to remain compliant with state law.`;
    }

    if (question.toLowerCase().includes("209") || question.toLowerCase().includes("letter")) {
      return `A **Chapter 209 Letter** (also called a "209 Notice") is required before certain enforcement actions:

**Texas Property Code §209.006** requires:
- Written notice of the violation
- Description of the violation
- Opportunity to cure (typically 30 days)
- Right to request a hearing before the board

**Your CC&Rs (Section 8.3)** supplement this with:
- Notice must be sent via certified mail
- Homeowner has 14 days to request a hearing
- Board must hold hearing within 30 days of request

**Template Elements:**
1. Owner name and property address
2. Specific rule/covenant violated (with citation)
3. Description of the violation
4. Cure period and deadline
5. Hearing request instructions
6. Contact information`;
    }

    return `I've reviewed your question against your governing documents and Texas Property Code. 

Based on your **CC&Rs** and **Bylaws**, along with relevant sections of **Texas Property Code Chapters 201-209**, here's what I found:

This topic may require specific analysis of your documents. I recommend:
1. Uploading relevant sections of your CC&Rs
2. Specifying the exact situation or scenario
3. Consulting with your HOA attorney for legal interpretation

Would you like me to help you draft a research memo on this topic, or would you prefer to explore a specific document template?`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="h-full flex flex-col bg-background" data-testid="research-workspace">
      <header className="px-8 py-6 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">Research Workspace</h2>
            <p className="text-muted-foreground mt-1">Ask governance questions with cited answers</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5">
              <Clock className="w-3 h-3" />
              3 queries today
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex gap-4",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
                data-testid={`message-${message.id}`}
              >
                {message.role === "assistant" && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shrink-0 shadow-md">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                )}
                
                <div className={cn(
                  "rounded-2xl px-5 py-4 max-w-[85%]",
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-card border border-border shadow-sm"
                )}>
                  <div className={cn(
                    "prose prose-sm max-w-none",
                    message.role === "user" ? "prose-invert" : ""
                  )}>
                    {message.content.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i} className="font-semibold text-foreground">{line.replace(/\*\*/g, '')}</p>;
                      }
                      if (line.startsWith('⚠️')) {
                        return (
                          <div key={i} className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 my-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <span className="text-amber-700 dark:text-amber-400 text-sm">{line.replace('⚠️ ', '')}</span>
                          </div>
                        );
                      }
                      if (line.match(/^\d+\./)) {
                        return <li key={i} className="text-foreground/80">{line.replace(/^\d+\.\s*/, '')}</li>;
                      }
                      if (line.includes('**')) {
                        const parts = line.split(/\*\*(.*?)\*\*/g);
                        return (
                          <p key={i} className="text-foreground/80">
                            {parts.map((part, j) => 
                              j % 2 === 1 ? <strong key={j} className="text-foreground">{part}</strong> : part
                            )}
                          </p>
                        );
                      }
                      return line ? <p key={i} className="text-foreground/80">{line}</p> : null;
                    })}
                  </div>
                  
                  {message.citations && message.citations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
                      {message.citations.map((citation, i) => (
                        <Badge 
                          key={i} 
                          variant="secondary" 
                          className="gap-1.5 text-xs cursor-pointer hover:bg-secondary/80"
                          data-testid={`citation-badge-${i}`}
                        >
                          {citation.includes("CC&R") ? <Book className="w-3 h-3" /> : <Scale className="w-3 h-3" />}
                          {citation}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 shadow-md">
                    <span className="text-sm font-semibold text-slate-900">You</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div className="bg-card border border-border rounded-2xl px-5 py-4 shadow-sm">
                <div className="typing-indicator flex gap-1.5">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full"></span>
                  <span className="w-2 h-2 bg-muted-foreground rounded-full"></span>
                  <span className="w-2 h-2 bg-muted-foreground rounded-full"></span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto mt-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">Suggested questions</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {suggestedQuestions.map((question, i) => (
                <button
                  key={i}
                  onClick={() => handleSubmit(question)}
                  className="text-left p-4 rounded-xl border border-border bg-card hover:bg-accent/5 hover:border-accent/30 transition-all duration-200 group"
                  data-testid={`suggested-question-${i}`}
                >
                  <span className="text-sm text-foreground/80 group-hover:text-foreground">{question}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="border-t border-border bg-card/50 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-3">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a governance question..."
                className="min-h-[56px] max-h-[200px] resize-none pr-12 rounded-xl border-border bg-background"
                data-testid="research-input"
              />
            </div>
            <Button 
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isTyping}
              className="h-14 w-14 rounded-xl bg-primary hover:bg-primary/90 shadow-lg"
              data-testid="send-button"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Responses are for research purposes only. Consult your HOA attorney for legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
