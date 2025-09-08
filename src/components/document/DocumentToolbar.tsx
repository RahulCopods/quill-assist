import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from "@lexical/list";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const DocumentToolbar = () => {
  const [editor] = useLexicalComposerContext();

  const formatText = (format: 'bold' | 'italic' | 'underline') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatElement = (format: 'left' | 'center' | 'right') => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format);
  };

  const formatHeading = (headingSize: string) => {
    if (headingSize === 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    } else {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize as 'h1' | 'h2' | 'h3'));
        }
      });
    }
  };

  const insertList = (listType: 'bullet' | 'number') => {
    if (listType === 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* Text formatting */}
      <Button variant="ghost" size="sm" onClick={() => formatText('bold')}>
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => formatText('italic')}>
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => formatText('underline')}>
        <Underline className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-2" />
      
      {/* Heading selector */}
      <Select onValueChange={formatHeading}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Normal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paragraph">Normal</SelectItem>
          <SelectItem value="h1">Heading 1</SelectItem>
          <SelectItem value="h2">Heading 2</SelectItem>
          <SelectItem value="h3">Heading 3</SelectItem>
        </SelectContent>
      </Select>
      
      <Separator orientation="vertical" className="h-6 mx-2" />
      
      {/* Alignment */}
      <Button variant="ghost" size="sm" onClick={() => formatElement('left')}>
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => formatElement('center')}>
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => formatElement('right')}>
        <AlignRight className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-2" />
      
      {/* Lists */}
      <Button variant="ghost" size="sm" onClick={() => insertList('bullet')}>
        <List className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertList('number')}>
        <ListOrdered className="h-4 w-4" />
      </Button>
    </div>
  );
};