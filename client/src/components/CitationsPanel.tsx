import { motion, AnimatePresence } from "framer-motion";
import { 
  Book, 
  Scale, 
  FileText, 
  DollarSign,
  ChevronRight,
  ExternalLink,
  Clock,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Citation } from "@/pages/Home";

interface CitationsPanelProps {
  citations: Citation[];
  isOpen: boolean;
  onToggle: () => void;
}

const typeConfig = {
  ccr: { icon: Book, label: "CC&Rs", color: "text-blue-500", bg: "bg-blue-500/10" },
  "texas-code": { icon: Scale, label: "Texas Code", color: "text-amber-500", bg: "bg-amber-500/10" },
  policy: { icon: FileText, label: "Policy", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  financial: { icon: DollarSign, label: "Financial", color: "text-purple-500", bg: "bg-purple-500/10" },
};

export function CitationsPanel({ citations, isOpen, onToggle }: CitationsPanelProps) {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 380, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-l border-border bg-card flex flex-col h-full overflow-hidden"
            data-testid="citations-panel"
          >
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold text-foreground">Citations & Sources</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {citations.length} sources referenced
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onToggle}
                className="rounded-lg"
                data-testid="close-citations"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {citations.map((citation, index) => {
                  const config = typeConfig[citation.type];
                  const Icon = config.icon;
                  
                  return (
                    <motion.div
                      key={citation.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      <div 
                        className="p-4 rounded-xl border border-border bg-background hover:border-accent/30 hover:shadow-sm transition-all duration-200 cursor-pointer"
                        data-testid={`citation-${citation.id}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn("p-2 rounded-lg shrink-0", config.bg)}>
                            <Icon className={cn("w-4 h-4", config.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm text-foreground">{citation.source}</span>
                              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                {citation.section}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                              {citation.content}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors shrink-0 mt-1" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-muted/30">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Clock className="w-3.5 h-3.5" />
                <span>Last updated: Jan 9, 2026</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full gap-2 rounded-lg"
                data-testid="export-session"
              >
                <ExternalLink className="w-4 h-4" />
                Export Research Session
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-card border border-border rounded-lg shadow-md hover:shadow-lg transition-shadow"
          data-testid="open-citations"
        >
          <Book className="w-5 h-5 text-muted-foreground" />
        </motion.button>
      )}
    </>
  );
}
