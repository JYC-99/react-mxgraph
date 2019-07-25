// @ts-ignore
import * as mxGraphJs from "mxgraph-js";
import * as React from "react";

const {
  mxEvent,
} = mxGraphJs;

import {
  IMxGraphContext,
  MxGraphContext,
} from "../context/MxGraphContext";

import {
  IMenuArg,
  MenuContext,
} from "../context/MenuContext";

interface IContextMenuProps {
  data: Array<{
    name: string;
    items: IMenuArg[];
  }>;
}

export class ContextMenu extends React.PureComponent<IContextMenuProps> {

  constructor(props: {}) {
    console.log("context");
    super(props);
    this.items =  {
      vertex: [
        {
          menuItemType: "item",
          text: "this is a vertex",
          func(): void { alert("item 1"); },
        },
        {
          menuItemType: "separator",
        }
      ],
      edge: [
        {
          menuItemType: "item",
          text: "this is a menu edge",
          func(): void { alert("item 1"); },
        },
      ],
      canvas: [
        {
          menuItemType: "item",
          text: "this is a menu canvas",
          func(): void { alert("item 1"); },
        },
      ]
    };
    console.log(this.items);
  }

  public render(): React.ReactNode {
    console.log("render")
    return (
      <MenuContext.Provider value={{setItem: this.setItem}}>
        {this.props.children}
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
              /*
              console.log(this.props.data);
              const currentMenu = this.props.data.find((stateMenu) => {
                  return stateMenu.name === name;
              }) ;

              // console.log(this.items);
              // console.log(this.items.vertex);
              // const tmpval = "vertex";
              // const testmenu = this.items[tmpval];
              // console.log(testmenu);
              //if (!currentMenu) {
            //     console.log("erro");
            //   }
              if (currentMenu) {
                items = currentMenu.items;
              }
              */
              items = this.items[name];
              console.log("items", items);
              // items = this.items[name];
              if (items.length !== 0) {
                items.map((item) => {
                  const text = item.text ? item.text : "default";
                  // tslint:disable-next-line: prefer-switch
                  if (item.menuItemType === "item") {
                    // tslint:disable-next-line: no-unbound-method no-empty
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
            };
          }
          return null;
        }}
        </MxGraphContext.Consumer>
      </MenuContext.Provider>
    );
  }

  private readonly setItem = (name, item): void => {
    console.log("setItem", name, item);
    Object.assign(this.items[name], item);
  }
}
