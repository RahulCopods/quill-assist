import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Image, Table, Link, FileText, Eye, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { ToolbarTab } from "../DocumentEditor";

interface DocumentHeaderProps {
  activeTab: ToolbarTab;
  onTabChange: (tab: ToolbarTab) => void;
}

const toolbarTabs = [
  { id: "home" as const, label: "Home" },
  { id: "insert" as const, label: "Insert" },
  { id: "format" as const, label: "Format" },
  { id: "review" as const, label: "Review" },
];

export const DocumentHeader = ({ activeTab, onTabChange }: DocumentHeaderProps) => {
  const renderHomeTools = () => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm">
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Underline className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-6 mx-2" />
      <Button variant="ghost" size="sm">
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <AlignRight className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-6 mx-2" />
      <Button variant="ghost" size="sm">
        <List className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <ListOrdered className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderInsertTools = () => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm">
        <Image className="h-4 w-4" />
        <span className="ml-1">Image</span>
      </Button>
      <Button variant="ghost" size="sm">
        <Table className="h-4 w-4" />
        <span className="ml-1">Table</span>
      </Button>
      <Button variant="ghost" size="sm">
        <Link className="h-4 w-4" />
        <span className="ml-1">Link</span>
      </Button>
    </div>
  );

  const renderFormatTools = () => (
    <div className="flex items-center gap-1">
      <select className="px-2 py-1 border rounded text-sm">
        <option>Normal</option>
        <option>Heading 1</option>
        <option>Heading 2</option>
        <option>Heading 3</option>
      </select>
      <select className="px-2 py-1 border rounded text-sm ml-2">
        <option>Arial</option>
        <option>Times New Roman</option>
        <option>Helvetica</option>
      </select>
      <select className="px-2 py-1 border rounded text-sm ml-2">
        <option>12px</option>
        <option>14px</option>
        <option>16px</option>
        <option>18px</option>
      </select>
    </div>
  );

  const renderReviewTools = () => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm">
        <FileText className="h-4 w-4" />
        <span className="ml-1">Suggest</span>
      </Button>
      <Button variant="ghost" size="sm">
        <Eye className="h-4 w-4" />
        <span className="ml-1">View Only</span>
      </Button>
      <Button variant="ghost" size="sm">
        <Users className="h-4 w-4" />
        <span className="ml-1">Share</span>
      </Button>
    </div>
  );

  const renderToolbar = () => {
    switch (activeTab) {
      case "home":
        return renderHomeTools();
      case "insert":
        return renderInsertTools();
      case "format":
        return renderFormatTools();
      case "review":
        return renderReviewTools();
      default:
        return renderHomeTools();
    }
  };

  return (
    <div className="bg-toolbar border-b border-toolbar-border">
      {/* Tab Navigation */}
      <div className="flex items-center px-4 py-2 border-b border-toolbar-border">
        <div className="flex items-center gap-6">
          {toolbarTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded transition-colors",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Dynamic Toolbar */}
      <div className="px-4 py-3">
        {renderToolbar()}
      </div>
    </div>
  );
};