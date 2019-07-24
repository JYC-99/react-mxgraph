import * as React from "react";
// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

const {
  mxEvent,
} = mxGraphJs;

import {
  IMxGraphContext,
  MxGraphContext,
} from "../context/MxGraphContext";

import {
  IMenuArg,
} from "../context/MenuContext";

interface IContextMenuProps {
  data: Array<{
    name: string;
    items: IMenuArg[];
  }>;
}

interface IContextMenuState {
  menuItem: Array<{
    name: string;
    items: IMenuArg[];
  }>;
}

export class ContextMenu extends React.PureComponent<IContextMenuProps, IContextMenuState> {
  public render(): React.ReactNode {
    return (
      <MxGraphContext.Consumer>{(value: IMxGraphContext) => {
        const {
          graph,
        } = value;

        mxEvent.disableContextMenu(document.body);

        if (graph) {
          graph.popupMenuHandler.autoExpand = true;
          graph.popupMenuHandler.factoryMethod = (menu, cell, evt) => {
            let name = "item";
            if (cell === null) {
              name = "canvas";
            }
            else if (cell.vertex) {
              name = "vertex";
            }
            else if (cell.edge) {
              name = "edge";
            }
            let items: IMenuArg[] = [];
            const currentMenu = this.props.data.find((stateMenu) => {
              return stateMenu.name === name;
            }) ;
            if (currentMenu) {
              items = currentMenu.items;
            }
            if (items.length !== 0) {
              items.map((item) => {
                const text = item.text ? item.text : "default";
                if (item.menuItemType === "item") {
                  const func = item.func ? item.func : () => {}; // not this
                  menu.addItem(text, null, func);
                } else if (item.menuItemType === "separator") {
                  menu.addSeparator();
                } else {
                  throw new Error("Unknown menu item type");
                }
              });
            } else {
              throw new Error("Init menu failed");
            }
          }
        } else {
          console.log("graph hasn't initial");
        }
        return null;
      }}
      </MxGraphContext.Consumer>
    );
  }
}