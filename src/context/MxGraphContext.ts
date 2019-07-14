import * as React from "react";

interface IMxGraphContext {
  mxClient?: object;
  graph?: object;
}

export const MxGraphContext = React.createContext<IMxGraphContext>({
  mxClient: undefined,
  graph: undefined,
});
