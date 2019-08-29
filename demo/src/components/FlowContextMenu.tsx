import * as React from "react";
import {
  ContextMenu,
  VertexMenu,
  EdgeMenu,
  CanvasMenu,
  Command,
} from "../../../src/index";


export const FlowContextMenu = () => {
  return (
    <ContextMenu>
      <VertexMenu >
        <Command name="copy" text="Copy" />
        <Command name="cut" text="Cut" />
        <Command name="separator" />
        <Command name="toFront" text="to front" />
        <Command name="toBack" text="to back" />
        <Command name="separator" />
        <Command name="paste" text="Paste" />
      </VertexMenu>
      <EdgeMenu >
        <Command name="copy" text="Copy" />
        <Command name="cut" text="Cut" />
        <Command name="separator" />
        <Command name="toFront" text="to front" />
        <Command name="toBack" text="to back" />
        <Command name="separator" />
        <Command name="paste" text="Paste" />
      </EdgeMenu>
      <CanvasMenu>
        <Command name="copy" text="Copy" />
        <Command name="cut" text="Cut" />
        <Command name="pasteHere" text="Paste" />
      </CanvasMenu>
    </ContextMenu>
  );
}