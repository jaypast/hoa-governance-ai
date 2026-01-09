import { motion } from "framer-motion";
import { 
  Search, 
  FileText, 
  Database, 
  Settings as SettingsIcon,
  Scale,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { ActiveSection } from "@/pages/Home";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
}

const navItems = [
  { id: "research" as const, label: "Research Workspace", icon: Search, description: "Ask governance questions" },
  { id: "drafting" as const, label: "Document Drafting", icon: FileText, description: "Templates & documents" },
  { id: "knowledge" as const, label: "Knowledge Base", icon: Database, description: "Browse your documents" },
  { id: "settings" as const, label: "Settings", icon: SettingsIcon, description: "Manage uploads & access" },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="w-72 bg-sidebar text-sidebar-foreground flex flex-col h-full border-r border-sidebar-border" data-testid="sidebar">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
            <Scale className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold tracking-tight">HOA Governance</h1>
            <p className="text-xs text-sidebar-foreground/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI Agent
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1" data-testid="sidebar-nav">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group relative",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground"
              )}
              data-testid={`nav-${item.id}`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sidebar-primary rounded-r-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/70"
              )} />
              <div className="flex-1 min-w-0">
                <span className="block font-medium text-sm">{item.label}</span>
                <span className="block text-xs opacity-60 truncate">{item.description}</span>
              </div>
              <ChevronRight className={cn(
                "w-4 h-4 transition-all",
                isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"
              )} />
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-sidebar-accent/50 rounded-xl p-4">
          <p className="text-xs text-sidebar-foreground/60 mb-2">Current HOA</p>
          <p className="font-medium text-sm">Oakwood Estates HOA</p>
          <p className="text-xs text-sidebar-foreground/50 mt-1">Dallas, Texas</p>
        </div>
      </div>

      <div className="p-4 text-xs text-sidebar-foreground/40">
        <p>Not legal advice. Consult your attorney.</p>
      </div>
    </aside>
  );
}
