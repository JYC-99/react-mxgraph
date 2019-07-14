import * as React from "react";
import { hot } from "react-hot-loader";

import { Example, SfcExample } from "../src/index";
import "./index.scss";

const Demo = () => (
  <div>
    <Example />
    <SfcExample />
  </div>
);

export const App = hot(module)(Demo);