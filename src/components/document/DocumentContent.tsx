import { useEffect, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { $getRoot, $getSelection, EditorState } from "lexical";
import { $isHeadingNode, HeadingNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import type { ToolbarTab, DocumentOutline } from "../DocumentEditor";

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  paragraph: "editor-paragraph",
  quote: "editor-quote",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
    h6: "editor-heading-h6",
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listitem",
  },
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    underline: "editor-text-underline",
  },
};

function onError(error: Error) {
  console.error(error);
}

interface DocumentContentProps {
  activeToolbarTab: ToolbarTab;
  onOutlineChange: (outline: DocumentOutline[]) => void;
  onAddComment: (text: string, position: number) => void;
  onAddSuggestion: (type: "insert" | "delete" | "replace", text: string, position: number, originalText?: string) => void;
}

function OutlinePlugin({ onOutlineChange }: { onOutlineChange: (outline: DocumentOutline[]) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const outline: DocumentOutline[] = [];
        
        root.getChildren().forEach((node, index) => {
          if ($isHeadingNode(node)) {
            const text = node.getTextContent();
            const level = parseInt(node.getTag().substring(1)); // h1 -> 1, h2 -> 2, etc.
            
            if (text.trim()) {
              outline.push({
                id: `heading-${index}`,
                text: text.trim(),
                level,
                position: index,
              });
            }
          }
        });
        
        onOutlineChange(outline);
      });
    });
  }, [editor, onOutlineChange]);

  return null;
}

const initialConfig = {
  namespace: "DocumentEditor",
  theme,
  onError,
  nodes: [HeadingNode, ListNode, ListItemNode],
};

export const DocumentContent = ({ 
  activeToolbarTab, 
  onOutlineChange, 
  onAddComment, 
  onAddSuggestion 
}: DocumentContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleEditorChange = (editorState: EditorState) => {
    // Handle editor state changes
  };

  return (
    <div className="flex-1 bg-background">
      <div className="max-w-4xl mx-auto bg-editor border border-editor-border shadow-sm my-8 min-h-[800px]">
        <LexicalComposer initialConfig={initialConfig}>
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <div ref={contentRef} className="p-16">
                  <ContentEditable 
                    className="min-h-[600px] outline-none text-foreground leading-relaxed"
                  />
                </div>
              }
              placeholder={
                <div className="p-16 text-muted-foreground">
                  Start writing your document...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={handleEditorChange} />
            <HistoryPlugin />
            <ListPlugin />
            <OutlinePlugin onOutlineChange={onOutlineChange} />
          </div>
        </LexicalComposer>
      </div>
    </div>
  );
};