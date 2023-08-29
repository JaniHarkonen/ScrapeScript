import Compilation from "../Compilation.js";
import Snippet from "../Snippet.js";
import Instruction from "../Instruction.js";

import compileAST from "../compiler.js";
import { OP } from "../OP.js";
import { compileOrReturn, formatNumber } from "../compilerUtils.js";


export default function compileWhileLoop(nTarget, context) {
  const argBody = nTarget.arguments[0];
  const argCondition = nTarget.arguments[1];

  const compResult = new Compilation();
  compResult.addIgnore(new Snippet(new Instruction(OP.LINE_CONTINUE)));
  compResult.addIgnore(new Snippet(new Instruction(OP.BREAKABLE)));

  const compBody = compileAST(argBody, context);
  compResult.mergeEnd(compBody);
  
  const addrTemp = context.memory.getTempAddress();
  const condition = compileOrReturn(argCondition, context, compResult, addrTemp);
  compResult.add(new Snippet(new Instruction(OP.cmpr, condition, formatNumber(1))));
  compResult.add(new Snippet(new Instruction(OP.GOTO_CONTINUE)));
  compResult.addIgnore(new Snippet(new Instruction(OP.LINE_BREAK)));

  return compResult;
};