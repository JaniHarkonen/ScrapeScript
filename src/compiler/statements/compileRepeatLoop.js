import Compilation from "../Compilation.js";
import Snippet from "../Snippet.js";
import Instruction from "../Instruction.js";

import compileAST from "../compiler.js";
import { OP } from "../OP.js";
import { compileOrReturn, formatNumber } from "../compilerUtils.js";


export default function compileWhileLoop(nTarget, context) {
    const argIterationCount = nTarget.arguments[0];
    const argBody = nTarget.arguments[1];

    const addrTemp = context.memory.getTempAddress();
    const compResult = new Compilation();

  context.startScope();
      // Compile iterator initialization
    const addrIterator = context.memory.getNewTempAddress();
    compResult.add(new Snippet(new Instruction(OP.set, addrIterator, formatNumber(0), addrIterator)));
    compResult.addIgnore(new Snippet(new Instruction(OP.BREAKABLE)));
    compResult.add(new Snippet(new Instruction(OP.jmpr, formatNumber(1))));   // Skip incrementation on the first iteration
    compResult.addIgnore(new Snippet(new Instruction(OP.LINE_CONTINUE)));
    compResult.add(new Snippet(new Instruction(OP.incr, addrIterator, addrIterator)));  // Add iterator incrementation

      // Compile iterator comparison
    const addrCount = context.memory.getNewTempAddress();
    const iterationCount = compileOrReturn(argIterationCount, context, compResult, addrCount);
    compResult.add(new Snippet(new Instruction(OP.less, addrIterator, iterationCount, addrTemp)));

      // Compile body using a new temporary address to prevent call stack pops from overriding the iterator
    context.memory.getNewTempAddress();

    const compBody = compileAST(argBody, context);
    compBody.add(new Snippet(new Instruction(OP.GOTO_CONTINUE)));
    compBody.addStart(new Snippet(new Instruction(OP.cmpr, addrTemp, formatNumber(compBody.length))));

    compResult.mergeEnd(compBody);
    compResult.addIgnore(new Snippet(new Instruction(OP.LINE_BREAK)));

  context.releaseScope();

  return compResult;
};