import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/Sidebar";
import { ResearchWorkspace } from "@/components/ResearchWorkspace";
import { DocumentDrafting } from "@/components/DocumentDrafting";
import { KnowledgeBase } from "@/components/KnowledgeBase";
import { Settings } from "@/components/Settings";
import { CitationsPanel } from "@/components/CitationsPanel";

export type ActiveSection = "research" | "drafting" | "knowledge" | "settings";

export interface Citation {
  id: string;
  source: string;
  section: string;
  content: string;
  type: "ccr" | "texas-code" | "policy" | "financial";
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("research");
  const [citations, setCitations] = useState<Citation[]>([
    {
      id: "1",
      source: "CC&Rs",
      section: "Section 4.2",
      content: "The Board shall provide written notice to all members at least 30 days prior to any meeting at which rule amendments will be voted upon...",
      type: "ccr"
    },
    {
      id: "2",
      source: "Texas Property Code",
      section: "§209.0052",
      content: "A property owners' association shall give written notice of a proposed rule change to each owner before a meeting at which the proposed rule change will be considered...",
      type: "texas-code"
    },
    {
      id: "3",
      source: "Board Policy",
      section: "Meeting Procedures",
      content: "Emergency meetings may be called by the President with 48 hours notice, subject to applicable Texas Property Code requirements...",
      type: "policy"
    }
  ]);
  const [showCitations, setShowCitations] = useState(true);

  const renderContent = () => {
    switch (activeSection) {
      case "research":
        return <ResearchWorkspace onCitationAdd={(c: Citation) => setCitations([...citations, c])} />;
      case "drafting":
        return <DocumentDrafting />;
      case "knowledge":
        return <KnowledgeBase />;
      case "settings":
        return <Settings />;
      default:
        return <ResearchWorkspace onCitationAdd={(c: Citation) => setCitations([...citations, c])} />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden" data-testid="app-container">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="flex-1 flex overflow-hidden">
        <div className={`flex-1 overflow-hidden transition-all duration-300 ${showCitations && activeSection === "research" ? "mr-0" : ""}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {activeSection === "research" && (
          <CitationsPanel 
            citations={citations} 
            isOpen={showCitations}
            onToggle={() => setShowCitations(!showCitations)}
          />
        )}
      </main>
    </div>
  );
}
