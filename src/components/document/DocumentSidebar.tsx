import { useState } from "react";
import { MessageSquare, Lightbulb, CheckCircle, Clock, User, Check, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { SidebarTab, Comment, Suggestion, Approval } from "../DocumentEditor";

interface DocumentSidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  comments: Comment[];
  suggestions: Suggestion[];
  approvals: Approval[];
  onAddComment: (text: string, position: number) => void;
  onResolveComment: (id: string) => void;
  onAcceptSuggestion: (id: string) => void;
  onRejectSuggestion: (id: string) => void;
  onUpdateApproval: (id: string, status: "approved" | "rejected", note?: string) => void;
}

const sidebarTabs = [
  { id: "suggestions" as const, label: "Suggestions", icon: Lightbulb },
  { id: "comments" as const, label: "Comments", icon: MessageSquare },
  { id: "approval" as const, label: "Approval", icon: CheckCircle },
];

export const DocumentSidebar = ({
  activeTab,
  onTabChange,
  comments,
  suggestions,
  approvals,
  onAddComment,
  onResolveComment,
  onAcceptSuggestion,
  onRejectSuggestion,
  onUpdateApproval,
}: DocumentSidebarProps) => {
  const [newComment, setNewComment] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);

  const handleAddComment = () => {
    if (newComment.trim()) {
      // This would typically get the current cursor position
      const position = Math.floor(Math.random() * 10);
      onAddComment(newComment, position);
      setNewComment("");
      setShowCommentInput(false);
    }
  };

  const renderSuggestions = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Suggestions</h3>
        <Badge variant="secondary">{suggestions.length}</Badge>
      </div>
      
      {suggestions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No suggestions</p>
          <p className="text-xs">Enable suggestion mode to track changes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="p-3 rounded-lg border border-suggestion-border bg-suggestion"
            >
              <div className="flex items-start justify-between mb-2">
                <Badge
                  variant={
                    suggestion.type === "insert"
                      ? "default"
                      : suggestion.type === "delete"
                      ? "destructive"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {suggestion.type}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  {suggestion.author}
                </div>
              </div>
              
              <div className="text-sm mb-3">
                {suggestion.type === "delete" && (
                  <span className="line-through text-destructive">
                    {suggestion.originalText}
                  </span>
                )}
                {suggestion.type === "insert" && (
                  <span className="text-green-600">{suggestion.text}</span>
                )}
                {suggestion.type === "replace" && (
                  <>
                    <span className="line-through text-destructive">
                      {suggestion.originalText}
                    </span>
                    <span className="text-green-600"> → {suggestion.text}</span>
                  </>
                )}
              </div>
              
              {suggestion.accepted === undefined && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onAcceptSuggestion(suggestion.id)}
                    className="h-7 px-2"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRejectSuggestion(suggestion.id)}
                    className="h-7 px-2"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
              
              {suggestion.accepted !== undefined && (
                <Badge
                  variant={suggestion.accepted ? "default" : "destructive"}
                  className="text-xs"
                >
                  {suggestion.accepted ? "Accepted" : "Rejected"}
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderComments = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Comments</h3>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{comments.filter(c => !c.resolved).length}</Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowCommentInput(!showCommentInput)}
            className="h-7 px-2"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {showCommentInput && (
        <div className="space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddComment}>
              Comment
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setShowCommentInput(false);
                setNewComment("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No comments</p>
          <p className="text-xs">Add comments to collaborate</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments
            .filter(comment => !comment.resolved)
            .map((comment) => (
              <div
                key={comment.id}
                className="p-3 rounded-lg border border-comment-border bg-comment"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{comment.author}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {comment.timestamp.toLocaleDateString()}
                  </div>
                </div>
                
                <p className="text-sm mb-3">{comment.text}</p>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onResolveComment(comment.id)}
                  className="h-7 px-2"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Resolve
                </Button>
              </div>
            ))}
        </div>
      )}
    </div>
  );

  const renderApproval = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Approval Status</h3>
        <Badge variant="secondary">{approvals.filter(a => a.status === "pending").length}</Badge>
      </div>
      
      {approvals.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No approval requests</p>
          <p className="text-xs">Send for approval when ready</p>
        </div>
      ) : (
        <div className="space-y-3">
          {approvals.map((approval) => (
            <div
              key={approval.id}
              className="p-3 rounded-lg border border-approval-border bg-approval"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{approval.reviewer}</span>
                </div>
                <Badge
                  variant={
                    approval.status === "approved"
                      ? "default"
                      : approval.status === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {approval.status}
                </Badge>
              </div>
              
              {approval.note && (
                <p className="text-sm mb-3 italic">{approval.note}</p>
              )}
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {approval.timestamp.toLocaleDateString()}
              </div>
              
              {approval.status === "pending" && (
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={() => onUpdateApproval(approval.id, "approved")}
                    className="h-7 px-2"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onUpdateApproval(approval.id, "rejected")}
                    className="h-7 px-2"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "suggestions":
        return renderSuggestions();
      case "comments":
        return renderComments();
      case "approval":
        return renderApproval();
      default:
        return renderSuggestions();
    }
  };

  return (
    <div className="w-80 bg-sidebar border-l border-sidebar-border flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-sidebar-border">
        {sidebarTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-2 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden lg:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {renderContent()}
        </div>
      </ScrollArea>
    </div>
  );
};