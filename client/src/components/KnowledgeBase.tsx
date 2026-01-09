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
  Link2,
  Trash2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ObjectUploader } from "@/components/ObjectUploader";

interface Document {
  id: string;
  name: string;
  type: "pdf" | "docx" | "xlsx" | "link";
  addedDate: string;
  sections?: number;
  url?: string;
  source?: string;
  fileUrl?: string;
  content?: string;
}

interface FolderType {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  documents: Document[];
  description: string;
  editable?: boolean;
}

const sampleDocContent = {
  "1": `CC&Rs - Oakwood Estates HOA (2023)

DECLARATION OF COVENANTS, CONDITIONS AND RESTRICTIONS

ARTICLE 1: DEFINITIONS
1.1 "Association" means Oakwood Estates Homeowners Association, Inc.
1.2 "Common Area" means all real property owned by the Association...
1.3 "Lot" means any plot of land shown on any recorded subdivision map...

ARTICLE 2: PROPERTY RIGHTS
2.1 Owners' Easements of Enjoyment...
2.2 Delegation of Use...

ARTICLE 3: MEMBERSHIP AND VOTING RIGHTS
3.1 Every owner of a Lot shall be a member of the Association...
3.5 Written notice 30 days before any meeting where rule amendments will be voted upon...

ARTICLE 4: COVENANT FOR MAINTENANCE ASSESSMENTS
4.1 Creation of the Lien and Personal Obligation of Assessments...
4.2 Purpose of Assessments...

[Document continues with 14 sections...]

---
This is a sample preview. Upload your actual CC&Rs for full functionality.`,
  "2": `Bylaws - Oakwood Estates HOA (Amended 2024)

ARTICLE I: NAME AND LOCATION
The name of the corporation is Oakwood Estates Homeowners Association, Inc.

ARTICLE II: DEFINITIONS
(As defined in the Declaration of Covenants, Conditions and Restrictions)

ARTICLE III: MEETING OF MEMBERS
3.1 Annual Meeting...
3.2 Special Meetings...

ARTICLE IV: BOARD OF DIRECTORS
4.1 Number and Term...
4.2 Powers and Duties...
4.3 Emergency Meetings: The president may call a special meeting upon 48 hours' notice...

[Document continues with 8 sections...]

---
This is a sample preview.`,
  "4": `Board Meeting Minutes - January 8, 2025

OAKWOOD ESTATES HOMEOWNERS ASSOCIATION
BOARD OF DIRECTORS MEETING

DATE: January 8, 2025
TIME: 7:00 PM
LOCATION: Community Center, 123 Oak Street

ATTENDEES:
- Sarah Johnson, President
- Michael Chen, Treasurer  
- Lisa Rodriguez, Secretary

AGENDA:
1. Call to Order
2. Approval of Previous Minutes
3. Financial Report
4. Old Business
5. New Business
6. Homeowner Forum
7. Adjournment

MINUTES:
The meeting was called to order at 7:02 PM by President Sarah Johnson...

---
This is a sample preview.`,
};

