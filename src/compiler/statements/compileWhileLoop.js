import Compilation from "../Compilation.js";
import Snippet from "../Snippet.js";
import Instruction from "../Instruction.js";

import compileAST from "../compiler.js";
import { OP } from "../OP.js";
import { compileOrReturn, formatNumber } from "../compilerUtils.js";


export default function compileWhileLoop(nTarget, context) {
  const argCondition = nTarget.arguments[0];
  const argBody = nTarget.arguments[1];

  const compResult = new Compilation();
  compResult.addIgnore(new Snippet(new Instruction(OP.LINE_CONTINUE)));
  compResult.addIgnore(new Snippet(new Instruction(OP.BREAKABLE)));

  const addrTemp = context.memory.getTempAddress();
  const condition = compileOrReturn(argCondition, context, compResult, addrTemp);

  context.startScope();
  context.memory.getNewTempAddress();
    const compBody = compileAST(argBody, context, compResult);
    compBody.add(new Snippet(new Instruction(OP.GOTO_CONTINUE)));

    compResult.add(new Snippet(new Instruction(OP.cmpr, condition, formatNumber(compBody.length))));
    compResult.mergeEnd(compBody);
    
    compResult.addIgnore(new Snippet(new Instruction(OP.LINE_BREAK)));
  context.releaseScope();

  return compResult;
};