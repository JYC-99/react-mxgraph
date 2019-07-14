import * as React from "react";

interface IMxGraphContext {
  graph?: object;
}

export const MxGraphContext = React.createContext<IMxGraphContext>({
  graph: undefined,
});