const initialFolders: FolderType[] = [
  {
    id: "hoa-docs",
    name: "Your HOA Documents",
    icon: Building2,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    description: "CC&Rs, bylaws, and policies",
    editable: true,
    documents: [
      { id: "1", name: "CC&Rs - Oakwood Estates (2023)", type: "pdf", addedDate: "Dec 15, 2025", sections: 14 },
      { id: "2", name: "Bylaws - Amended 2024", type: "pdf", addedDate: "Jan 3, 2025", sections: 8 },
      { id: "3", name: "Architectural Guidelines v3", type: "pdf", addedDate: "Nov 20, 2024", sections: 12 },
      { id: "4", name: "Board Meeting Minutes (2025)", type: "docx", addedDate: "Jan 8, 2026" },
      { id: "5", name: "Annual Budget 2026", type: "xlsx", addedDate: "Dec 1, 2025" },
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
      { id: "6", name: "Chapter 201 - General Provisions", type: "pdf", addedDate: "Jan 1, 2025", sections: 5, url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.201.htm" },
      { id: "7", name: "Chapter 202 - Construction & Enforcement", type: "pdf", addedDate: "Jan 1, 2025", sections: 8, url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.202.htm" },
      { id: "8", name: "Chapter 207 - Reserve Funds", type: "pdf", addedDate: "Jan 1, 2025", sections: 4, url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.207.htm" },
      { id: "9", name: "Chapter 209 - Residential POA", type: "pdf", addedDate: "Jan 1, 2025", sections: 22, url: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.209.htm" },
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
      { id: "10", name: "Fair Housing Guidelines", type: "pdf", addedDate: "Jan 1, 2025", sections: 6 },
      { id: "11", name: "Dallas Code Compliance Reference", type: "pdf", addedDate: "Jan 1, 2025", sections: 10 },
    ]
  },
  {
    id: "reference-sources",
    name: "Reference Sources",
    icon: BookOpen,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    description: "External articles, guides & research",
    editable: true,
    documents: [
      { id: "ref-1", name: "AI and Community Associations: Legal Risks, Fiduciary Duties, and Best Practices", type: "link", addedDate: "Jan 9, 2026", url: "https://micondolaw.com/2025/07/10/ai-and-community-associations-legal-risks-fiduciary-duties-and-best-practices-for-condo-and-hoa-boards/", source: "MI Condo Law" },
      { id: "ref-2", name: "What Can Happen If I Use AI as a Condo or HOA Board Member?", type: "link", addedDate: "Jan 9, 2026", url: "https://gawthrop.com/what-can-happen-if-i-use-ai-as-a-condo-or-hoa-board-member/", source: "Gawthrop Law" },
      { id: "ref-3", name: "Understanding Texas HOA Law: A Practical Guide to Chapter 209", type: "link", addedDate: "Jan 9, 2026", url: "https://www.dallasfortworthassociationmanagement.com/blog/understanding-texas-hoa-law-a-practical-guide-to-chapter-209", source: "DFW Association Management" },
      { id: "ref-4", name: "Texas Residential Property Owners Protection Act", type: "link", addedDate: "Jan 9, 2026", url: "https://www.pamcotx.com/texas-residential-property-owners-protection-act/", source: "PAMco" },
      { id: "ref-5", name: "Bridging Legal Knowledge and AI: Retrieval-Augmented Generation", type: "link", addedDate: "Jan 9, 2026", url: "https://arxiv.org/html/2502.20364v1", source: "arXiv" },
      { id: "ref-6", name: "How Law Firms Use RAG to Boost Legal Research", type: "link", addedDate: "Jan 9, 2026", url: "https://www.datategy.net/2025/04/14/how-law-firms-use-rag-to-boost-legal-research/", source: "Datategy" },
      { id: "ref-7", name: "AI-Powered HOA Management Software: Features & Development Tips", type: "link", addedDate: "Jan 9, 2026", url: "https://depextechnologies.com/blog/ai-powered-hoa-management-software-features-development-tips/", source: "Depex Technologies" },
      { id: "ref-8", name: "Azure AI Search and HOA Document Assistant - Case Study", type: "link", addedDate: "Jan 9, 2026", url: "https://firstlinesoftware.com/case-study/hoa-documents-talking-back/", source: "First Line Software" },
      { id: "ref-9", name: "RAG: Towards a Promising LLM Architecture for Legal Work", type: "link", addedDate: "Jan 9, 2026", url: "https://jolt.law.harvard.edu/digest/retrieval-augmented-generation-rag-towards-a-promising-llm-architecture-for-legal-work", source: "Harvard JOLT" },
      { id: "ref-10", name: "Restrictive Covenants - Property Owners' Associations Guide", type: "link", addedDate: "Jan 9, 2026", url: "https://guides.sll.texas.gov/property-owners-associations/ccrs", source: "Texas State Law Library" },
      { id: "ref-11", name: "General Information - Property Owners' Associations", type: "link", addedDate: "Jan 9, 2026", url: "https://guides.sll.texas.gov/property-owners-associations", source: "Texas State Law Library" },
      { id: "ref-12", name: "Texas Property Code, Title 11, Restrictive Covenants", type: "link", addedDate: "Jan 9, 2026", url: "https://www.hopb.co/texas-property-code-title-11-restrictive-covenants", source: "HOPB" },
      { id: "ref-13", name: "A Closer Look at the Texas Homeowner Protection Act", type: "link", addedDate: "Jan 9, 2026", url: "https://www.grahammanagementhouston.com/texas-homeowner-protection-act/", source: "Graham Management" },
      { id: "ref-14", name: "HOA Laws and Regulations in Dallas, TX in 2025", type: "link", addedDate: "Jan 9, 2026", url: "https://www.steadily.com/blog/hoa-laws-regulations-dallas", source: "Steadily" },
      { id: "ref-15", name: "Dallas HOA & Condo Management Best Practices", type: "link", addedDate: "Jan 9, 2026", url: "https://www.properhoamanage.com/hoas-and-condominium-management-best-practices/", source: "Proper HOA Manage" },
      { id: "ref-16", name: "Texas HOA Laws | Homeowner Association Rules", type: "link", addedDate: "Jan 9, 2026", url: "https://www.hoamanagement.com/hoa-state-laws/texas/", source: "HOA Management" },
      { id: "ref-17", name: "Planning & Development HOANA - City of Dallas", type: "link", addedDate: "Jan 9, 2026", url: "https://dallascityhall.com/departments/pnv/pages/hoana.aspx", source: "City of Dallas" },
      { id: "ref-18", name: "Restrictive Covenants: Modifying and Updating (PDF)", type: "link", addedDate: "Jan 9, 2026", url: "http://wcglaw.net/wp-content/uploads/restrictive-covenants-modifying-and-updating.pdf", source: "WCG Law" },
      { id: "ref-19", name: "Texas HOA Rules: Everything You Need to Know", type: "link", addedDate: "Jan 9, 2026", url: "https://www.fsresidential.com/texas/news-events/articles/establishing-hoa-rules-and-regulations-in-texas/", source: "FirstService Residential" },
    ]
  },
];

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["hoa-docs"]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [folders, setFolders] = useState<FolderType[]>(initialFolders);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const { toast } = useToast();

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

  const handleDeleteDoc = (folderId: string, docId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFolders(prev => prev.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          documents: folder.documents.filter(doc => doc.id !== docId)
        };
      }
      return folder;
    }));
    if (selectedDoc?.id === docId) {
      setSelectedDoc(null);
    }
    setSelectedDocs(prev => {
      const next = new Set(prev);
      next.delete(docId);
      return next;
    });
    toast({ title: "Document removed", description: "The document has been removed from your knowledge base." });
  };

  const toggleDocSelection = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDocs(prev => {
      const next = new Set(prev);
      if (next.has(docId)) {
        next.delete(docId);
      } else {
        next.add(docId);
      }
      return next;
    });
  };

  const handleBulkDelete = () => {
    if (selectedDocs.size === 0) return;
    
    setFolders(prev => prev.map(folder => ({
      ...folder,
      documents: folder.documents.filter(doc => !selectedDocs.has(doc.id))
    })));
    
    if (selectedDoc && selectedDocs.has(selectedDoc.id)) {
      setSelectedDoc(null);
    }
    
    const count = selectedDocs.size;
    setSelectedDocs(new Set());
    setSelectionMode(false);
    toast({ title: `${count} document${count > 1 ? 's' : ''} removed`, description: "Selected documents have been removed from your knowledge base." });
  };

  const selectAllInFolder = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (folder && folder.editable) {
      const docIds = folder.documents.map(d => d.id);
      setSelectedDocs(prev => {
        const next = new Set(prev);
        docIds.forEach(id => next.add(id));
        return next;
      });
    }
  };

  const handleUploadComplete = async (result: any) => {
    if (result.successful && result.successful.length > 0) {
      const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      for (const file of result.successful) {
        const fileType = file.name.split('.').pop()?.toLowerCase() || 'pdf';
        const newDoc: Document = {
          id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: fileType as "pdf" | "docx" | "xlsx",
          addedDate: today,
          fileUrl: file.uploadURL || ""
        };
        
        setFolders(prev => prev.map(folder => {
          if (folder.id === "hoa-docs") {
            return {
              ...folder,
              documents: [newDoc, ...folder.documents]
            };
          }
          return folder;
        }));
      }
      setShowUploadDialog(false);
      toast({ title: "Document uploaded", description: "Your document has been added to the knowledge base." });
    }
  };

  const handleViewDocument = () => {
    if (selectedDoc) {
      if (selectedDoc.url) {
        window.open(selectedDoc.url, "_blank", "noopener,noreferrer");
      } else {
        setShowViewDialog(true);
      }
    }
  };

  const handleDownloadDocument = () => {
    if (selectedDoc) {
      if (selectedDoc.fileUrl) {
        window.open(selectedDoc.fileUrl, "_blank");
      } else if (selectedDoc.url) {
        window.open(selectedDoc.url, "_blank");
      } else {
        const content = sampleDocContent[selectedDoc.id as keyof typeof sampleDocContent] || 
          `${selectedDoc.name}\n\nThis is a sample document. Upload your actual files for full functionality.`;
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${selectedDoc.name.replace(/\s+/g, "_")}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({ title: "Document downloaded", description: `${selectedDoc.name} has been downloaded.` });
      }
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
            {selectionMode ? (
              <>
                <Button 
                  variant="destructive" 
                  className="gap-2" 
                  onClick={handleBulkDelete}
                  disabled={selectedDocs.size === 0}
                  data-testid="bulk-delete"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete ({selectedDocs.size})
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => { setSelectionMode(false); setSelectedDocs(new Set()); }}
                  data-testid="cancel-selection"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="gap-2" 
                  onClick={() => setSelectionMode(true)}
                  data-testid="select-mode"
                >
                  Select
                </Button>
                <Button className="gap-2" onClick={() => setShowUploadDialog(true)} data-testid="upload-document">
                  <Upload className="w-4 h-4" />
                  Upload
                </Button>
              </>
            )}
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
                      {selectionMode && folder.editable && (
                        <div className="flex items-center justify-between py-2 px-1 mb-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs h-7"
                            onClick={() => selectAllInFolder(folder.id)}
                          >
                            Select All
                          </Button>
                        </div>
                      )}
                      {folder.documents.map((doc, docIndex) => (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: docIndex * 0.03 }}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg transition-colors group",
                            selectedDocs.has(doc.id) 
                              ? "bg-destructive/10 border border-destructive/30"
                              : selectedDoc?.id === doc.id && doc.type !== "link"
                              ? "bg-accent/10 border border-accent/30"
                              : "hover:bg-muted/50"
                          )}
                        >
                          {selectionMode && folder.editable && (
                            <button
                              onClick={(e) => toggleDocSelection(doc.id, e)}
                              className={cn(
                                "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                                selectedDocs.has(doc.id)
                                  ? "bg-destructive border-destructive text-white"
                                  : "border-muted-foreground/30 hover:border-muted-foreground"
                              )}
                              data-testid={`checkbox-${doc.id}`}
                            >
                              {selectedDocs.has(doc.id) && (
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => handleDocClick(doc)}
                            className="flex-1 flex items-center gap-3 text-left"
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
                                  <span className="text-xs text-muted-foreground uppercase">{doc.type}</span>
                                )}
                                {doc.sections && (
                                  <span className="text-xs text-muted-foreground">• {doc.sections} sections</span>
                                )}
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">Added {doc.addedDate}</span>
                          </button>
                          
                          {folder.editable && !selectionMode && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={(e) => handleDeleteDoc(folder.id, doc.id, e)}
                              data-testid={`delete-${doc.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </motion.div>
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
                <span>Added {selectedDoc.addedDate}</span>
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
                    Primary Document
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
              <Button className="w-full gap-2" onClick={handleViewDocument} data-testid="view-document">
                <Eye className="w-4 h-4" />
                View Document
              </Button>
              <Button variant="outline" className="w-full gap-2" onClick={handleDownloadDocument} data-testid="download-document">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </motion.aside>
        )}
      </div>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload HOA documents to add them to your knowledge base. Supported formats: PDF, DOCX, XLSX.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ObjectUploader
              maxNumberOfFiles={5}
              maxFileSize={52428800}
              onGetUploadParameters={async (file) => {
                const res = await fetch("/api/uploads/request-url", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: file.name,
                    size: file.size,
                    contentType: file.type || "application/octet-stream",
                  }),
                });
                if (!res.ok) throw new Error("Failed to get upload URL");
                const { uploadURL } = await res.json();
                return {
                  method: "PUT" as const,
                  url: uploadURL,
                  headers: { "Content-Type": file.type || "application/octet-stream" },
                };
              }}
              onComplete={handleUploadComplete}
              buttonClassName="w-full h-32 border-2 border-dashed border-border hover:border-accent/50 bg-transparent hover:bg-accent/5"
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-10 h-10 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Drop files here or click to upload</span>
                <span className="text-xs text-muted-foreground/70">PDF, DOCX, XLSX up to 50MB</span>
              </div>
            </ObjectUploader>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {selectedDoc?.name}
            </DialogTitle>
            <DialogDescription>
              Document preview - Upload your actual documents for full content
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto bg-muted/30 rounded-lg p-6 font-mono text-sm whitespace-pre-wrap">
            {selectedDoc && (sampleDocContent[selectedDoc.id as keyof typeof sampleDocContent] || 
              `${selectedDoc.name}\n\nThis is a sample document preview.\n\nUpload your actual HOA documents to view their full content here.\n\nSupported formats:\n- PDF documents\n- Word documents (.docx)\n- Excel spreadsheets (.xlsx)`)}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
            <Button onClick={handleDownloadDocument}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
