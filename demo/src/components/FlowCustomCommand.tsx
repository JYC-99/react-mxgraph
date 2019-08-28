import * as React from "react";
import { RegisterCommand, withPropsApi } from "../../../src/index";

import { IPropsAPI } from "../../../src/types/propsAPI";

interface IProps {
  propsAPI: IPropsAPI;
}

class CustomCommand extends React.PureComponent<IProps> {

  public render(): React.ReactNode {
    // console.log("render");
    const { propsAPI } = this.props;
    const { update, getSelected } = propsAPI;

    const config = {
      enable(): boolean {
        return true;
      },
      execute(): void {
        // const chart = save();
        const selectedNodes = getSelected();
        // console.log(selectedNodes);
        selectedNodes.map((node) => {
          update(node, {x : node.geometry.x + 2});
        });
      },
      shortcutCodes: ["ArrowRight"],
    };

    return <RegisterCommand name="moveRight" config={config} />;
  }
}

export const FlowCustomCommand = withPropsApi(CustomCommand);
