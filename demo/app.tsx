import * as React from "react";
import { hot } from "react-hot-loader";
import * as Fabric from "office-ui-fabric-react/lib";

import {
  FlowContextMenu,
  FlowCustomCommand,
  FlowDetailPanel,
  FlowItemPanel,
  FlowToolbar,
} from "./src/index";

import {
  Flow,
  // ItemPanel,
  Minimap,
  MxGraph,
  RegisterNode,
  // Minimap2,
} from "../src/index";
import "./index.scss";

const data = {
  nodes: [{
    type: "node",
    size: [70, 70],
    shape: "rounded",
    color: "#FFFFFF",
    label: "起止节点",
    x: 355,
    y: 55,
    id: "ea1184e8",
    index: 0,
  }, {
    type: "node",
    size: [70, 70],
    shape: "rounded2",
    color: "#FFFFFF",
    label: "结束节点",
    x: 355,
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

const data2 = {
  nodes: [{
    type: "node",
    size: [70, 70],
    shape: "rounded",
    color: "#FA8C16",
    label: "起止节点",
    x: 255,
    y: 55,
    id: "ea1184e9",
    index: 0,
  }, {
    type: "node",
    size: [70, 70],
    shape: "rounded2",
    color: "#FA8C16",
    label: "结束节点",
    x: 255,
    y: 255,
    id: "481fbb1b",
    index: 2,
  }],
  edges: [{
    source: "ea1184e9",
    sourceAnchor: 2,
    target: "481fbb1b",
    targetAnchor: 0,
    id: "7989ac71",
    index: 1,
  }],
};

const {
  Stack,
  Label,
} = Fabric;

import {
  detailPanelStyles,
  flowContainerStyles,
  itemPanelStyles,
  minimapStyles,
  panelAndMinimapStyles,
  stackItemStyles,
  verticalGapStackTokens,
  windowContainerStyles,
} from "./appStyle";


class Demo extends React.PureComponent {

  public render(): React.ReactNode {
    return (
      <div style={{ height: "800px" }}>
        <Stack styles={windowContainerStyles} >
          <MxGraph>
            <Stack >
              <FlowToolbar />
              <Stack horizontal>
                <Stack styles={itemPanelStyles}>
                  <FlowItemPanel />
                </Stack>
                <Stack styles={flowContainerStyles}>
                  <Flow
                    data={data}
                    shortcut={{ moveRight: true }}
                  />
                </Stack>

                <Stack styles={panelAndMinimapStyles} tokens={verticalGapStackTokens}>
                  <Stack.Item align="auto" styles={stackItemStyles}>
                    <Stack.Item align="start"><Label>DetailPanel</Label></Stack.Item>
                    <Stack.Item styles={detailPanelStyles}>
                      <FlowDetailPanel />
                    </Stack.Item>
                  </Stack.Item>
                  <Stack styles={minimapStyles}>
                    <Stack.Item align="start"><Label>Minimap</Label></Stack.Item>
                    <Stack.Item align="auto">
                      <Minimap />
                    </Stack.Item>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <FlowContextMenu />
            <RegisterNode name="rounded" config={{
              rounded: 1, fillColor: "white", points: [[0.5, 0], [0.5, 1], [0, 0.5], [1, 0.5]],
              fontColor: "grey", fontSize: 10, strokeWidth: 1, strokeColor: "grey", shadow: 1
            }} extend="rectangle" />
            <RegisterNode name="rounded2" config={{
              rounded: 1, fillColor: "white", points: [[0.5, 0], [0.33, 1], [0.67,1], [0, 0.5], [1, 0.5]],
              fontColor: "grey", fontSize: 10, strokeWidth: 1, strokeColor: "grey", shadow: 1, arcSize: 50
            }} extend="rectangle" />
            <FlowCustomCommand />
            {/* <Minimap2 /> */}
          </MxGraph>
        </Stack>
        
      </div>
    );
  }
}

// const Demo = () => (
//   <div>
//     <MxGraph>
//       <PropsComponent data={data2}/>
//       <ItemPanel>
//         <Item shape="rounded" size="70*30" model={{ color: "#FA8C16", label: "Item 1", }}>Rounded</Item>
//         <Item shape="rounded2" size="200*60" model={{ color: "#FA8C16", label: "Item 1", }}>Rounded2</Item>
//         <Item shape="ellipse" size="200*60" model={{ color: "#FA8C16", label: "Item 1", }}>Rounded2</Item>
//       </ItemPanel>
//       <Flow
//         data={data}
//         shortcut={{moveRight: true}}
//       />
//       <Toolbar>
//         <ToolCommand name="copy" >Copy  <span style={shortCutStyle}>Ctrl + C</span></ToolCommand>
//         <ToolCommand name="cut" >Cut  <span style={shortCutStyle}>Ctrl + X</span></ToolCommand>
//         <ToolCommand name="paste" >Paste  <span style={shortCutStyle}>Ctrl + V</span></ToolCommand>
//         <ToolCommand name="undo" >undo <span style={shortCutStyle}>Ctrl + Z</span></ToolCommand>
//         <ToolCommand name="redo" >redo</ToolCommand>
//         <ToolCommand name="zoomIn" >zoomIn</ToolCommand>
//         <ToolCommand name="zoomOut" >zoomOut</ToolCommand>
//         <ToolCommand name="deleteCell" >delete select cell  <span style={shortCutStyle}>Backspace</span></ToolCommand>
//         <ToolCommand name="fit" >fit</ToolCommand>
//       </Toolbar>
//       <ContextMenu>
//         <VertexMenu >
//           <Command name="copy" text="Copy" />
//           <Command name="cut" text="Cut" />
//           <Command name="separator" />
//           <Command name="toFront" text="to front" />
//           <Command name="toBack" text="to back" />
//           <Command name="separator" />
//           <Command name="paste" text="Paste" />
//         </VertexMenu>
//         <EdgeMenu >
//           <Command name="copy" text="Copy" />
//           <Command name="cut" text="Cut" />
//           <Command name="separator" />
//           <Command name="toFront" text="to front" />
//           <Command name="toBack" text="to back" />
//           <Command name="separator" />
//           <Command name="paste" text="Paste" />
//         </EdgeMenu>
//         <CanvasMenu>
//           <Command name="copy" text="Copy" />
//           <Command name="cut" text="Cut" />
//           <Command name="paste" text="Paste" />
//         </CanvasMenu>
//       </ContextMenu>
//       <DetailPanel >
//         <NodePanel >
//           <TextEditor name="cell" />
//         </NodePanel>
//         <EdgePanel >
//           <TextEditor name="cell" />
//         </EdgePanel>
//         <PortPanel>
//           <TextEditor name="cell" />
//         </PortPanel>
//       </DetailPanel>
//       <RegisterNode name="rounded" config={{
//         rounded: 1, fillColor: "white", points: [[0.5, 0], [0.5, 1], [0, 0.5], [1, 0.5]],
//         fontColor: "grey", fontSize: 10, strokeWidth: 1, strokeColor: "grey", shadow: 1
//       }} extend="rectangle" />
//       <RegisterNode name="rounded2" config={{
//         rounded: 1, fillColor: "white", points: [[0.5, 0], [0.5, 1], [0, 0.5], [1, 0.5]],
//         fontColor: "grey", fontSize: 10, strokeWidth: 1, strokeColor: "grey", shadow: 1, arcSize: 50
//       }} extend="rectangle" />
//       <CustomCommand />
//       <Minimap />
//     </MxGraph>
//   </div>

// );

export const App = hot(module)(Demo);
