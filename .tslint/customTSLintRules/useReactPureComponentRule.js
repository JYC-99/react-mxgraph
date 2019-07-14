"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
// tslint:disable:no-implicit-dependencies
var Lint = require("tslint");
var tsutils_1 = require("tsutils");
var ts = require("typescript");
// tslint:disable:export-name
// tslint:disable-next-line:use-react-pure-component
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    };
    Rule.AVOID_STRING = "extends React.Component";
    Rule.FAILURE_STRING = "Use React.PureComponent instead";
    Rule.metadata = {
        ruleName: "use-react-pure-component",
        description: "",
        rationale: "PureComponents help achieve better rendering perf",
        optionsDescription: "Not configurable",
        options: undefined,
        type: "functionality",
        typescriptOnly: false,
        hasFix: false
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
function walk(ctx) {
    ts.forEachChild(ctx.sourceFile, visitNode);
    function visitNode(node) {
        if (tsutils_1.isClassDeclaration(node)) {
            var classDeclaration = node.getText();
            if (classDeclaration.includes(Rule.AVOID_STRING)) {
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
        }
        return ts.forEachChild(node, visitNode);
    }
}
