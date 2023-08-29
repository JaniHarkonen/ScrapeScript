import Compilation from "../Compilation.js";
import Snippet from "../Snippet.js";
import Instruction from "../Instruction.js";

import compileAST from "../compiler.js";
import { OP } from "../OP.js";
import { compileOrReturn, formatLine, formatNumber } from "../compilerUtils.js";


export default function compileForLoop(nTarget, context) {
  const argInitialization = nTarget.arguments[0];
  const argCondition = nTarget.arguments[1];
  const argModification = nTarget.arguments[2];
  const argBody = nTarget.arguments[3];

  const addrTemp = context.memory.getTempAddress();
  const compResult = new Compilation();
  compResult.addIgnore(new Snippet(new Instruction(OP.BREAKABLE)));

    // Compile initialization
  if( argInitialization )
  {
    const initialization = compileAST(argInitialization, context);
    compResult.mergeEnd(initialization);
  }

  const snpContinueLine = new Snippet(new Instruction(OP.LINE_CONTINUE));

    // Compile modification
  if( argModification )
  {
    const compModify = compileAST(argModification, context);
    compResult.add(new Snippet(new Instruction(OP.jmpr, formatLine(compModify.length)))); // Jump to avoid modification on the first iteration
    compResult.addIgnore(snpContinueLine);
    compResult.mergeEnd(compModify);
  }
  else
  compResult.addIgnore(snpContinueLine);

    // Compile condition
  const compBody = compileAST(argBody, context);
  compBody.add(new Snippet(new Instruction(OP.GOTO_CONTINUE)));

    // Merge body and finalize
  if( argCondition )
  {
    const condition = compileOrReturn(argCondition, context, compResult, addrTemp);
    compResult.add(new Snippet(new Instruction(OP.cmpr, condition, formatNumber(compBody.length))));
  }
  
  compResult.mergeEnd(compBody);
  compResult.addIgnore(new Snippet(new Instruction(OP.LINE_BREAK)));
  return compResult;
};