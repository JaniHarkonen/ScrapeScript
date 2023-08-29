import CompilerContext from "./CompilerContext.js";
import GeneratorContext from "./GeneratorContext.js";
import Instruction from "./Instruction.js";
import Program from "./Program.js";

import compileAST from "./compiler.js";
import { OP } from "./OP.js";
import { formatLine } from "./compilerUtils.js";
import { TYPE_SIGNIFIERS } from "./TYPE_SIGNIFIERS.js";
import { ERRORS, throwFatalError } from "../ERRORS.js";


export default function generate(astNode) {
  if( !astNode )
  throwFatalError(ERRORS.generator, ERRORS.generator.nullASTNode);

  const compilerContext = new CompilerContext();
  const intermediaryCompilation = compileAST(astNode, compilerContext);

  const program = new Program();
  let snippet = intermediaryCompilation.head;

  const generatorContext = new GeneratorContext();
  let lineCount = 0;
  while( snippet )
  {
    for( let i = 0; i < snippet.lines.length; i++ )
    {
      let instruction = snippet.lines[i];

      if( instruction.opCode.charAt(0) === TYPE_SIGNIFIERS.meta )
      {
        switch( instruction.opCode )
        {
          case OP.AS_FUNCTION:
            const address = instruction.operands[0];
            generatorContext.treatAsFunction(address, lineCount - 1);
            generatorContext.createReturnContext();
            continue;
          
          case OP.END_FUNCTION:
            generatorContext.updateReturns(program.main, lineCount - 1);
            generatorContext.releaseReturnContext();
            continue;
          
          case OP.BLOCK_START:
            generatorContext.createFunctionContext();
            continue;
          
          case OP.BLOCK_END:
            generatorContext.releaseFunctionContext();
            continue;
          
          case OP.BREAKABLE:
            generatorContext.createBreakContext();
            continue;
          
          case OP.LINE_CONTINUE:
            generatorContext.markContinueLine(lineCount - 1);
            continue;
          
          case OP.GOTO_CONTINUE:
            const continueLine = generatorContext.getContinueLine();
            instruction = new Instruction(OP.jmp, formatLine(continueLine));
            break;
          
          case OP.LINE_BREAK:
            generatorContext.updateBreakGotos(program.main, lineCount - 1);
            generatorContext.releaseBreakContext();
            generatorContext.releaseContinueLine();
            continue;

          case OP.GOTO_BREAK:
            generatorContext.markBreakGoto(lineCount);
            program.main.push([]);  // Don't use enterInstruction to avoid Instruction.create()
            lineCount++;
            continue;
          
          case OP.RETURN:
            generatorContext.markReturn(lineCount);
            program.main.push([]);  // Don't use enterInstruction to avoid Instruction.create()
            lineCount++;
            continue;
        }
      }
      else
      {
        for( let j = 0; j < instruction.operands.length; j++ )
        {
          const lineReference = generatorContext.getFunctionLine(instruction.operands[j]);

          if( lineReference !== undefined )
          instruction.operands[j] = formatLine(lineReference);
        }
      }

      program.enterInstruction(instruction);
      lineCount++;
    }

    snippet = snippet.next;
  }

  return program;
};