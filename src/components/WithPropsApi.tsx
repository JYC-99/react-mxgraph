import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";
import { IMxGraphContext, MxGraphContext } from "../context/MxGraphContext";
import { IEdge, IMxCell, } from "../types/mxGraph";
import {
  ICellModel,
  IEdgeModel,
  IModelEditor,
  INodeModel,
  IPropsAPI,
  isEdgeModel,
} from "../types/propsAPI";
const {
  mxConstants,
} = mxGraphJs;

// function isEdge(cell: ImxCell)

// tslint:disable-next-line: export-name no-any
export const withPropsApi = (WrappedComponent: any) =>
  class WithPropsApi extends React.PureComponent {

    public render(): JSX.Element {
      return (
        // tslint:disable-next-line: max-func-body-length
        <MxGraphContext.Consumer>{(value: IMxGraphContext) => {
          const {
            graph,
            actions,
            readData,
            insertVertex,
            insertEdge,
          } = value;
          if (graph && actions && insertEdge && insertVertex) {
            const graphModel = graph.getModel();
            const propsAPI: IPropsAPI = {
              graph,
              executeCommand: (command) => {
                if (!actions.hasOwnProperty(command)) {
                  throw new Error("this command is not initialized in action");
                }
                actions[command].func();
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
              save: () => {
                const tmp = graphModel.cells.map((cell) => propsAPI.getCellModel(cell));
                return { nodes: tmp.filter((cell) => !cell.edge), edges: tmp.filter((cell) => cell.edge) };
              },
              getCellModel: (cell: IMxCell) => {
                const geo = graphModel.getGeometry(cell);
                const style = graph.getCellStyle(cell);

                // tslint:disable-next-line: no-any
                const cellData: any = {
                  id: cell.id,
                  label: cell.value,
                  size: [geo.width, geo.height],
                  shape: style.shape,
                  color: style.fillColor,
                  edge: graphModel.isEdge(cell),
                };
                if (graphModel.isEdge(cell)) {
                  cellData.source = (cell as IEdge).source.id;
                  cellData.target = (cell as IEdge).target.id;
                  return (cellData as IEdgeModel);
                } else {
                  cellData.x = geo.x;
                  cellData.y = geo.y;
                  return (cellData as INodeModel);
                }
              },
              add: (model: ICellModel) => {
                const parent = graph.getDefaultParent();
                if (!(isEdgeModel(model))) {
                  insertVertex(parent, graph, model);
                } else {
                  const source = graphModel.getCell(model.source);
                  const target = graphModel.getCell(model.target);
                  if (source && target) {
                    insertEdge(parent, graph, model, source, target);
                  }
                }
              },
              update: (cell: IMxCell, model: IModelEditor) => {
                if (!cell || graph.isPort(cell)) {
                  return;
                }
                const { x, y, size, label, color } = model;
                const bounds = {
                  x: x ? x : cell.geometry.x,
                  y: y ? y : cell.geometry.y,
                  width: size ? size[0] : cell.geometry.width,
                  height: size ? size[1] : cell.geometry.height,
                };
                graph.model.beginUpdate();
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
                  graph.model.endUpdate();
                }
              },
              remove: (cell: IMxCell) => {

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
