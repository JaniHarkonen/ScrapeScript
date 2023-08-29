import Instruction from "./Instruction.js";

import { OP } from "./OP.js";
import { formatLine } from "./compilerUtils.js";


export default class GeneratorContext {
  constructor() {
    this.asFunctionStack = [{}];
    this.breakGotoStack = [[]];
    this.continueLineStack = [];
    this.returnStack = [[]];
  }

  treatAsFunction(address, lineNumber) {
    const asFunctionStackJson = this.asFunctionStack[this.asFunctionStack.length - 1];
    asFunctionStackJson[address] = lineNumber;
  }

  getFunctionLine(address) {
    const stack = this.asFunctionStack;
    let functionLine;
    for( let i = stack.length - 1; (i >= 0 && functionLine === undefined); i-- )
    functionLine = stack[i][address];

    return functionLine;
  }

  createReturnContext() {
    this.returnStack.push([]);
  }

  releaseReturnContext() {
    this.returnStack.pop();
  }

  updateReturns(program, returnLineNumber) {
    for( const returnLine of this.returnStack[this.returnStack.length - 1] )
    program[returnLine] = (new Instruction(OP.jmp, formatLine(returnLineNumber))).create();
  }

  markReturn(lineNumber) {
    this.returnStack[this.returnStack.length - 1].push(lineNumber);
  }

  createFunctionContext() {
    this.asFunctionStack.push({});
  }

  releaseFunctionContext() {
    this.asFunctionStack.pop();
  }

  markContinueLine(lineNumber) {
    this.continueLineStack.push(lineNumber);
  }

  getContinueLine() {
    return this.continueLineStack[this.continueLineStack.length - 1];
  }

  releaseContinueLine() {
    this.continueLineStack.pop();
  }

  markBreakGoto(lineNumber) {
    this.breakGotoStack[this.breakGotoStack.length - 1].push(lineNumber);
  }

  updateBreakGotos(program, breakLineNumber) {
    for( const gotoLine of this.breakGotoStack[this.breakGotoStack.length - 1] )
    program[gotoLine] = (new Instruction(OP.jmp, formatLine(breakLineNumber))).create();
  }

  createBreakContext() {
    this.breakGotoStack.push([]);
  }

  releaseBreakContext() {
    this.breakGotoStack.pop();
  }
}
