import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";
import {
  IMxGraphContext,
  MxGraphContext,
} from "../context/MxGraphContext";

interface ICommandConfig {
  shortcutCodes: string[];
  enable(): boolean;
  execute(): void;
}

interface IRegisterCommandProps {
  name: string;
  config: ICommandConfig;
}

export class RegisterCommand extends React.PureComponent<IRegisterCommandProps> {
  constructor(props: IRegisterCommandProps) {
    super(props);
  }

  public render(): React.ReactNode {
    return (
      <MxGraphContext.Consumer>{(value: IMxGraphContext) => {
        const { customCommand } = value;
        if (!customCommand) {
          throw new Error("no custome command in mxgraph component");
        }
        customCommand.push({name: this.props.name, config: this.props.config});
        return null;
      }}</MxGraphContext.Consumer>
    );
  }
}
