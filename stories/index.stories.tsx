// tslint:disable: file-name-casing
import { storiesOf } from "@storybook/react";
import React from "react";

import {
  CanvasMenu,
  Command,
  ContextMenu,
  EdgeMenu,
  Flow,
  Item,
  ItemPanel,
  MxGraph,
  VertexMenu,
  Toolbar,
  ToolCommand,
  DetailPanel,
  NodePanel,
  EdgePanel,
  CanvasPanel,
  TextEditor,
} from "../src/index";
import "./index.scss";

const data = {
  nodes: [{
    type: "node",
    size: [70, 70],
    shape: "flow-circle",
    color: "#FA8C16",
    label: "起止节点",
    x: 55,
    y: 55,
    id: "ea1184e8",
    index: 0,
  }, {
    type: "node",
    size: [70, 70],
    shape: "flow-circle",
    color: "#FA8C16",
    label: "结束节点",
    x: 55,
    y: 255,
    id: "481fbb1a",
    index: 2,
  }],
  edges: [{
    source: "ea1184e8",
    sourceAnchor: 2,
    target: "481fbb1a",
    targetAnchor: 0,
    id: "7989ac70",
    index: 1,
  }],
};

storiesOf("Flow", module)
  .add("Basic flow", () => {
    const data = {
      nodes: [
        {
          type: "node",
          size: [70, 70],
          shape: "flow-circle",
          color: "#FA8C16",
          label: "起止节点",
          x: 55,
          y: 55,
          id: "ea1184e8",
          index: 0,
        },
        {
          type: "node",
          size: [70, 70],
          shape: "flow-circle",
          color: "#FA8C16",
          label: "结束节点",
          x: 55,
          y: 255,
          id: "481fbb1a",
          index: 2,
        }
      ],
      edges: [{
        source: "ea1184e8",
        sourceAnchor: 2,
        target: "481fbb1a",
        targetAnchor: 0,
        id: "7989ac70",
        index: 1,
      }],
    };
    return (
      <MxGraph>
        <Flow
          data={data}
        />
      </MxGraph>
    );
  })
  .add("Context menu", () => {
    return (
      <MxGraph>
        <Flow
          data={data}
        />
        <ContextMenu>
          <VertexMenu >
            <Command name="copy" text="Copy" />
            <Command name="cut" text="Cut" />
            <Command name="separator" />
            <Command name="deleteCell" text="Delete" />
          </VertexMenu>
          <EdgeMenu >
            <Command name="copy" text="Copy" />
            <Command name="cut" text="Cut" />
            <Command name="separator" />
            <Command name="deleteCell" text="Delete" />
          </EdgeMenu>
          <CanvasMenu>
            <Command name="paste" text="Paste" />
            <Command name="separator" />
            <Command name="undo" text="Undo" />
            <Command name="redo" text="Redo" />
            <Command name="separator" />
            <Command name="fit" text="Fit" />
            <Command name="zoomIn" text="ZoomIn" />
            <Command name="zoomOut" text="ZoomOut" />
          </CanvasMenu>
        </ContextMenu>
      </MxGraph>
    );
  })
  // tslint:disable-next-line: max-func-body-length
  .add("Item Panel", () => {
    return (
      <div>
        <MxGraph>
          <Flow data={data} />
          <ItemPanel>
            <Item config={{ shape: "rectangle", label: "rec", width: 100, height: 50, fillColor: "white", anchorPoints: [[0.5, 0], [0.5, 1], [0, 0.5], [1, 0.5]] }}>
              rectangle
            </Item>
            <Item config={{
              shape: "rectangle", rounded: 1, label: "rec", width: 100, height: 30, fillColor: "white", anchorPoints: [[0.5, 0], [0.5, 1], [0, 0.5], [1, 0.5]],
              fontColor: "grey", fontSize: 10, strokeWidth: 1, strokeColor: "grey"
            }}
            >
              <svg width="100" height="30" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="30" style={{fill: "white", stroke: "black"}}/>
              </svg>
            </Item>
            <Item config={{label: "ellipse", shape: "ellipse"}}>ellipse</Item>
            <Item config={{label: "rhombus", shape: "rhombus"}}>rhombus</Item>
            <Item config={{label: "cloud", shape: "cloud"}}>cloud</Item>
          </ItemPanel>
          <ContextMenu>
            <VertexMenu >
              <Command name="copy" text="Copy" />
              <Command name="cut" text="Cut" />
              <Command name="separator" />
              <Command name="paste" text="Paste" />
            </VertexMenu>
            <EdgeMenu >
              <Command name="copy" text="Copy" />
              <Command name="cut" text="Cut" />
              <Command name="paste" text="Paste" />
            </EdgeMenu>
            <CanvasMenu>
              <Command name="copy" text="Copy" />
              <Command name="cut" text="Cut" />
              <Command name="paste" text="Paste" />
              <Command name="zoomIn" text="ZoomIn"/>
            </CanvasMenu>
          </ContextMenu>
        </MxGraph>
      </div>
    );
  })
  .add("Command", () => {
    return (
      <div>
        <MxGraph>
          <Flow
            data={data}
          />
          <ContextMenu>
            <VertexMenu >
              <Command name="copy" text="Copy" />
              <Command name="cut" text="Cut" />
              <Command name="separator" />
              <Command name="deleteCell" text="Delete" />
            </VertexMenu>
            <EdgeMenu >
              <Command name="copy" text="Copy" />
              <Command name="cut" text="Cut" />
              <Command name="separator" />
              <Command name="deleteCell" text="Delete" />
            </EdgeMenu>
            <CanvasMenu>
              <Command name="paste" text="Paste" />
              <Command name="separator" />
              <Command name="undo" text="Undo" />
              <Command name="redo" text="Redo" />
              <Command name="separator" />
              <Command name="fit" text="Fit" />
            </CanvasMenu>
          </ContextMenu>
        </MxGraph>
      </div>
    );
  })
  .add("Toolbar", () => {
    return (
      <div>
        <MxGraph>
          <Flow
            data={data}
          />
          <Toolbar>
            <ToolCommand name="copy" >Copy</ToolCommand>
            <ToolCommand name="cut" >Cut</ToolCommand>
            <ToolCommand name="paste" >Paste</ToolCommand>
            <ToolCommand name="undo" >undo</ToolCommand>
            <ToolCommand name="redo" >redo</ToolCommand>
            <ToolCommand name="zoomIn" >zoomIn</ToolCommand>
            <ToolCommand name="zoomOut" >zoomOut</ToolCommand>
          </Toolbar>
        </MxGraph>
      </div>
    );
  }).add("RegisterShape", () => {
    return (
      <div>
        <MxGraph>
          <ItemPanel>
            <Item config={{ shape: "rectangle", label: "rec", width: 100, height: 50, fillColor: "white", anchorPoints: [[0.5, 0], [0.5, 1], [0, 0.5], [1, 0.5]] }}>
              rectangle
            </Item>
            <Item config={{
              shape: "rectangle", rounded: 1, label: "rec", width: 100, height: 30, fillColor: "white", anchorPoints: [[0.5, 0], [0.5, 1], [0, 0.5], [1, 0.5]],
              fontColor: "grey", fontSize: 10, strokeWidth: 1, strokeColor: "grey"
            }}
            >
              rectangle2
            </Item>
          </ItemPanel>
          <Flow
            data={data}
          />
          <Toolbar>
            <ToolCommand name="undo" >undo</ToolCommand>
            <ToolCommand name="redo" >redo</ToolCommand>
          </Toolbar>
        </MxGraph>
      </div>
    );
  }).add("textEditor", () => {
    return (
      <div>
        <MxGraph>
          <Flow data={data} />
          <DetailPanel>
            <NodePanel>
              <TextEditor />
            </NodePanel>
            <EdgePanel>
              <TextEditor />
            </EdgePanel>
            <CanvasPanel />
          </DetailPanel>
        </MxGraph>
      </div>
    );
  });
