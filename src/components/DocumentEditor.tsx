import { useState } from "react";
import { DocumentHeader } from "./document/DocumentHeader";
import { DocumentNavigation } from "./document/DocumentNavigation";
import { DocumentContent } from "./document/DocumentContent";
import { DocumentSidebar } from "./document/DocumentSidebar";

export type ToolbarTab = "home" | "insert" | "format" | "review";
export type SidebarTab = "suggestions" | "comments" | "approval";

export interface DocumentOutline {
  id: string;
  text: string;
  level: number;
  position: number;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  resolved: boolean;
  position: number;
}

export interface Suggestion {
  id: string;
  type: "insert" | "delete" | "replace";
  text: string;
  originalText?: string;
  author: string;
  timestamp: Date;
  accepted?: boolean;
  position: number;
}

export interface Approval {
  id: string;
  status: "pending" | "approved" | "rejected";
  reviewer: string;
  timestamp: Date;
  note?: string;
}

const DocumentEditor = () => {
  const [activeToolbarTab, setActiveToolbarTab] = useState<ToolbarTab>("home");
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>("suggestions");
  const [documentOutline, setDocumentOutline] = useState<DocumentOutline[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([
    {
      id: "1",
      status: "pending",
      reviewer: "John Doe",
      timestamp: new Date(),
      note: "Please review the introduction section"
    }
  ]);

  const addComment = (text: string, position: number) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      text,
      author: "Current User",
      timestamp: new Date(),
      resolved: false,
      position
    };
    setComments([...comments, newComment]);
  };

  const addSuggestion = (type: Suggestion["type"], text: string, position: number, originalText?: string) => {
    const newSuggestion: Suggestion = {
      id: Date.now().toString(),
      type,
      text,
      originalText,
      author: "Current User",
      timestamp: new Date(),
      position
    };
    setSuggestions([...suggestions, newSuggestion]);
  };

  const scrollToSection = (position: number) => {
    // Implementation would scroll to the specific position in the document
    console.log("Scrolling to position:", position);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Navigation Sidebar */}
      <DocumentNavigation 
        outline={documentOutline}
        onSectionClick={scrollToSection}
      />
      
      {/* Main Document Area */}
      <div className="flex-1 flex flex-col">
        <DocumentHeader 
          activeTab={activeToolbarTab}
          onTabChange={setActiveToolbarTab}
        />
        
        <DocumentContent 
          activeToolbarTab={activeToolbarTab}
          onOutlineChange={setDocumentOutline}
          onAddComment={addComment}
          onAddSuggestion={addSuggestion}
        />
      </div>
      
      {/* Right Sidebar */}
      <DocumentSidebar 
        activeTab={activeSidebarTab}
        onTabChange={setActiveSidebarTab}
        comments={comments}
        suggestions={suggestions}
        approvals={approvals}
        onResolveComment={(id) => {
          setComments(comments.map(c => c.id === id ? { ...c, resolved: true } : c));
        }}
        onAcceptSuggestion={(id) => {
          setSuggestions(suggestions.map(s => s.id === id ? { ...s, accepted: true } : s));
        }}
        onRejectSuggestion={(id) => {
          setSuggestions(suggestions.map(s => s.id === id ? { ...s, accepted: false } : s));
        }}
        onUpdateApproval={(id, status, note) => {
          setApprovals(approvals.map(a => a.id === id ? { ...a, status, note } : a));
        }}
      />
    </div>
  );
};

export default DocumentEditor;