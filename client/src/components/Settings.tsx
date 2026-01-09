import { motion } from "framer-motion";
import { 
  Upload, 
  Users, 
  Shield, 
  Bell,
  Database,
  Trash2,
  Plus,
  Check,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function Settings() {
  return (
    <div className="h-full overflow-y-auto bg-background" data-testid="settings">
      <header className="px-8 py-6 border-b border-border bg-card/50 sticky top-0 z-10">
        <h2 className="font-display text-2xl font-semibold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage documents, access, and agent configuration</p>
      </header>

      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Upload className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle>Document Management</CardTitle>
                  <CardDescription>Upload and manage your HOA documents</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent/50 transition-colors cursor-pointer" data-testid="upload-zone">
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">Drop files here or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, XLSX up to 50MB</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">Recent Uploads</h4>
                <div className="space-y-2">
                  {[
                    { name: "CC&Rs - Oakwood Estates (2023).pdf", status: "indexed", date: "Dec 15, 2025" },
                    { name: "Bylaws - Amended 2024.pdf", status: "indexed", date: "Jan 3, 2025" },
                    { name: "Annual Budget 2026.xlsx", status: "processing", date: "Jan 8, 2026" },
                  ].map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Database className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{file.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={file.status === "indexed" ? "secondary" : "outline"}>
                          {file.status === "indexed" ? (
                            <><Check className="w-3 h-3 mr-1" /> Indexed</>
                          ) : (
                            "Processing..."
                          )}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{file.date}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Users className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <CardTitle>Team Access</CardTitle>
                  <CardDescription>Manage who can use the AI agent</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { name: "Sarah Johnson", role: "President", email: "sarah@oakwoodhoa.com" },
                  { name: "Michael Chen", role: "Treasurer", email: "michael@oakwoodhoa.com" },
                  { name: "Lisa Rodriguez", role: "Secretary", email: "lisa@oakwoodhoa.com" },
                ].map((member, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-sm font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{member.role}</Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full gap-2" data-testid="invite-member">
                <Plus className="w-4 h-4" />
                Invite Team Member
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Shield className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <CardTitle>AI Guardrails</CardTitle>
                  <CardDescription>Configure agent behavior and disclaimers</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Always show legal disclaimer</Label>
                  <p className="text-sm text-muted-foreground">Include "consult your attorney" in all responses</p>
                </div>
                <Switch defaultChecked data-testid="disclaimer-toggle" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Mark documents as drafts</Label>
                  <p className="text-sm text-muted-foreground">Watermark all exports with "Draft - Requires Board Approval"</p>
                </div>
                <Switch defaultChecked data-testid="watermark-toggle" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Citation requirements</Label>
                  <p className="text-sm text-muted-foreground">Always cite source documents in responses</p>
                </div>
                <Switch defaultChecked data-testid="citation-toggle" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Flag interpretive answers</Label>
                  <p className="text-sm text-muted-foreground">Distinguish between factual and interpretive responses</p>
                </div>
                <Switch defaultChecked data-testid="interpretive-toggle" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Bell className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Configure alerts and updates</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Document updates</Label>
                  <p className="text-sm text-muted-foreground">Notify when Texas Property Code is updated</p>
                </div>
                <Switch defaultChecked data-testid="doc-update-toggle" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Weekly summary</Label>
                  <p className="text-sm text-muted-foreground">Email summary of agent usage and insights</p>
                </div>
                <Switch data-testid="weekly-summary-toggle" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Important Notice</p>
            <p className="text-sm text-amber-600 dark:text-amber-300/80 mt-1">
              This AI agent is a research tool for board use only. All outputs are drafts for human approval and do not constitute legal advice. Always consult your HOA attorney for legal matters.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
