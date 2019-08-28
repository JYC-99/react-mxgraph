import * as React from "react";

// // tslint:disable-next-line: export-name
// export function createMenu(MenuComponent, name): React.PureComponent {
//   return class extends React.PureComponent {
//     public render(): React.ReactNode {
//       return <MenuComponent name={name} {...this.props} />;
//     }
//   };
// }

// const withNameProps = <P extends object>(PanelComponent: React.ComponentType<P>, name: string) => {
//   return (
//     class WithNameProps extends React.PureComponent<P & WithNameProps> {
//       public render(): React.ReactNode {
//         return <PanelComponent {...this.props} name={name}/>;
//       }
//     };
//   )
// }

export interface InjectedProps {
  name: string;
}

// tslint:disable-next-line: no-any
export const withNameProps = (Component: any, name: string) =>
  class WithNameProps extends React.PureComponent {

    public render(): JSX.Element {
      return (
        <Component
          {...this.props}
          name={name}
        />
      );
    }
  };
