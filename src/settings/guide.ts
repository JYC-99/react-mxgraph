// @ts-ignore
import * as mxGraphJs from "mxgraph-js";
import { IMxGraph } from '../types/mxGraph';
const {
    mxConstants,
    mxEvent,
    mxEdgeHandler,
    mxGraphHandler,
} = mxGraphJs;

// graph.moveCells(graph.getSelectionCells(), dx, dy);

// tslint:disable-next-line: export-name
export const initGuides = (graph: IMxGraph) => {
  mxGraphHandler.prototype.guidesEnabled = true;
  // console.log(graph.graphHandler.guideEnabled);
  //   graph.graphHandler.guideEnabled = true;
  //   // graph.graphHandler.useGuidesForEvent = function (me) {
  //   //     return !mxEvent.isAltDown(me.getEvent());
  //   // };
  //   console.log(graph.graphHandler.guideEnabled);
    // // Defines the guides to be red (default)
    mxConstants.GUIDE_COLOR = '#135995';

    // // Defines the guides to be 1 pixel (default)
    // mxConstants.GUIDE_STROKEWIDTH = 1;

    // // Enables snapping waypoints to terminals
    // mxEdgeHandler.prototype.snapToTerminals = true;

    graph.gridSize = 10;
}
