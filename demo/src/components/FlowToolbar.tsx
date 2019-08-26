import * as React from "react";

import * as Fabric from "office-ui-fabric-react";

const {
  Stack,
  IconButton,
  initializeIcons,
  FontIcon,
} = Fabric;

import {
  Toolbar,
  ToolCommand,
} from "../../../src/index";

import {
  toolbarStyles,
  toolbarTokens,
} from "../../appStyle";

initializeIcons();

export const FlowToolbar = () => {
  return (
    <Toolbar>
      <Stack horizontal={true} styles={toolbarStyles} tokens={toolbarTokens}>
        <ToolCommand name="copy" ><IconButton iconProps={{ iconName: "Copy" }} /></ToolCommand>
        <ToolCommand name="cut" ><IconButton iconProps={{ iconName: "Cut" }} /></ToolCommand>
        <ToolCommand name="paste" ><IconButton iconProps={{ iconName: "Paste" }} /></ToolCommand>
        <IconButton iconProps={{ iconName: "Separator" }} disabled={true}/>
        <ToolCommand name="undo" ><IconButton iconProps={{ iconName: "Undo" }} /></ToolCommand>
        <ToolCommand name="redo" ><IconButton iconProps={{ iconName: "Redo" }} /></ToolCommand>
        <IconButton iconProps={{ iconName: "Separator" }} disabled={true}/>
        <ToolCommand name="zoomIn" ><IconButton iconProps={{ iconName: "ZoomIn" }} /></ToolCommand>
        <ToolCommand name="zoomOut" ><IconButton iconProps={{ iconName: "ZoomOut" }} /></ToolCommand>
        <ToolCommand name="fit" ><IconButton iconProps={{ iconName: "ZoomToFit" }} /></ToolCommand>
        <ToolCommand name="actual" ><IconButton iconProps={{ iconName: "FitPage" }} /></ToolCommand>
        <IconButton iconProps={{ iconName: "Separator" }} disabled={true}/>
        <ToolCommand name="deleteCell" ><IconButton iconProps={{ iconName: "Delete" }} /></ToolCommand>
      </Stack>
    </Toolbar>
  );
}
