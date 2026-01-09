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
  Lightbulb,
  ExternalLink
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
  sourceLinks?: { name: string; url: string }[];
}

interface ResearchWorkspaceProps {
  onCitationAdd: (citation: Citation) => void;
}

const suggestedQuestions = [
  "What notice is required to amend parking rules?",
  "Can the president call an emergency meeting?",
  "What are the requirements for a 209 letter?",
  "What is PAMco and Texas Property Owners Protection Act?",
];

const referenceSources = [
  { id: "ref-1", name: "AI and Community Associations: Legal Risks", url: "https://micondolaw.com/2025/07/10/ai-and-community-associations-legal-risks-fiduciary-duties-and-best-practices-for-condo-and-hoa-boards/", keywords: ["ai", "artificial intelligence", "fiduciary", "board member", "legal risk"] },
  { id: "ref-2", name: "Using AI as HOA Board Member", url: "https://gawthrop.com/what-can-happen-if-i-use-ai-as-a-condo-or-hoa-board-member/", keywords: ["ai", "board member", "condo", "hoa"] },
  { id: "ref-3", name: "Texas HOA Law: Chapter 209 Guide", url: "https://www.dallasfortworthassociationmanagement.com/blog/understanding-texas-hoa-law-a-practical-guide-to-chapter-209", keywords: ["chapter 209", "209", "texas hoa law", "property code"] },
  { id: "ref-4", name: "Texas Property Owners Protection Act", url: "https://www.pamcotx.com/texas-residential-property-owners-protection-act/", keywords: ["pamco", "protection act", "residential property", "texas"] },
  { id: "ref-5", name: "RAG for Legal Knowledge", url: "https://arxiv.org/html/2502.20364v1", keywords: ["rag", "retrieval", "legal", "ai", "llm"] },
  { id: "ref-6", name: "Law Firms Using RAG", url: "https://www.datategy.net/2025/04/14/how-law-firms-use-rag-to-boost-legal-research/", keywords: ["rag", "law firm", "legal research"] },
  { id: "ref-7", name: "AI-Powered HOA Management", url: "https://depextechnologies.com/blog/ai-powered-hoa-management-software-features-development-tips/", keywords: ["ai", "hoa management", "software"] },
  { id: "ref-8", name: "HOA Document Assistant Case Study", url: "https://firstlinesoftware.com/case-study/hoa-documents-talking-back/", keywords: ["hoa document", "azure", "ai search"] },
  { id: "ref-9", name: "RAG for Legal Work (Harvard)", url: "https://jolt.law.harvard.edu/digest/retrieval-augmented-generation-rag-towards-a-promising-llm-architecture-for-legal-work", keywords: ["rag", "harvard", "legal work", "llm"] },
  { id: "ref-10", name: "Restrictive Covenants Guide", url: "https://guides.sll.texas.gov/property-owners-associations/ccrs", keywords: ["restrictive covenant", "ccr", "property owners"] },
  { id: "ref-11", name: "Property Owners' Associations Info", url: "https://guides.sll.texas.gov/property-owners-associations", keywords: ["property owners", "association", "texas"] },
  { id: "ref-12", name: "Texas Property Code Title 11", url: "https://www.hopb.co/texas-property-code-title-11-restrictive-covenants", keywords: ["title 11", "restrictive covenant", "property code"] },
  { id: "ref-13", name: "Texas Homeowner Protection Act", url: "https://www.grahammanagementhouston.com/texas-homeowner-protection-act/", keywords: ["homeowner protection", "texas", "protection act"] },
  { id: "ref-14", name: "Dallas HOA Laws 2025", url: "https://www.steadily.com/blog/hoa-laws-regulations-dallas", keywords: ["dallas", "hoa laws", "2025", "regulations"] },
  { id: "ref-15", name: "Dallas HOA Best Practices", url: "https://www.properhoamanage.com/hoas-and-condominium-management-best-practices/", keywords: ["dallas", "best practices", "condo management"] },
  { id: "ref-16", name: "Texas HOA Rules Overview", url: "https://www.hoamanagement.com/hoa-state-laws/texas/", keywords: ["texas", "hoa rules", "state laws"] },
  { id: "ref-17", name: "City of Dallas HOANA", url: "https://dallascityhall.com/departments/pnv/pages/hoana.aspx", keywords: ["dallas", "hoana", "city", "planning"] },
  { id: "ref-18", name: "Modifying Restrictive Covenants", url: "http://wcglaw.net/wp-content/uploads/restrictive-covenants-modifying-and-updating.pdf", keywords: ["modify", "update", "restrictive covenant", "amend"] },
  { id: "ref-19", name: "Texas HOA Rules Guide", url: "https://www.fsresidential.com/texas/news-events/articles/establishing-hoa-rules-and-regulations-in-texas/", keywords: ["texas", "hoa rules", "regulations", "establishing"] },
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

  const findRelevantSources = (question: string): typeof referenceSources => {
    const lowerQ = question.toLowerCase();
    return referenceSources.filter(source => 
      source.keywords.some(kw => lowerQ.includes(kw))
    ).slice(0, 3);
  };

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
      const { content, citations, sourceLinks } = getAIResponse(text);
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content,
        citations,
        sourceLinks,
        type: "answer",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (question: string): { content: string; citations: string[]; sourceLinks?: { name: string; url: string }[] } => {
    const relevantSources = findRelevantSources(question);
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes("pamco") || lowerQ.includes("protection act")) {
      return {
        content: `**Texas Residential Property Owners Protection Act (Chapter 209)**

PAMco (Property Association Management Company) provides guidance on the Texas Residential Property Owners Protection Act, which is codified in **Chapter 209** of the Texas Property Code.

**Key Protections Include:**
- Homeowners must receive written notice before enforcement actions
- Right to a hearing before fines or suspension of rights
- Restrictions on foreclosure for unpaid assessments
- Requirements for open board meetings
- Access to association records

**Important Sections:**
- §209.006: Notice requirements before enforcement
- §209.007: Hearing rights for homeowners  
- §209.0051: Open meeting requirements

⚠️ **Compliance Note:** HOAs must strictly follow these procedures or risk having enforcement actions invalidated.

For detailed guidance, see the referenced sources in your Knowledge Base.`,
        citations: ["Texas Property Code §209", "PAMco Guidelines"],
        sourceLinks: [
          { name: "Texas Property Owners Protection Act", url: "https://www.pamcotx.com/texas-residential-property-owners-protection-act/" },
          { name: "Chapter 209 Guide", url: "https://www.dallasfortworthassociationmanagement.com/blog/understanding-texas-hoa-law-a-practical-guide-to-chapter-209" }
        ]
      };
    }
    
    if (lowerQ.includes("ai") && (lowerQ.includes("board") || lowerQ.includes("hoa") || lowerQ.includes("risk"))) {
      return {
        content: `**Using AI as an HOA Board Member: Considerations**

When HOA board members use AI tools, there are important legal and fiduciary considerations:

**Key Risks:**
- AI-generated advice may not account for your specific CC&Rs
- Fiduciary duty requires human judgment on governance decisions
- Privacy concerns with uploading homeowner data to AI systems
- Potential liability if AI recommendations violate state law

**Best Practices:**
1. Use AI as a research tool, not a decision-maker
2. Always verify AI responses against your governing documents
3. Consult your HOA attorney for legal interpretations
4. Document that AI was used as a research aid only

⚠️ **Important:** AI tools should supplement, not replace, proper legal counsel and board deliberation.

See the referenced sources for detailed guidance on AI use in community associations.`,
        citations: ["Fiduciary Duty Guidelines", "AI Best Practices"],
        sourceLinks: [
          { name: "AI and Community Associations: Legal Risks", url: "https://micondolaw.com/2025/07/10/ai-and-community-associations-legal-risks-fiduciary-duties-and-best-practices-for-condo-and-hoa-boards/" },
          { name: "Using AI as HOA Board Member", url: "https://gawthrop.com/what-can-happen-if-i-use-ai-as-a-condo-or-hoa-board-member/" }
        ]
      };
    }

    if (lowerQ.includes("dallas") && (lowerQ.includes("law") || lowerQ.includes("regulation") || lowerQ.includes("hoa"))) {
      return {
        content: `**Dallas HOA Laws and Regulations (2025)**

Dallas-area HOAs must comply with both Texas state law and local ordinances:

**State Requirements:**
- Texas Property Code Chapter 209 governs residential POAs
- Chapter 202 addresses restrictive covenant construction
- Chapter 207 covers reserve fund requirements

**Dallas-Specific Considerations:**
- City of Dallas HOANA (Homeowners Association Neighborhood Assistance)
- Local code compliance requirements
- Fair housing ordinances

**Best Practices for Dallas HOAs:**
1. Maintain current governing documents
2. Follow open meeting requirements
3. Provide proper notice for all actions
4. Keep detailed records of board decisions

See the Dallas-specific resources in your Knowledge Base for detailed local guidance.`,
        citations: ["Texas Property Code", "City of Dallas Guidelines"],
        sourceLinks: [
          { name: "Dallas HOA Laws 2025", url: "https://www.steadily.com/blog/hoa-laws-regulations-dallas" },
          { name: "City of Dallas HOANA", url: "https://dallascityhall.com/departments/pnv/pages/hoana.aspx" },
          { name: "Dallas HOA Best Practices", url: "https://www.properhoamanage.com/hoas-and-condominium-management-best-practices/" }
        ]
      };
    }

    if (lowerQ.includes("restrictive covenant") || lowerQ.includes("ccr") || lowerQ.includes("modify") || lowerQ.includes("amend covenant")) {
      return {
        content: `**Modifying Restrictive Covenants in Texas**

Amending or updating CC&Rs requires careful compliance with both your governing documents and state law:

**General Requirements:**
- Review your CC&Rs for amendment procedures
- Most require supermajority vote (often 67% or 75%)
- Some covenants may have sunset provisions

**Texas Property Code Requirements:**
- Title 11 governs restrictive covenants
- §202.004 addresses amendment procedures
- §209.0041 covers dedicatory instrument requirements

**Process Steps:**
1. Draft proposed amendments with legal counsel
2. Provide proper notice to all owners
3. Hold vote per your bylaws requirements
4. Record amended documents with county

⚠️ **Important:** Never attempt to modify CC&Rs without attorney review—improper amendments can be invalidated.`,
        citations: ["Texas Property Code Title 11", "CC&R Amendment Guidelines"],
        sourceLinks: [
          { name: "Modifying Restrictive Covenants (PDF)", url: "http://wcglaw.net/wp-content/uploads/restrictive-covenants-modifying-and-updating.pdf" },
          { name: "Restrictive Covenants Guide", url: "https://guides.sll.texas.gov/property-owners-associations/ccrs" }
        ]
      };
    }

    if (question.toLowerCase().includes("notice") || question.toLowerCase().includes("amend")) {
      const sourceLinks = relevantSources.length > 0 
        ? relevantSources.map(s => ({ name: s.name, url: s.url }))
        : undefined;
      
      return {
        content: `Based on your governing documents and Texas law:

**Your CC&Rs (Section 3.5)** require written notice 30 days before any meeting where rule amendments will be voted upon.

**Texas Property Code §209.0052** requires the association to give written notice of a proposed rule change to each owner before a meeting at which the proposed rule change will be considered.

⚠️ **Key Point:** Your CC&Rs' 30-day requirement is stricter than the state minimum, so the 30-day rule applies.

**Next Steps:**
1. Draft the proposed rule amendment
2. Prepare notice with specific rule text and meeting date
3. Distribute to all owners at least 30 days before meeting
4. Document delivery method for each owner`,
        citations: ["CC&Rs Section 3.5", "Texas Property Code §209.0052"],
        sourceLinks
      };
    }
    
    if (question.toLowerCase().includes("emergency") || question.toLowerCase().includes("meeting")) {
      return {
        content: `Regarding emergency meetings:

**Your Bylaws (Section 4.1)** state: "The president may call a special meeting upon 48 hours' notice..."

**Texas Property Code §209.0053** states: "Notice of meeting must be provided no less than 72 hours in advance..."

⚠️ **Potential Conflict:** Your bylaws say 48 hours, but state law requires 72 hours—**state law prevails**.

**Important:** Under Chapter 209.0053, boards can only call emergency meetings every 90 days for true emergencies.

**Recommendation:** Always provide at least 72 hours notice to remain compliant with state law.`,
        citations: ["Bylaws Section 4.1", "Texas Property Code §209.0053"]
      };
    }

    if (question.toLowerCase().includes("209") || question.toLowerCase().includes("letter")) {
      return {
        content: `A **Chapter 209 Letter** (also called a "209 Notice") is required before certain enforcement actions:

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
6. Contact information`,
        citations: ["Texas Property Code §209.006", "CC&Rs Section 8.3"],
        sourceLinks: [
          { name: "Chapter 209 Guide", url: "https://www.dallasfortworthassociationmanagement.com/blog/understanding-texas-hoa-law-a-practical-guide-to-chapter-209" }
        ]
      };
    }

    const defaultSourceLinks = relevantSources.length > 0 
      ? relevantSources.map(s => ({ name: s.name, url: s.url }))
      : undefined;

    return {
      content: `I've reviewed your question against your governing documents and Texas Property Code. 

Based on your **CC&Rs** and **Bylaws**, along with relevant sections of **Texas Property Code Chapters 201-209**, here's what I found:

This topic may require specific analysis of your documents. I recommend:
1. Uploading relevant sections of your CC&Rs
2. Specifying the exact situation or scenario
3. Consulting with your HOA attorney for legal interpretation

Would you like me to help you draft a research memo on this topic, or would you prefer to explore a specific document template?`,
      citations: ["CC&Rs Section 4.2", "Texas Property Code §209.0052"],
      sourceLinks: defaultSourceLinks
    };
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
                    ? "bg-amber-500 text-slate-900" 
                    : "bg-slate-800 border border-slate-700 shadow-sm"
                )}>
                  <div className={cn(
                    "prose prose-sm max-w-none",
                    message.role === "user" ? "" : "prose-invert"
                  )}>
                    {message.content.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i} className={cn("font-semibold", message.role === "assistant" ? "text-slate-100" : "text-slate-900")}>{line.replace(/\*\*/g, '')}</p>;
                      }
                      if (line.startsWith('⚠️')) {
                        return (
                          <div key={i} className="flex items-start gap-2 bg-amber-500/20 border border-amber-500/30 rounded-lg p-3 my-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span className="text-amber-300 text-sm">{line.replace('⚠️ ', '')}</span>
                          </div>
                        );
                      }
                      if (line.match(/^\d+\./)) {
                        return <li key={i} className={message.role === "assistant" ? "text-slate-300" : "text-slate-800"}>{line.replace(/^\d+\.\s*/, '')}</li>;
                      }
                      if (line.includes('**')) {
                        const parts = line.split(/\*\*(.*?)\*\*/g);
                        return (
                          <p key={i} className={message.role === "assistant" ? "text-slate-300" : "text-slate-800"}>
                            {parts.map((part, j) => 
                              j % 2 === 1 ? <strong key={j} className={message.role === "assistant" ? "text-slate-100" : "text-slate-900"}>{part}</strong> : part
                            )}
                          </p>
                        );
                      }
                      return line ? <p key={i} className={message.role === "assistant" ? "text-slate-300" : "text-slate-800"}>{line}</p> : null;
                    })}
                  </div>
                  
                  {message.citations && message.citations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-600/50">
                      {message.citations.map((citation, i) => (
                        <Badge 
                          key={i} 
                          variant="secondary" 
                          className="gap-1.5 text-xs cursor-pointer bg-slate-700 hover:bg-slate-600 text-slate-200"
                          data-testid={`citation-badge-${i}`}
                        >
                          {citation.includes("CC&R") ? <Book className="w-3 h-3" /> : <Scale className="w-3 h-3" />}
                          {citation}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {message.sourceLinks && message.sourceLinks.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-600/50">
                      <p className="text-xs text-slate-400 mb-2">Reference Sources:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.sourceLinks.map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {link.name}
                          </a>
                        ))}
                      </div>
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
              <div className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 shadow-sm">
                <div className="typing-indicator flex gap-1.5">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
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
