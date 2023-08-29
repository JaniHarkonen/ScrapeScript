import fs from "fs";
import path from "path";
import tokenize from "../tokenizer/tokenizer.js";
import parse, { OPERATIONS } from "./parser.js";
import { combineBlocks } from "./parserUtils.js";


export default function link(source) {
  const scriptString = fs.readFileSync(source).toString();  // Read source from file
  const tokens = tokenize(scriptString).tokens; // Tokenize
  const ast = parse(tokens)[0]; // Parse into an AST

    // Resolve import-statements (linker)
  let resultAST = ast;
  let imprt = ast.operations[0];
  while( imprt.operator === OPERATIONS.import )
  {
    const importPath = path.join(path.parse(source).dir, imprt.arguments[0]);
    ast.operations.shift();
    resultAST = combineBlocks(ast, link(importPath));
    imprt = ast.operations[0];
  }

  return resultAST;
}
