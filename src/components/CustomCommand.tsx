import * as React from "react";
import { RegisterCommand, withPropsApi } from "../index";

import { IPropsAPI } from "../components/WithPropsApi";

interface IProps {
  propsAPI: IPropsAPI;
}

class ACommand extends React.PureComponent<IProps> {

  public render(): React.ReactNode {
    console.log("render");
    const { propsAPI } = this.props;
    const { save, update, getSelected } = propsAPI;

    const config = {
      enable(): boolean {
        return true;
      },
      execute(): void {
        const chart = save();
        const selectedNodes = getSelected();
        console.log(selectedNodes);
        selectedNodes.map((node) => {
          update(node, {x : node.geometry.x + 2});
        });
      },
      shortcutCodes: ["ArrowRight"],
    };

    return <RegisterCommand name="moveRight" config={config} />;
  }
}

export const CustomCommand = withPropsApi(ACommand);
