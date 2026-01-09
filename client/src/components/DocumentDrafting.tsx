import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Scale, 
  DollarSign, 
  MessageSquare, 
  Search,
  Clock,
  ChevronRight,
  Sparkles,
  Download,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  popularity: "high" | "medium" | "low";
  lastUsed?: string;
}

const templates: Template[] = [
  { id: "1", name: "Rule Amendment Notice", description: "Compliant with Chapter 209 notice requirements", category: "governance", popularity: "high", lastUsed: "2 days ago" },
  { id: "2", name: "Board Resolution", description: "Template with recitals and decision sections", category: "governance", popularity: "high" },
  { id: "3", name: "209 Violation Letter", description: "Required notice before enforcement actions", category: "governance", popularity: "high", lastUsed: "1 week ago" },
  { id: "4", name: "Architectural Guidelines", description: "ARC review committee guidelines draft", category: "governance", popularity: "medium" },
  { id: "5", name: "Annual Budget Narrative", description: "Owner-friendly budget explanation", category: "financial", popularity: "high", lastUsed: "1 month ago" },
  { id: "6", name: "Dues Increase Memo", description: "Justification for assessment changes", category: "financial", popularity: "medium" },
  { id: "7", name: "Special Assessment", description: "Emergency funding justification", category: "financial", popularity: "medium" },
  { id: "8", name: "Reserve Funding Plan", description: "Long-term reserve study summary", category: "financial", popularity: "low" },
  { id: "9", name: "Owner FAQ", description: "Common questions with CC&R references", category: "communication", popularity: "medium" },
  { id: "10", name: "Meeting Agenda", description: "Auto-includes recurring items", category: "communication", popularity: "high", lastUsed: "3 days ago" },
  { id: "11", name: "Board Minutes", description: "Template for secretary to complete", category: "communication", popularity: "high" },
  { id: "12", name: "Compliance Memo", description: "Situation analysis with options", category: "research", popularity: "medium" },
];

const categoryConfig = {
  governance: { icon: Scale, label: "Governance & Policy", color: "text-blue-500", bg: "bg-blue-500/10" },
  financial: { icon: DollarSign, label: "Financial", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  communication: { icon: MessageSquare, label: "Communications", color: "text-purple-500", bg: "bg-purple-500/10" },
  research: { icon: Search, label: "Research Memos", color: "text-amber-500", bg: "bg-amber-500/10" },
};

export function DocumentDrafting() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === "all" || t.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col bg-background" data-testid="document-drafting">
      <header className="px-8 py-6 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">Document Drafting</h2>
            <p className="text-muted-foreground mt-1">Templates for policies, financials, and communications</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64 rounded-lg"
                data-testid="template-search"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 overflow-y-auto p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 p-1 bg-muted/50 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg">All Templates</TabsTrigger>
              <TabsTrigger value="governance" className="rounded-lg">Governance</TabsTrigger>
              <TabsTrigger value="financial" className="rounded-lg">Financial</TabsTrigger>
              <TabsTrigger value="communication" className="rounded-lg">Communications</TabsTrigger>
              <TabsTrigger value="research" className="rounded-lg">Research</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template, index) => {
                  const config = categoryConfig[template.category as keyof typeof categoryConfig];
                  const Icon = config.icon;

                  return (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <button
                        onClick={() => setSelectedTemplate(template)}
                        className={cn(
                          "w-full text-left p-5 rounded-xl border bg-card hover:shadow-md transition-all duration-200 group",
                          selectedTemplate?.id === template.id 
                            ? "border-accent ring-2 ring-accent/20" 
                            : "border-border hover:border-accent/30"
                        )}
                        data-testid={`template-${template.id}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={cn("p-2.5 rounded-lg shrink-0", config.bg)}>
                            <Icon className={cn("w-5 h-5", config.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-foreground truncate">{template.name}</h3>
                              {template.popularity === "high" && (
                                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                            {template.lastUsed && (
                              <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground/70">
                                <Clock className="w-3 h-3" />
                                <span>Last used {template.lastUsed}</span>
                              </div>
                            )}
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors shrink-0" />
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {selectedTemplate && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            className="border-l border-border bg-card flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-border">
              <Badge variant="secondary" className="mb-3">
                {categoryConfig[selectedTemplate.category as keyof typeof categoryConfig].label}
              </Badge>
              <h3 className="font-display text-xl font-semibold text-foreground">
                {selectedTemplate.name}
              </h3>
              <p className="text-muted-foreground mt-2">{selectedTemplate.description}</p>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Template includes:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      CC&R section references
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      Texas Property Code citations
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      Compliance checkpoints
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      Attorney review markers
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    All documents are marked as drafts requiring board approval and attorney review.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border space-y-3">
              <Button className="w-full gap-2" data-testid="start-draft">
                <FileText className="w-4 h-4" />
                Start Draft
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2" data-testid="preview-template">
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
                <Button variant="outline" className="flex-1 gap-2" data-testid="download-template">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </div>
    </div>
  );
}
