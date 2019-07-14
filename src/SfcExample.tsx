import * as React from "react";

export const SfcExample: React.FunctionComponent<{ initialNumber: number }> = ({ initialNumber = 0 }): React.ReactElement => {
  const [count, setCount] = React.useState<number>(initialNumber);

  function onClick(): void {
    setCount(count + 1);
  }

  return (
    <div>
      <div>current count {count}</div>
      <button
        onClick={onClick}
      >
        button
      </button>
    </div>
  );
};
