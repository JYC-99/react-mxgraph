import * as React from "react";

// @ts-ignore
import * as mxGraphJs from "mxgraph-js";
import { ImxCell, IMxGraph } from '../types/mxGraph';
import { IMxGraphContext, MxGraphContext } from '../context/MxGraphContext';

const {

} = mxGraphJs;

interface IPropAPI {
  graph: IMxGraph;
  executeCommand: (command: string) => void;
  find: (id: string) => ImxCell;
}

function withPropsApi(WrappedComponent): React.PureComponent {
  return class extends React.PureComponent {

    constructor(props: {}) {
      super(props);
    }

    public render(): React.ReactNode {
      return (
        <MxGraphContext.Consumer>{(value: IMxGraphContext) => {
          const { graph, action } = value;
          if (graph && action) {
            const propsAPI: IPropAPI = {
              graph,
              executeCommand: (command) => {
                if (!action.hasOwnProperty(command)) {
                  throw new Error("this command is not initialized in action");
                }
                const func = command === "paste" ?
                  action.paste.getFunc() :
                  action[command].func;
                func();
              },
              find: (id) => {
                return graph.getModel().getCell(id);
              },
            };
            return <WrappedComponent propsAPI={propsAPI} {...this.props} />;
          } else {
            return null;
          }
        }}
        </MxGraphContext.Consumer>
      );
    }
  }
}

interface IProps {
  propsAPI: any;
}

// tslint:disable-next-line: max-classes-per-file
class TestComponent extends React.PureComponent<IProps, {value: string, cellV: string}> {
  constructor(props) {
    super(props);
    console.log("construct");
    this.state = {
      value: "",
      cellV: "no find",
    };
  }
  componentDidMount() {
    console.log("did mount");
    const { propsAPI } = this.props;
    console.log(propsAPI.graph);
  }

  public render(): React.ReactNode {
    const { propsAPI } = this.props;
    console.log(propsAPI.graph.getModel(), "render", propsAPI.find("481fbb1a"));
    return (
      <div>
        <p>test with props api component</p>
        <button onClick={this.testExeCopy} >test exe copy</button>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label >
              cell id:
              <input type="text" value={this.state.value} onChange={this.handleChange}/>
            </label>
          </div>
          <div>
            <input type="submit" value="find" />
          </div>
          {this.state.cellV}
        </form>
      </div>
    );
  }

  public handleChange = (event: React.SyntheticEvent) => {
    this.setState({value: event.target.value});
  }

  public handleSubmit = (event) => {
    event.preventDefault();
    const cell = this.props.propsAPI.find(this.state.value);
    const val = cell ? cell.value : "no found"
    this.setState({cellV: val});
    console.log("to find", this.state.value, val, this.state.cellV);
  }

  public testExeCopy = () => {
    this.props.propsAPI.executeCommand("copy");
  }
}

export const PropsComponent = withPropsApi(TestComponent);
