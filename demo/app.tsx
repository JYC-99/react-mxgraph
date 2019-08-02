import * as React from "react";
import { hot } from "react-hot-loader";

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
  ToolCommand,
  Toolbar,
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
  },      {
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

const Demo = () => (
  <div>
    <MxGraph>
      <Toolbar>
        <ToolCommand name="copy" >Copy</ToolCommand>
        <ToolCommand name="cut" >Cut</ToolCommand>
        <ToolCommand name="paste" >Paste</ToolCommand>
      </Toolbar>
      {/* <ItemPanel>
        <Item text="test swimlane" shape={"swimlane"}>
          swimlane
        </Item>
        <Item text="test rectangle">
          rectangle
        </Item>
        <Item text="test ellipse" shape={"ellipse"}>
          ellipse
        </Item>
        <Item text="test rhombus" shape={"rhombus"}>
        rhombus
        </Item>
        <Item text="test triangle" shape={"triangle"}>
        triangle
        </Item>
        <Item text="test cylinder" shape={"cylinder"}>
        cylinder
        </Item>
        <Item text="test actor" shape={"actor"}>
        actor
        </Item>
      </ItemPanel> */}
      <Flow
        data={data}
      />
      <ContextMenu>
        <VertexMenu >
          <Command name="copy" text="Copy"/>
          <Command name="cut" text="Cut"/>
          <Command name="separator" />
          <Command name="paste" text="Paste"/>
        </VertexMenu>
        <EdgeMenu >
          <Command name="copy" text="Copy"/>
          <Command name="cut" text="Cut"/>
          <Command name="paste" text="Paste"/>
        </EdgeMenu>
        <CanvasMenu>
          <Command name="copy" text="Copy"/>
          <Command name="cut" text="Cut"/>
          <Command name="paste" text="Paste"/>
        </CanvasMenu>
      </ContextMenu>
    </MxGraph>
  </div>

);

export const App = hot(module)(Demo);
