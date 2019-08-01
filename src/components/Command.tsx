import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";

const {
  mxEvent,
} = mxGraphJs;

import {
  IMenuItemContext,
  MenuItemContext,
} from "../context/MenuContext";

export class Command extends React.PureComponent<{name: string; text?: string}> {
  constructor(props: {name: string; text?: string}) {
    super(props);
  }

  public render(): React.ReactNode {
    return (
      <MenuItemContext.Consumer>{(context: IMenuItemContext) => {
        const { addItem } = context;
        if (["copy", "cut", "paste", "separator"].indexOf(this.props.name) === -1) {
          throw new Error("Menu Item Type Error");
        }
        addItem(this.props.name, this.props.text ? this.props.text : "default");
        return null;
      }}</MenuItemContext.Consumer>
    );
  }

}
