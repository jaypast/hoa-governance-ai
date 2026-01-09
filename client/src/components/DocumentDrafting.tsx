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
  Eye,
  X,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  popularity: "high" | "medium" | "low";
  lastUsed?: string;
  content: string;
}

const templates: Template[] = [
  { 
    id: "1", 
    name: "Rule Amendment Notice", 
    description: "Compliant with Chapter 209 notice requirements", 
    category: "governance", 
    popularity: "high", 
    lastUsed: "2 days ago",
    content: `NOTICE OF PROPOSED RULE AMENDMENT

TO: All Homeowners of [HOA_NAME]
FROM: Board of Directors
DATE: [DATE]

RE: Proposed Amendment to [RULE_NAME]

Dear Homeowners,

Pursuant to Section 209.0052 of the Texas Property Code and Section [BYLAW_SECTION] of our Bylaws, notice is hereby given that the Board of Directors will consider the following rule amendment at the upcoming board meeting:

CURRENT RULE:
[CURRENT_RULE_TEXT]

PROPOSED AMENDMENT:
[PROPOSED_RULE_TEXT]

REASON FOR AMENDMENT:
[REASON]

MEETING DETAILS:
Date: [MEETING_DATE]
Time: [MEETING_TIME]
Location: [MEETING_LOCATION]

Homeowners are invited to submit written comments to the Board prior to the meeting.

---
DRAFT – REQUIRES BOARD APPROVAL AND ATTORNEY REVIEW
This document was generated for research purposes only and does not constitute legal advice.`
  },
  { 
    id: "2", 
    name: "Board Resolution", 
    description: "Template with recitals and decision sections", 
    category: "governance", 
    popularity: "high",
    content: `RESOLUTION OF THE BOARD OF DIRECTORS
[HOA_NAME]

RESOLUTION NO. [NUMBER]

WHEREAS, the Board of Directors of [HOA_NAME] (the "Association") is authorized under Article [ARTICLE] of the Bylaws to [AUTHORITY];

WHEREAS, [BACKGROUND_FACTS];

WHEREAS, [ADDITIONAL_RECITALS];

NOW, THEREFORE, BE IT RESOLVED, that:

1. [RESOLUTION_ITEM_1]

2. [RESOLUTION_ITEM_2]

3. This Resolution shall be effective as of [EFFECTIVE_DATE].

ADOPTED by the Board of Directors on [DATE].

_________________________
[PRESIDENT_NAME], President

_________________________
[SECRETARY_NAME], Secretary

---
DRAFT – REQUIRES BOARD APPROVAL AND ATTORNEY REVIEW`
  },
  { 
    id: "3", 
    name: "209 Violation Letter", 
    description: "Required notice before enforcement actions", 
    category: "governance", 
    popularity: "high", 
    lastUsed: "1 week ago",
    content: `NOTICE OF VIOLATION
(Pursuant to Texas Property Code Chapter 209)

DATE: [DATE]
VIA CERTIFIED MAIL, RETURN RECEIPT REQUESTED

[OWNER_NAME]
[PROPERTY_ADDRESS]
[CITY], TX [ZIP]

RE: Notice of Violation – [PROPERTY_ADDRESS]

Dear [OWNER_NAME]:

This letter serves as formal notice pursuant to Section 209.006 of the Texas Property Code that the property located at [PROPERTY_ADDRESS] is in violation of the governing documents of [HOA_NAME].

VIOLATION:
[VIOLATION_DESCRIPTION]

GOVERNING DOCUMENT REFERENCE:
[CC&R_SECTION] of the Declaration of Covenants, Conditions, and Restrictions

REQUIRED ACTION:
[REQUIRED_ACTION]

CURE PERIOD:
You have thirty (30) days from the date of this notice to cure this violation.

RIGHT TO REQUEST A HEARING:
Pursuant to Section 209.007 of the Texas Property Code, you have the right to request a hearing before the Board of Directors. Such request must be made in writing within 30 days of the date of this notice.

Please contact [CONTACT_NAME] at [CONTACT_EMAIL] or [CONTACT_PHONE] if you have questions.

Sincerely,

[HOA_NAME]
Board of Directors

---
DRAFT – REQUIRES BOARD APPROVAL AND ATTORNEY REVIEW`
  },
  { 
    id: "4", 
    name: "Architectural Guidelines", 
    description: "ARC review committee guidelines draft", 
    category: "governance", 
    popularity: "medium",
    content: `ARCHITECTURAL REVIEW GUIDELINES
[HOA_NAME]

SECTION 1: PURPOSE
These guidelines establish standards for architectural modifications to ensure consistency with community standards and property values.

SECTION 2: SUBMISSION REQUIREMENTS
All exterior modifications require written approval from the Architectural Review Committee (ARC) prior to commencement of work.

Required Documents:
- Completed ARC Application Form
- Detailed description of proposed modification
- Site plan showing location of modification
- Material samples and color selections
- Contractor information (if applicable)

SECTION 3: REVIEW PROCESS
[REVIEW_PROCESS_DETAILS]

SECTION 4: APPROVAL CRITERIA
[APPROVAL_CRITERIA]

---
DRAFT – REQUIRES BOARD APPROVAL AND ATTORNEY REVIEW`
  },
  { 
    id: "5", 
    name: "Annual Budget Narrative", 
    description: "Owner-friendly budget explanation", 
    category: "financial", 
    popularity: "high", 
    lastUsed: "1 month ago",
    content: `[HOA_NAME]
ANNUAL BUDGET NARRATIVE
Fiscal Year [YEAR]

Dear Homeowners,

The Board of Directors is pleased to present the annual operating budget for fiscal year [YEAR]. This narrative explains the key components of the budget and any changes from the prior year.

BUDGET SUMMARY:
Total Operating Budget: $[TOTAL]
Per-Unit Monthly Assessment: $[MONTHLY_AMOUNT]
Change from Prior Year: [PERCENT_CHANGE]%

KEY BUDGET CATEGORIES:

1. COMMON AREA MAINTENANCE: $[AMOUNT]
   [EXPLANATION]

2. LANDSCAPING: $[AMOUNT]
   [EXPLANATION]

3. UTILITIES: $[AMOUNT]
   [EXPLANATION]

4. INSURANCE: $[AMOUNT]
   [EXPLANATION]

5. RESERVE CONTRIBUTIONS: $[AMOUNT]
   [EXPLANATION]

6. MANAGEMENT FEES: $[AMOUNT]
   [EXPLANATION]

ASSESSMENT CHANGES:
[ASSESSMENT_EXPLANATION]

Questions about this budget may be directed to [CONTACT].

---
DRAFT – REQUIRES BOARD APPROVAL`
  },
  { 
    id: "6", 
    name: "Dues Increase Memo", 
    description: "Justification for assessment changes", 
    category: "financial", 
    popularity: "medium",
    content: `MEMORANDUM

TO: All Homeowners
FROM: Board of Directors
DATE: [DATE]
RE: [YEAR] Assessment Increase Notification

The Board of Directors has approved an increase in monthly assessments effective [EFFECTIVE_DATE].

CURRENT ASSESSMENT: $[CURRENT_AMOUNT]
NEW ASSESSMENT: $[NEW_AMOUNT]
INCREASE: $[INCREASE_AMOUNT] ([PERCENT]%)

REASONS FOR INCREASE:
1. [REASON_1]
2. [REASON_2]
3. [REASON_3]

The Board carefully considered all options to minimize the impact on homeowners while ensuring the Association can meet its financial obligations.

---
DRAFT – REQUIRES BOARD APPROVAL`
  },
  { 
    id: "7", 
    name: "Special Assessment", 
    description: "Emergency funding justification", 
    category: "financial", 
    popularity: "medium",
    content: `NOTICE OF SPECIAL ASSESSMENT

[HOA_NAME]

DATE: [DATE]

Dear Homeowners,

Pursuant to Section [BYLAW_SECTION] of the Bylaws, the Board of Directors has approved a special assessment.

AMOUNT: $[AMOUNT] per unit
DUE DATE: [DUE_DATE]
PURPOSE: [PURPOSE]

BACKGROUND:
[BACKGROUND_EXPLANATION]

PAYMENT OPTIONS:
[PAYMENT_OPTIONS]

---
DRAFT – REQUIRES BOARD APPROVAL AND ATTORNEY REVIEW`
  },
  { 
    id: "8", 
    name: "Reserve Funding Plan", 
    description: "Long-term reserve study summary", 
    category: "financial", 
    popularity: "low",
    content: `RESERVE FUNDING PLAN SUMMARY
[HOA_NAME]

PREPARED: [DATE]
PLANNING PERIOD: [START_YEAR] - [END_YEAR]

EXECUTIVE SUMMARY:
[SUMMARY]

CURRENT RESERVE BALANCE: $[BALANCE]
RECOMMENDED ANNUAL CONTRIBUTION: $[CONTRIBUTION]
PERCENT FUNDED: [PERCENT]%

MAJOR COMPONENT SCHEDULE:
[COMPONENT_LIST]

---
DRAFT – FOR BOARD REVIEW`
  },
  { 
    id: "9", 
    name: "Owner FAQ", 
    description: "Common questions with CC&R references", 
    category: "communication", 
    popularity: "medium",
    content: `HOMEOWNER FREQUENTLY ASKED QUESTIONS
[HOA_NAME]

Q: What are my monthly dues and when are they due?
A: Monthly assessments of $[AMOUNT] are due on the [DAY] of each month. (See CC&Rs Section [SECTION])

Q: How do I submit an architectural modification request?
A: [ARC_PROCESS] (See CC&Rs Section [SECTION])

Q: What are the parking rules?
A: [PARKING_RULES] (See CC&Rs Section [SECTION])

Q: How can I access HOA documents?
A: [DOCUMENT_ACCESS]

---
DRAFT – REQUIRES BOARD APPROVAL`
  },
  { 
    id: "10", 
    name: "Meeting Agenda", 
    description: "Auto-includes recurring items", 
    category: "communication", 
    popularity: "high", 
    lastUsed: "3 days ago",
    content: `BOARD OF DIRECTORS MEETING AGENDA
[HOA_NAME]

DATE: [DATE]
TIME: [TIME]
LOCATION: [LOCATION]

1. CALL TO ORDER

2. ROLL CALL / ESTABLISHMENT OF QUORUM

3. APPROVAL OF PRIOR MEETING MINUTES
   - [PRIOR_MEETING_DATE] Minutes

4. FINANCIAL REPORT
   - Review of Monthly Financials
   - Outstanding Assessments Update
   - Reserve Fund Status

5. COMMITTEE REPORTS
   - Architectural Review Committee
   - [OTHER_COMMITTEES]

6. OLD BUSINESS
   - [OLD_BUSINESS_ITEMS]

7. NEW BUSINESS
   - [NEW_BUSINESS_ITEMS]

8. HOMEOWNER FORUM

9. EXECUTIVE SESSION (if needed)

10. ADJOURNMENT

---
DRAFT – SUBJECT TO MODIFICATION`
  },
  { 
    id: "11", 
    name: "Board Minutes", 
    description: "Template for secretary to complete", 
    category: "communication", 
    popularity: "high",
    content: `MINUTES OF THE BOARD OF DIRECTORS MEETING
[HOA_NAME]

DATE: [DATE]
TIME: [TIME]
LOCATION: [LOCATION]

DIRECTORS PRESENT:
[DIRECTORS_PRESENT]

DIRECTORS ABSENT:
[DIRECTORS_ABSENT]

QUORUM: [YES/NO]

1. CALL TO ORDER
   The meeting was called to order at [TIME] by [PRESIDENT_NAME].

2. APPROVAL OF MINUTES
   Motion to approve the minutes of [PRIOR_DATE] made by [NAME], seconded by [NAME]. Motion carried.

3. FINANCIAL REPORT
   [FINANCIAL_SUMMARY]

4. OLD BUSINESS
   [OLD_BUSINESS_NOTES]

5. NEW BUSINESS
   [NEW_BUSINESS_NOTES]

6. ADJOURNMENT
   Motion to adjourn made at [TIME]. Motion carried.

Respectfully submitted,
[SECRETARY_NAME], Secretary

---
DRAFT – REQUIRES BOARD APPROVAL`
  },
  { 
    id: "12", 
    name: "Compliance Memo", 
    description: "Situation analysis with options", 
    category: "research", 
    popularity: "medium",
    content: `COMPLIANCE RESEARCH MEMORANDUM

TO: Board of Directors
FROM: [PREPARED_BY]
DATE: [DATE]
RE: [SUBJECT]

ISSUE:
[ISSUE_DESCRIPTION]

BACKGROUND:
[BACKGROUND_FACTS]

RELEVANT GOVERNING DOCUMENTS:
- CC&Rs Section [SECTION]: [SUMMARY]
- Bylaws Section [SECTION]: [SUMMARY]
- Texas Property Code §[SECTION]: [SUMMARY]

ANALYSIS:
[ANALYSIS]

OPTIONS:
1. [OPTION_1]
   - Pros: [PROS]
   - Cons: [CONS]

2. [OPTION_2]
   - Pros: [PROS]
   - Cons: [CONS]

RECOMMENDATION:
[RECOMMENDATION]

NEXT STEPS:
[NEXT_STEPS]

---
DRAFT – FOR BOARD CONSIDERATION ONLY
NOT LEGAL ADVICE – CONSULT HOA ATTORNEY`
  },
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
  const [showPreview, setShowPreview] = useState(false);
  const [showDraftEditor, setShowDraftEditor] = useState(false);
  const [draftContent, setDraftContent] = useState("");
  const { toast } = useToast();

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === "all" || t.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  const handleStartDraft = () => {
    if (selectedTemplate) {
      setDraftContent(selectedTemplate.content);
      setShowDraftEditor(true);
    }
  };

  const handlePreview = () => {
    if (selectedTemplate) {
      setShowPreview(true);
    }
  };

  const handleDownload = () => {
    if (selectedTemplate) {
      const content = draftContent || selectedTemplate.content;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedTemplate.name.replace(/\s+/g, "_")}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "Document downloaded", description: `${selectedTemplate.name} has been downloaded.` });
    }
  };

  const handleSaveDraft = () => {
    toast({ title: "Draft saved", description: "Your draft has been saved locally." });
    setShowDraftEditor(false);
  };

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

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    All documents are marked as drafts requiring board approval and attorney review.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border space-y-3">
              <Button className="w-full gap-2" onClick={handleStartDraft} data-testid="start-draft">
                <FileText className="w-4 h-4" />
                Start Draft
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2" onClick={handlePreview} data-testid="preview-template">
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
                <Button variant="outline" className="flex-1 gap-2" onClick={handleDownload} data-testid="download-template">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name} - Preview</DialogTitle>
            <DialogDescription>
              This is a preview of the template. Placeholders are shown in brackets.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto bg-muted/30 rounded-lg p-6 font-mono text-sm whitespace-pre-wrap">
            {selectedTemplate?.content}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowPreview(false)}>Close</Button>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Draft Editor Dialog */}
      <Dialog open={showDraftEditor} onOpenChange={setShowDraftEditor}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Draft: {selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Replace the placeholders in brackets with your specific information.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <Label htmlFor="draft-content" className="sr-only">Draft Content</Label>
            <Textarea
              id="draft-content"
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              className="h-full min-h-[400px] font-mono text-sm resize-none"
              data-testid="draft-editor"
            />
          </div>
          <div className="flex justify-between pt-4">
            <Button variant="ghost" onClick={() => setShowDraftEditor(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={handleSaveDraft}>
                Save Draft
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
