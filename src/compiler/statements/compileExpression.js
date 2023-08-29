import Snippet from "../Snippet.js";
import Compilation from "../Compilation.js";
import Instruction from "../Instruction.js";

import { compileOrReturn } from "../compilerUtils.js";
import { getOpCode } from "../OP.js";


export default function compileExpression(nTarget, context) {
  const arg1 = nTarget.arguments[0];
  const arg2 = nTarget.arguments[1];

  let op1;
  let op2;
  const op = getOpCode(nTarget.operator);
  const compResult = new Compilation();
  const iExpression = new Instruction(op);
  const addrTemp = context.memory.getTempAddress();

    // Resolve first operand
  op1 = compileOrReturn(arg1, context, compResult, addrTemp);
  iExpression.pushOperand(op1);

    // Resolve second operand
  context.startScope();
    op2 = context.memory.getNewTempAddress();
    op2 = compileOrReturn(arg2, context, compResult, op2);

    if( op2 )
    iExpression.pushOperand(op2);
  context.releaseScope();

  iExpression.pushOperand(addrTemp);
  compResult.add(new Snippet(iExpression));
  return compResult;
};