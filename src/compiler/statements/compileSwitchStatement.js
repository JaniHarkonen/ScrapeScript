import Compilation from "../Compilation.js";
import Snippet from "../Snippet.js";
import Instruction from "../Instruction.js";

import compileAST from "../compiler.js";
import { OP } from "../OP.js";
import { compileOrReturn, formatNumber } from "../compilerUtils.js";
import { OPERATIONS } from "../../parser/parser.js";


export default function compileSwitchStatement(nTarget, context) {
  const argSwitchExpression = nTarget.arguments[0];
  const addrTemp = context.memory.getTempAddress();
  const compResult = new Compilation();
  compResult.addIgnore(new Snippet(new Instruction(OP.BREAKABLE)));

    // Compile swithc expression being compared
  const switchExpression = compileOrReturn(argSwitchExpression, context, compResult, addrTemp);

    // Compile cases
  context.startScope();
    const addrCaseTemp = context.memory.getNewTempAddress();
    let compDefaultBody;

    for( let i = 1; i < nTarget.arguments.length; i++ )
    {
      const targetCase = nTarget.arguments[i];

        // Compile default-block and store it
      if( targetCase.arguments[0].operator && targetCase.arguments[0].operator === OPERATIONS.default )
      {
        compDefaultBody = compileAST(targetCase.arguments[1], context);
        continue;
      }

      const caseExpression = compileOrReturn(targetCase.arguments[0], context, compResult, addrCaseTemp);
      compResult.add(new Snippet(new Instruction(OP.equ, switchExpression, caseExpression, addrCaseTemp)));

      const compCaseBody = compileAST(targetCase.arguments[1], context);
      compResult.add(new Snippet(new Instruction(OP.cmpr, addrCaseTemp, formatNumber(compCaseBody.length))));
      compResult.mergeEnd(compCaseBody);
    }
  context.releaseScope();

    // Add the default-body if it exists
  if( compDefaultBody )
  compResult.mergeEnd(compDefaultBody);

  compResult.addIgnore(new Snippet(new Instruction(OP.LINE_BREAK)));

  return compResult;
};