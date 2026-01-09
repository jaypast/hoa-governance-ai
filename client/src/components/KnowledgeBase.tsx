import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Folder, 
  FileText, 
  Scale, 
  Building2,
  ChevronRight,
  ChevronDown,
  Search,
  Upload,
  Calendar,
  Eye,
  Download,
  ExternalLink,
  BookOpen,
  Link2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  name: string;
  type: "pdf" | "docx" | "xlsx" | "link";
  uploadDate: string;
  sections?: number;
  url?: string;
  source?: string;
}

interface FolderType {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  documents: Document[];
  description: string;
}

const folders: FolderType[] = [
  {
    id: "hoa-docs",
    name: "Your HOA Documents",
    icon: Building2,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    description: "CC&Rs, bylaws, and policies",
    documents: [
      { id: "1", name: "CC&Rs - Oakwood Estates (2023)", type: "pdf", uploadDate: "Dec 15, 2025", sections: 14 },
      { id: "2", name: "Bylaws - Amended 2024", type: "pdf", uploadDate: "Jan 3, 2025", sections: 8 },
      { id: "3", name: "Architectural Guidelines v3", type: "pdf", uploadDate: "Nov 20, 2024", sections: 12 },
      { id: "4", name: "Board Meeting Minutes (2025)", type: "docx", uploadDate: "Jan 8, 2026" },
      { id: "5", name: "Annual Budget 2026", type: "xlsx", uploadDate: "Dec 1, 2025" },
    ]
  },
  {
    id: "texas-code",
    name: "Texas Property Code",
    icon: Scale,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    description: "Chapters 201-209",
    documents: [
      { id: "6", name: "Chapter 201 - General Provisions", type: "pdf", uploadDate: "System", sections: 5 },
      { id: "7", name: "Chapter 202 - Construction & Enforcement", type: "pdf", uploadDate: "System", sections: 8 },
      { id: "8", name: "Chapter 207 - Reserve Funds", type: "pdf", uploadDate: "System", sections: 4 },
      { id: "9", name: "Chapter 209 - Residential POA", type: "pdf", uploadDate: "System", sections: 22 },
    ]
  },
  {
    id: "dallas-ref",
    name: "Dallas Reference Materials",
    icon: Building2,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    description: "Local ordinances & guidelines",
    documents: [
      { id: "10", name: "Fair Housing Guidelines", type: "pdf", uploadDate: "System", sections: 6 },
      { id: "11", name: "Dallas Code Compliance Reference", type: "pdf", uploadDate: "System", sections: 10 },
    ]
  },
  {
    id: "reference-sources",
    name: "Reference Sources",
    icon: BookOpen,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    description: "External articles, guides & research",
    documents: [
      { 
        id: "ref-1", 
        name: "AI and Community Associations: Legal Risks, Fiduciary Duties, and Best Practices", 
        type: "link", 
        uploadDate: "External", 
        url: "https://micondolaw.com/2025/07/10/ai-and-community-associations-legal-risks-fiduciary-duties-and-best-practices-for-condo-and-hoa-boards/",
        source: "MI Condo Law"
      },
      { 
        id: "ref-2", 
        name: "What Can Happen If I Use AI as a Condo or HOA Board Member?", 
        type: "link", 
        uploadDate: "External", 
        url: "https://gawthrop.com/what-can-happen-if-i-use-ai-as-a-condo-or-hoa-board-member/",
        source: "Gawthrop Law"
      },
      { 
        id: "ref-3", 
        name: "Understanding Texas HOA Law: A Practical Guide to Chapter 209", 
        type: "link", 
        uploadDate: "External", 
        url: "https://www.dallasfortworthassociationmanagement.com/blog/understanding-texas-hoa-law-a-practical-guide-to-chapter-209",
        source: "DFW Association Management"
      },
      { 
        id: "ref-4", 
        name: "Texas Residential Property Owners Protection Act", 
        type: "link", 
        uploadDate: "External", 
        url: "https://www.pamcotx.com/texas-residential-property-owners-protection-act/",
        source: "PAMco"
      },
      { 
        id: "ref-5", 
        name: "Bridging Legal Knowledge and AI: Retrieval-Augmented Generation", 
        type: "link", 
        uploadDate: "External", 
        url: "https://arxiv.org/html/2502.20364v1",
        source: "arXiv"
      },
      { 
        id: "ref-6", 
        name: "How Law Firms Use RAG to Boost Legal Research", 
        type: "link", 
        uploadDate: "External", 
        url: "https://www.datategy.net/2025/04/14/how-law-firms-use-rag-to-boost-legal-research/",
        source: "Datategy"
      },
      { 
        id: "ref-7", 
        name: "AI-Powered HOA Management Software: Features & Development Tips", 
        type: "link", 
        uploadDate: "External", 
        url: "https://depextechnologies.com/blog/ai-powered-hoa-management-software-features-development-tips/",
        source: "Depex Technologies"
      },
      { 
        id: "ref-8", 
        name: "Azure AI Search and HOA Document Assistant - Case Study", 
        type: "link", 
        uploadDate: "External", 
        url: "https://firstlinesoftware.com/case-study/hoa-documents-talking-back/",
        source: "First Line Software"
      },
      { 
        id: "ref-9", 
        name: "RAG: Towards a Promising LLM Architecture for Legal Work", 
        type: "link", 
        uploadDate: "External", 
        url: "https://jolt.law.harvard.edu/digest/retrieval-augmented-generation-rag-towards-a-promising-llm-architecture-for-legal-work",
        source: "Harvard JOLT"
      },
      { 
        id: "ref-10", 
        name: "Restrictive Covenants - Property Owners' Associations Guide", 
        type: "link", 
        uploadDate: "External", 
        url: "https://guides.sll.texas.gov/property-owners-associations/ccrs",
        source: "Texas State Law Library"
      },
      { 
        id: "ref-11", 
        name: "General Information - Property Owners' Associations", 
        type: "link", 
        uploadDate: "External", 
        url: "https://guides.sll.texas.gov/property-owners-associations",
        source: "Texas State Law Library"
      },
      { 
        id: "ref-12", 
        name: "Texas Property Code, Title 11, Restrictive Covenants", 
        type: "link", 
        uploadDate: "External", 
        url: "https://www.hopb.co/texas-property-code-title-11-restrictive-covenants",
        source: "HOPB"
      },
      { 
        id: "ref-13", 
        name: "A Closer Look at the Texas Homeowner Protection Act", 
        type: "link", 
        uploadDate: "External", 
        url: "https://www.grahammanagementhouston.com/texas-homeowner-protection-act/",
        source: "Graham Management"
      },
      { 
        id: "ref-14", 
        name: "HOA Laws and Regulations in Dallas, TX in 2025", 
        type: "link", 
        uploadDate: "External", 
        url: "https://www.steadily.com/blog/hoa-laws-regulations-dallas",
        source: "Steadily"
      },
      { 
        id: "ref-15", 
        name: "Dallas HOA & Condo Management Best Practices", 
        type: "link", 
        uploadDate: "External", 
        url: "https://www.properhoamanage.com/hoas-and-condominium-management-best-practices/",
        source: "Proper HOA Manage"
      },
      { 
        id: "ref-16", 
        name: "Texas HOA Laws | Homeowner Association Rules", 
        type: "link", 
        uploadDate: "External", 
        url: "https://www.hoamanagement.com/hoa-state-laws/texas/",
        source: "HOA Management"
      },
      { 
        id: "ref-17", 
        name: "Planning & Development HOANA - City of Dallas", 
        type: "link", 
        uploadDate: "External", 
        url: "https://dallascityhall.com/departments/pnv/pages/hoana.aspx",
        source: "City of Dallas"
      },
      { 
        id: "ref-18", 
        name: "Restrictive Covenants: Modifying and Updating (PDF)", 
        type: "link", 
        uploadDate: "External", 
        url: "http://wcglaw.net/wp-content/uploads/restrictive-covenants-modifying-and-updating.pdf",
        source: "WCG Law"
      },
      { 
        id: "ref-19", 
        name: "Texas HOA Rules: Everything You Need to Know", 
        type: "link", 
        uploadDate: "External", 
        url: "https://www.fsresidential.com/texas/news-events/articles/establishing-hoa-rules-and-regulations-in-texas/",
        source: "FirstService Residential"
      },
    ]
  },
];

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["hoa-docs"]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId]
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "pdf": return "text-red-500 bg-red-500/10";
      case "docx": return "text-blue-500 bg-blue-500/10";
      case "xlsx": return "text-emerald-500 bg-emerald-500/10";
      case "link": return "text-cyan-500 bg-cyan-500/10";
      default: return "text-gray-500 bg-gray-500/10";
    }
  };

  const handleDocClick = (doc: Document) => {
    if (doc.type === "link" && doc.url) {
      window.open(doc.url, "_blank", "noopener,noreferrer");
    } else {
      setSelectedDoc(doc);
    }
  };

  const filteredFolders = folders.map(folder => ({
    ...folder,
    documents: folder.documents.filter(doc => 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.source?.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(folder => 
    searchQuery === "" || folder.documents.length > 0
  );

  return (
    <div className="h-full flex flex-col bg-background" data-testid="knowledge-base">
      <header className="px-8 py-6 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">Knowledge Base</h2>
            <p className="text-muted-foreground mt-1">Browse and manage your document library</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64 rounded-lg"
                data-testid="document-search"
              />
            </div>
            <Button className="gap-2" data-testid="upload-document">
              <Upload className="w-4 h-4" />
              Upload
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <ScrollArea className="flex-1 p-8">
          <div className="space-y-4 max-w-3xl">
            {filteredFolders.map((folder, folderIndex) => {
              const isExpanded = expandedFolders.includes(folder.id);
              const FolderIcon = folder.icon;

              return (
                <motion.div
                  key={folder.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: folderIndex * 0.05 }}
                >
                  <button
                    onClick={() => toggleFolder(folder.id)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent/5 transition-colors"
                    data-testid={`folder-${folder.id}`}
                  >
                    <div className={cn("p-2.5 rounded-lg", folder.bg)}>
                      <FolderIcon className={cn("w-5 h-5", folder.color)} />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-medium text-foreground">{folder.name}</h3>
                      <p className="text-sm text-muted-foreground">{folder.description}</p>
                    </div>
                    <Badge variant="secondary" className="mr-2">
                      {folder.documents.length} {folder.id === "reference-sources" ? "sources" : "docs"}
                    </Badge>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-2 ml-6 pl-6 border-l-2 border-border space-y-2"
                    >
                      {folder.documents.map((doc, docIndex) => (
                        <motion.button
                          key={doc.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: docIndex * 0.03 }}
                          onClick={() => handleDocClick(doc)}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors group",
                            selectedDoc?.id === doc.id && doc.type !== "link"
                              ? "bg-accent/10 border border-accent/30"
                              : "hover:bg-muted/50"
                          )}
                          data-testid={`doc-${doc.id}`}
                        >
                          <div className={cn("p-1.5 rounded", getTypeColor(doc.type))}>
                            {doc.type === "link" ? (
                              <Link2 className="w-4 h-4" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate flex items-center gap-2">
                              {doc.name}
                              {doc.type === "link" && (
                                <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {doc.source ? (
                                <span className="text-xs text-muted-foreground">{doc.source}</span>
                              ) : (
                                <>
                                  <span className="text-xs text-muted-foreground uppercase">{doc.type}</span>
                                  {doc.sections && (
                                    <span className="text-xs text-muted-foreground">• {doc.sections} sections</span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          {doc.type !== "link" && (
                            <span className="text-xs text-muted-foreground shrink-0">{doc.uploadDate}</span>
                          )}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>

        {selectedDoc && selectedDoc.type !== "link" && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 380, opacity: 1 }}
            className="border-l border-border bg-card flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-border">
              <Badge className={cn("mb-3", getTypeColor(selectedDoc.type))}>
                {selectedDoc.type.toUpperCase()}
              </Badge>
              <h3 className="font-display text-lg font-semibold text-foreground">
                {selectedDoc.name}
              </h3>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Uploaded {selectedDoc.uploadDate}</span>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                {selectedDoc.sections && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Document Structure</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedDoc.sections} indexed sections available for AI search
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Authority Level</h4>
                  <Badge variant="outline" className="text-xs">
                    {selectedDoc.uploadDate === "System" ? "Reference Material" : "Primary Document"}
                  </Badge>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    This document is indexed and searchable through the Research Workspace. The AI agent will cite specific sections when relevant.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border space-y-3">
              <Button className="w-full gap-2" data-testid="view-document">
                <Eye className="w-4 h-4" />
                View Document
              </Button>
              <Button variant="outline" className="w-full gap-2" data-testid="download-document">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </motion.aside>
        )}
      </div>
    </div>
  );
}
