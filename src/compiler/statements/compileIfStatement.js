import Compilation from "../Compilation.js";
import Snippet from "../Snippet.js";
import Instruction from "../Instruction.js";

import compileAST from "../compiler.js";
import { compileOrReturn, formatNumber } from "../compilerUtils.js";
import { OP } from "../OP.js";


export default function compileIfStatement(nTarget, context) {
  const argCondition = nTarget.arguments[0];
  const argIfBody = nTarget.arguments[1];
  const argElseBody = nTarget.arguments[2];

  const addrTemp = context.memory.getTempAddress();
  const compResult = new Compilation();

  let opCondition = compileOrReturn(argCondition, context, compResult, addrTemp);
  let compIf = compileAST(argIfBody, context);
  let compElse;
  let lnEndIf = compIf.length;

  if( argElseBody )
  {
    compElse = compileAST(argElseBody, context);
    lnEndIf++;
  }

  compResult.add(new Snippet(new Instruction(OP.cmpr, opCondition, formatNumber(lnEndIf))));
  compResult.mergeEnd(compIf);

  if( compElse )
  {
    compResult.add(new Snippet(new Instruction(OP.jmpr, formatNumber(compElse.length))));
    compResult.mergeEnd(compElse);
  }

  return compResult;
};