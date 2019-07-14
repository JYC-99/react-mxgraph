import * as React from "react";

export interface IExampleProps {
  initialCount?: number;
}

interface IExampleStates {
  count: number;
}

export class Example extends React.PureComponent<
  IExampleProps,
  IExampleStates
> {
  constructor({
    initialCount = 0,
  }: IExampleProps) {
    super({
      initialCount,
    });

    this.state = {
      count: initialCount,
    };
  }

  public render(): React.ReactNode {
    return (
      <div>
        <div>current count {this.state.count}</div>
        <button
          onClick={this._handleClick}
        >
          click me
        </button>
      </div>
    );
  }

  private readonly _handleClick = () => {
    this.setState((curState) => ({
      count: curState.count + 1,
    }));
  }
}
