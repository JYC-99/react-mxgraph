// tslint:disable: file-name-casing
import { storiesOf } from "@storybook/react";
import React from "react";

import {
  CanvasMenu,
  CanvasPanel,
  Command,
  RegisterCommand,
  IPropsAPI,
  withPropsApi,
  ContextMenu,
  DetailPanel,
  EdgeMenu,
  EdgePanel,
  Flow,
  Item,
  ItemPanel,
  MxGraph,
  NodePanel,
  PropsComponent,
  RegisterNode,
  TextEditor,
  Toolbar,
  ToolCommand,
  VertexMenu,
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
            <Item shape="ellipse">ellipse</Item>
            <Item shape="rhombus">rhombus</Item>
            <Item shape="cloud">cloud</Item>
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
              <Command name="zoomIn" text="ZoomIn" />
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
            <Item shape="rounded" size="70*30" model={{ color: "#FA8C16", label: "Item 1", }}>Rounded</Item>
            <Item shape="rounded2" size="200*60" model={{ color: "#FA8C16", label: "Item 1", }}>Rounded2</Item>
          </ItemPanel>
          <Flow data={data} />
          <RegisterNode name="rounded" config={{
            rounded: 1, fillColor: "white", points: [[0.5, 0], [0.5, 1], [0, 0.5], [1, 0.5]],
            fontColor: "grey", fontSize: 10, strokeWidth: 1, strokeColor: "grey", shadow: 1
          }} extend="rectangle" />
          <RegisterNode name="rounded2" config={{
            rounded: 1, fillColor: "white", points: [[0.5, 0], [0.5, 1], [0, 0.5], [1, 0.5]],
            fontColor: "grey", fontSize: 10, strokeWidth: 1, strokeColor: "grey", shadow: 1, arcSize: 50
          }} extend="rectangle" />
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
  }).add("withPropsAPI", () => {
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
    return (
      <div>
        <MxGraph>
          <Flow data={data} />
          <PropsComponent data={data2} />
        </MxGraph>
      </div>
    )
  }).add("registerCommand", () => {

    interface IProps {
      propsAPI: IPropsAPI;
    }

    class ACommand extends React.PureComponent<IProps> {
      public render(): React.ReactNode {
        const { propsAPI } = this.props;
        const { save, update, getSelected } = propsAPI;

        const config = {
          enable(): boolean {
            return true;
          },
          execute(): void {
            const chart = save();
            const selectedNodes = getSelected();
            selectedNodes.map((node) => {
              update(node, { x: node.geometry.x + 2 });
            });
          },
          shortcutCodes: ["ArrowRight"],
        };

        return <RegisterCommand name="moveRight" config={config} />;
      }
    }

    const CustomCommand = withPropsApi(ACommand);
    return (
      <div>
        <MxGraph>
          <Flow
            data={data}
            shortcut={{ moveRight: true }}
          />
          <p>select a cell then press arrowright to move it to right</p>
          <CustomCommand />
        </MxGraph>
      </div>
    );
  });
