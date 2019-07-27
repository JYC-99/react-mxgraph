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
  IMenuContext,
} from "../context/MenuContext";

export class Menu extends React.PureComponent {
  constructor(props:{}) {
    super(props);
    this.item = [
      {
        menuItemType: "item",
        text: "this is a sub menu for vertex",
        func(): void { alert("item 1"); },
      },
      {
        menuItemType: "separator",
      },
    ]
  }

  public render() {
    return (
      <MenuContext.Consumer>{(context: IMenuContext)=> {
        // console.log(context);
        const { setItem } = context;
        setItem(this.props.name, this.item);
      }}
      </MenuContext.Consumer>
    );
  }

}
