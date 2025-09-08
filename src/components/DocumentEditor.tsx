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
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      text: "This introduction could be more engaging. Consider adding a hook to grab the reader's attention.",
      author: "Sarah Wilson",
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      resolved: false,
      position: 1
    },
    {
      id: "2", 
      text: "Great point about the methodology. This section is very clear.",
      author: "Mike Johnson",
      timestamp: new Date(Date.now() - 43200000), // 12 hours ago
      resolved: false,
      position: 5
    }
  ]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: "1",
      type: "replace",
      text: "comprehensive analysis",
      originalText: "basic overview",
      author: "Dr. Emily Chen",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      position: 3
    },
    {
      id: "2",
      type: "insert", 
      text: "Furthermore, it's important to note that",
      author: "Alex Rodriguez",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      position: 8
    },
    {
      id: "3",
      type: "delete",
      text: "",
      originalText: "obviously",
      author: "Dr. Emily Chen", 
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      position: 12
    }
  ]);
  const [approvals, setApprovals] = useState<Approval[]>([
    {
      id: "1",
      status: "pending",
      reviewer: "John Doe",
      timestamp: new Date(),
      note: "Please review the introduction section"
    },
    {
      id: "2",
      status: "approved", 
      reviewer: "Jane Smith",
      timestamp: new Date(Date.now() - 86400000),
      note: "Methodology section looks good"
    },
    {
      id: "3",
      status: "pending",
      reviewer: "Dr. Brown",
      timestamp: new Date(Date.now() - 3600000),
      note: "Need to verify the conclusion aligns with findings"
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
    const editorElement = document.querySelector('.lexical-editor');
    if (editorElement) {
      const headings = editorElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
      if (headings[position]) {
        headings[position].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
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
          initialContent="# Document Title

## Introduction

Welcome to this comprehensive document editor built with Lexical. This editor provides powerful collaboration features including suggestions, comments, and approval workflows.

## Key Features

### Rich Text Editing
- **Bold text** and *italic text*
- Multiple heading levels
- Bullet points and numbered lists
- Professional formatting options

### Collaboration Tools
- Real-time suggestions and change tracking
- Commenting system for feedback
- Approval workflows for document review

## Getting Started

Start typing to see the document outline populate in the left sidebar. Use the toolbar above to format your text, and try the collaboration features in the right sidebar.

### Sample Heading
This is where you can add more content. The navigation will automatically update as you add headings."
        />
      </div>
      
      {/* Right Sidebar */}
      <DocumentSidebar 
        activeTab={activeSidebarTab}
        onTabChange={setActiveSidebarTab}
        comments={comments}
        suggestions={suggestions}
        approvals={approvals}
        onAddComment={addComment}
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