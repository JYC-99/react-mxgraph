import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";
import { IMxGraphContext, MxGraphContext } from "../context/MxGraphContext";
import {
  ICanvasData,
  ICanvasEdge,
  ICanvasNode,
} from "../types/flow";
import { ImxCell, IMxGraph } from "../types/mxGraph";
import { shapeDictionary } from "../types/shapes";

const {
  mxConstants,
} = mxGraphJs;

export interface IPropsAPI {
  graph: IMxGraph;
  executeCommand(command: string): void;
  find(id: string): ImxCell;
  getSelected(): ImxCell[];
  read(data: ICanvasData): void;
  save(): object;
  add(name: "node" | "edge", model): void;
  update(cell: ImxCell, model): void;
  remove(cell: ImxCell): void;
}

// tslint:disable-next-line: max-func-body-length
export function withPropsApi(WrappedComponent): React.PureComponent {
  return class extends React.PureComponent {

    constructor(props: {}) {
      super(props);
    }
    // tslint:disable-next-line: max-func-body-length
    public render(): React.ReactNode {
      return (
        // tslint:disable-next-line: max-func-body-length
        <MxGraphContext.Consumer>{(value: IMxGraphContext) => {
          const {
            graph,
            action,
            readData,
            insertVertex,
            insertEdge,
          } = value;
          if (graph && action) {
            const propsAPI: IPropsAPI = {
              graph,
              executeCommand: (command) => {
                if (!action.hasOwnProperty(command)) {
                  throw new Error("this command is not initialized in action");
                }
                const func = command === "paste" ?
                  action.paste.getFunc() :
                  action[command].func;
                func();
              },
              find: (id) => {
                return graph.getModel()
                  .getCell(id);
              },
              getSelected: () => {
                return graph.getSelectionCells();
              },
              read: (data) => {
                readData(graph, data);
              },
              // tslint:disable-next-line: cyclomatic-complexity
              save: () => {
                const model = graph.getModel();
                const data: ICanvasData = { nodes: [], edges: [] };
                // formate
                for (const [id, cell] of Object.entries(model.cells)) {
                  if (model.isEdge(cell)) {
                    const cellData: ICanvasEdge = {};
                    if (cell.source) { cellData.source = cell.source.id; }
                    if (cell.target) { cellData.target = cell.target.id; }
                    cellData.id = id;
                    data.edges.push(cellData);
                  } else if (model.isVertex(cell)) {
                    const cellData: ICanvasNode = {};
                    if (cell.value) { cellData.label = cell.value; }
                    cellData.id = id;
                    if (cell.geometry) {
                      cellData.size = [cell.geometry.width, cell.geometry.height];
                    }
                    const style = graph.getCellStyle(cell);
                    cellData.shape = style.shape;
                    data.nodes.push(cellData);
                  } else {
                    // do nothing
                  }
                }
                return data;
              },
              add: (name: string, model: ICanvasEdge | ICanvasNode) => {
                const parent = graph.getDefaultParent();
                // tslint:disable-next-line: prefer-switch
                if (name === "node") {
                  insertVertex(parent, graph, model);
                } else if (name === "edge") {
                  const source = graph.getModel()
                    .getCell(model.source);
                  const target = graph.getModel()
                    .getCell(model.target);
                  if (source && target) {
                    insertEdge(parent, graph, model, source, target);
                  }
                }
              },
              update: (cell: ImxCell, model: ICanvasEdge | ICanvasNode) => {
                if (!cell) {
                  return;
                }
                const { x, y, size, label, color } = model;
                const bounds = {
                  x: x ? x : cell.geometry.x,
                  y: y ? y : cell.geometry.y,
                  width: (size && size[0]) ? size[0] : cell.geometry.width,
                  height: (size && size[1]) ? size[1] : cell.geometry.height,
                };
                graph
                  .getModel()
                  .beginUpdate();
                try {
                  // resize
                  graph.resizeCell(cell, bounds);
                  // label
                  if (label) {
                    graph
                      .getModel()
                      .setValue(cell, label);
                  }
                  // update style by model
                  if (color) {
                    graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, color, [cell]);
                  }
                } finally {
                  graph
                    .getModel()
                    .endUpdate();
                }
              },
              remove: (cell: ImxCell) => {

                if (cell) {
                  graph.removeCells([cell]);
                } else {
                  //
                }
              }
            };
            return <WrappedComponent propsAPI={propsAPI} {...this.props} />;
          } else {
            return null;
          }
        }}
        </MxGraphContext.Consumer>
      );
    }
  };
}

interface IProps {
  propsAPI: IPropsAPI;
  data: ICanvasData;
}

// tslint:disable-next-line: max-classes-per-file
class TestComponent extends React.PureComponent<IProps, { value: string; cellV: string }> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      value: "",
      cellV: "no find",
    };
  }

  public render(): React.ReactNode {
    return (
      <div>
        <p>test with props api component</p>
        <button onClick={this.testExeCopy} >test exe copy</button>
        <button onClick={this.getSelectionStyle} >style of selected cell</button>
        <button onClick={this.testReadData} >test read data</button>
        <button onClick={this.testSaveData} >test save data</button>
        <button onClick={this.testAddCell} >test add cell</button>
        <button onClick={this.testUpdateCell} >test update cell</button>
        <button onClick={this.testRemoveCell} >test remove cell</button>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label >
              cell id:
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
          </div>
          <div>
            <input type="submit" value="find" />
          </div>
          {this.state.cellV}
        </form>
      </div>
    );
  }

  public handleChange = (event: React.SyntheticEvent) => {
    this.setState({ value: event.target.value });
  }

  public handleSubmit = (event) => {
    event.preventDefault();
    const cell = this.props.propsAPI.find(this.state.value);
    const val = cell ? cell.value : "no found";
    this.setState({ cellV: val });
  }

  public getSelectionStyle = () => {
    const cell = this.props.propsAPI.getSelected();
    const graph = this.props.propsAPI.graph;
    // console.log(cell[0], graph.getCellStyle(cell[0]));
  }

  public testUpdateCell = () => {
    const cell = this.props.propsAPI.find("22");
    if (!cell) {
      return;
    }
    this.props.propsAPI.update(cell, {
      size: [30, 70],
      x: cell.geometry.x - 10,
      y: cell.geometry.y - 10,
      label: "test",
      color: "#CCCCCC",
    });
  }

  public testRemoveCell = () => {
    const cell = this.props.propsAPI.find("20");
    this.props.propsAPI.remove(cell);
  }

  public testExeCopy = () => {
    this.props.propsAPI.executeCommand("copy");
  }

  public testReadData = () => {
    this.props.propsAPI.read(this.props.data);
  }

  public testSaveData = () => {
    // tslint:disable-next-line: no-console
    console.log(this.props.propsAPI.save());
  }

  public testAddCell = () => {
    this.props.propsAPI.add("node",
      {
        name: "node",
        size: [100, 30],
        shape: "rounded",
        label: "add1",
        x: 355,
        y: 255,
        id: "20",
      });
    this.props.propsAPI.add("node",
      {
        name: "node",
        size: [100, 30],
        shape: "rounded",
        label: "add2",
        x: 355,
        y: 355,
        id: "22",
      });
    this.props.propsAPI.add("edge",
      {
        source: "20",
        target: "22",
        id: "21",
      });
  }
}

// tslint:disable-next-line: export-name
export const PropsComponent = withPropsApi(TestComponent);
