import * as React from "react";
import { ICanvasData } from "../types/flow";
interface IFlowProps {
    data: ICanvasData;
}
export declare class Flow extends React.PureComponent<IFlowProps> {
    render(): React.ReactNode;
}
export {};
