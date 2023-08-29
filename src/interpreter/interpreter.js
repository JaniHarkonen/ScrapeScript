import Memory from "./Memory.js";

import { ERRORS, throwFatalError } from "../ERRORS.js";
import { OP } from "../compiler/OP.js";
import { ATYPES } from "./ATYPES.js";
import { BUILT_IN_INSTRUCTIONS } from "./BUILT_IN_INSTRUCTIONS.js";
import { BINARY_OPERATIONS, UNARY_OPERATIONS, VALUE, createFieldReference, createValue, destructureValue } from "./interpreterUtils.js";


export default function execute(executable, ...programArguments) {
  if( !executable )
  throwFatalError(ERRORS.runtime, ERRORS.runtime.nullExecutable);

  const memory = new Memory();
  const getArgumentFromStack = () => memory.getValue(memory.callStackPop());
  const getAddressFromStack = () => memory.getAddress(memory.callStackPop());

  const executeBuiltIn = (builtInInstruction) => {
    memory.callStackPush(createValue(builtInInstruction(getArgumentFromStack)));
  };

  const OP_CODE = 0;
  let programCounter = 0;
  while( programCounter < executable.main.length )
  {
    const instruction = executable.main[programCounter];
    const opCode = instruction[OP_CODE];

    switch( opCode )
    {
        // Set address pointer to a memory address
      case OP.setp: {
        const addrTarget = instruction[1];
        const addrSource = instruction[2];
        memory.setAddress(addrTarget, addrSource);
      } break;
      
        // Set a value to a memory address
      case OP.set: {
        const addrTarget = memory.getAddress(instruction[1]);
        const value = memory.getStoredValue(instruction[2]);
        const addrResult = instruction[3];
        memory.setAddress(addrTarget, value);
        memory.setAddress(addrResult, value);
      } break;

        // Sets a value to a memory address overriding the previous value
      case OP.seti: {
        const addrTarget = instruction[1];
        const value = memory.getStoredValue(instruction[2]);
        memory.setAddress(addrTarget, value);
      } break;

        // Compare and perform relative jump if false (relative to program counter)
      case OP.cmpr: {
        const opr1 = instruction[1];
        const result = (memory.getValue(opr1) === true);
        const jumpLines = instruction[2][VALUE];

        if( !result )
        programCounter += jumpLines;
      } break;

        // Perform relative jump (relative to program counter)
      case OP.jmpr: {
        const opr1 = memory.getValue(instruction[1]);
        programCounter += opr1;
      } break;

        // Perform an absolute jump
      case OP.jmp: {
        const opr1 = memory.getValue(instruction[1]);
        programCounter = opr1;
      } break;

        // Push a value into call stack
      case OP.cpsh: {
        const opr1 = memory.getStoredValue(instruction[1]);
        memory.callStackPush(opr1);
      } break;

        // Pop a value from call stack and store
      case OP.cpop: {
        const addrResult = instruction[1];
        const poppedStorage = memory.callStackPop();

        if( !poppedStorage )
        break;

        const poppedValue = memory.getStoredValue(poppedStorage);
        memory.setAddress(addrResult, poppedValue);
      } break;

        // Push current program counter value into call stack incremented by one
      case OP.cppc: {
        memory.callStackPush([ATYPES.line, programCounter + 1]);
      } break;

        // Create a new memory context and push it into memory stack
      case OP.mpsh: {
        memory.createMemoryContext();
      } break;

        // Pop a memory context from memory stack and set it as the current context
      case OP.mpop: {
        memory.releaseMemoryContext();
      } break;

        // Exits the program returning a given value
      case OP.yld: return destructureValue(memory.getValue(instruction[1]));

        // Create an array
      case OP.arra: {
        const addrArray = instruction[1];
        memory.setAddress(addrArray, createValue([]));
      } break;
    
        // Create a JSON
      case OP.json: {
        const addrJson = instruction[1];
        memory.setAddress(addrJson, createValue({}));
      } break;
    
        // Sets a reference to an array index to a memory address
      case OP.aiof: {
        const addrResult = instruction[1];
        const addrArray = memory.getAddress(instruction[2]);
        const arrayIndex = memory.getValue(instruction[3]);
        memory.setAddress(addrResult, createFieldReference(addrArray[VALUE], arrayIndex));
      } break;

        // Removes an element from a given position in an array
      case OP.rmv: {
        const index = getArgumentFromStack();
        const addrArray = getAddressFromStack();
        const array = memory.getValue(addrArray);

        memory.setAddress(addrArray, array.splice(index, 1));
      } break;

        // Adds an element to a given position in an array
      case OP.isrt: {
        const value = getArgumentFromStack();
        const index = getArgumentFromStack();
        const addrArray = getAddressFromStack();
        const array = memory.getValue(addrArray);

        memory.setAddress(addrArray, array.splice(index, 0, createValue(value)));
      } break;

        // Returns a given program argument
      case OP.arg: {
        const argumentIndex = getArgumentFromStack();
        memory.callStackPush(createValue(programArguments[argumentIndex]));
      } break;

        // Perform a unary operation and store result
      case OP.not:
      case OP.incr:
      case OP.decr: {
        const opr1 = memory.getValue(instruction[1]); // Some unary operations only utilize the first operand while the other is null
        const opr2 = memory.getValue(instruction[2]); // Some unary operations only utilize the second operand while the other is null
        const addrResult = memory.getAddress(instruction[3]);
        const result = UNARY_OPERATIONS[opCode](opr1, opr2);
        memory.setAddress(addrResult, createValue(result));
      } break;

        // Perform an arithmetic assignment and store result
      case OP.adds:
      case OP.subs:
      case OP.muls:
      case OP.divs:
      case OP.ands:
      case OP.ors:
      case OP.xors:
      case OP.mods: {
        const opr1 = memory.getValue(instruction[1]);
        const opr2 = memory.getValue(instruction[2]);
        const addrTarget = memory.getAddress(instruction[1]);
        const addrResult = instruction[3];
        const result = BINARY_OPERATIONS[opCode](opr1, opr2);
        memory.setAddress(addrTarget, createValue(result));
        memory.setAddress(addrResult, createValue(result));
      } break;

        // Perform a binary operation and store result
      case OP.add:
      case OP.subt:
      case OP.mul:
      case OP.div:
      case OP.equ:
      case OP.nequ:
      case OP.gre:
      case OP.less:
      case OP.gree:
      case OP.lsse:
      case OP.and:
      case OP.land:
      case OP.or:
      case OP.lor:
      case OP.xor: 
      case OP.mod:
      case OP.left:
      case OP.righ: {
        const opr1 = memory.getValue(instruction[1]);
        const opr2 = memory.getValue(instruction[2]);
        const addrResult = instruction[3];
        const result = BINARY_OPERATIONS[opCode](opr1, opr2);
        memory.setAddress(addrResult, createValue(result));
      } break;
    
        // No-op
      case OP.noop: break;

        // Perform a binary operation and store result
      default: {
        executeBuiltIn(BUILT_IN_INSTRUCTIONS[opCode]);
      } break;
    }

    programCounter++;
  }
}
