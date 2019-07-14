// tslint:disable:no-implicit-dependencies
import * as Lint from "tslint";
import { isClassDeclaration } from "tsutils";
import * as ts from "typescript";

// tslint:disable:export-name
// tslint:disable-next-line:use-react-pure-component
export class Rule extends Lint.Rules.AbstractRule {
  public static readonly AVOID_STRING = "extends React.Component";
  public static readonly FAILURE_STRING = "Use React.PureComponent instead";

  public static metadata: Lint.IRuleMetadata = {
    ruleName: "use-react-pure-component",
    description: "",
    rationale: "PureComponents help achieve better rendering perf",
    optionsDescription: "Not configurable",
    options: undefined,
    type: "functionality",
    typescriptOnly: false,
    hasFix: false
  };

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk);
  }
}

function walk(ctx: Lint.WalkContext<void>): void {
  ts.forEachChild(ctx.sourceFile, visitNode);

  function visitNode(node: ts.Node): void {
    if (isClassDeclaration(node)) {
      const classDeclaration = node.getText();

      if (classDeclaration.includes(Rule.AVOID_STRING)) {
        ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
      }
    }

    return ts.forEachChild(node, visitNode);
  }
}
