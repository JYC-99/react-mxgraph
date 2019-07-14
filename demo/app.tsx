import * as React from "react";
import { hot } from "react-hot-loader";

import {
  Flow,
  MxGraph,
} from "../src/index";
import "./index.scss";

const Demo = () => (
  <div>
    <MxGraph>
      <Flow
        nodes={[]}
        edges={[]}
      />
    </MxGraph>
  </div>
);

export const App = hot(module)(Demo);