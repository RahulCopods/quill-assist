import { ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { DocumentOutline } from "../DocumentEditor";

interface DocumentNavigationProps {
  outline: DocumentOutline[];
  onSectionClick: (position: number) => void;
}

export const DocumentNavigation = ({ outline, onSectionClick }: DocumentNavigationProps) => {
  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-sidebar-foreground">Document Outline</h2>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {outline.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No headings found</p>
              <p className="text-xs">Add headings to see document outline</p>
            </div>
          ) : (
            <div className="space-y-1">
              {outline.map((item, index) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onSectionClick(item.position)}
                  className={cn(
                    "w-full justify-start text-left",
                    "hover:bg-nav-hover hover:text-foreground",
                    item.level === 1 && "font-semibold",
                    item.level === 2 && "pl-4 text-sm",
                    item.level === 3 && "pl-8 text-xs",
                    item.level > 3 && "pl-12 text-xs"
                  )}
                >
                  <ChevronRight className="h-3 w-3 mr-1 opacity-50" />
                  <span className="truncate">{item.text}</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};