import * as React from "react";

// export interface IToolItemContext {
//   enabled: boolean;
//   addToolItem(name: string, func: () => void): void;
// }

// export const ToolItemContext = React.createContext<IToolItemContext>({
//   enabled: false,
//   // tslint:disable-next-line: no-empty
//   addToolItem: () => { },
// });

export class Toolbar extends React.PureComponent<{ name: string }> {
  // public tool: Array<{
  //   toolItemType: string;
  // }>;
  // constructor(props: { name: string }) {
  //   super(props);
  //   this.tool = [];
  // }

  public render(): React.ReactNode {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }

}
