import { ATYPES } from "../interpreter/ATYPES.js";
import { createValue } from "../interpreter/interpreterUtils.js";
import { KEYWORDS } from "../tokenizer/tokenizer.js";
import { TYPE_SIGNIFIERS } from "./TYPE_SIGNIFIERS.js";


export default class Instruction {
  constructor(opCode = null, ...operands) {
    this.opCode = opCode;
    this.operands = operands;
  }

  pushOperand(operand) {
    this.operands.push(operand);
  }

  setOpCode(newOpCode) {
    this.opCode = newOpCode;
  }

  setOperand(operandIndex, newOperand) {
    this.operands[operandIndex] = newOperand;
  }

  getOperand(operandIndex) {
    return this.operands[operandIndex];
  }

  create() {
    const preparedInstruction = [this.opCode];
    let preparedOperand;
  
    for( const operand of this.operands )
    {
      if( !Array.isArray(operand) && typeof operand !== "object" )
      {
        const charFirst = operand.charAt(0);

        switch( charFirst )
        {
          case TYPE_SIGNIFIERS.address: preparedOperand = [ATYPES.address, parseInt(operand.substring(1))]; break;
          case TYPE_SIGNIFIERS.line   : preparedOperand = [ATYPES.line, parseInt(operand.substring(1))]; break;
          case TYPE_SIGNIFIERS.number : preparedOperand = [ATYPES.value, operand.substring(1) * 1]; break; // Casts to int or float depending on type
          case TYPE_SIGNIFIERS.string : preparedOperand = [ATYPES.value, operand.substring(1)]; break;
          case TYPE_SIGNIFIERS.boolean: preparedOperand = [ATYPES.value, (operand.substring(1) === "true")]; break;
          case TYPE_SIGNIFIERS.null   : preparedOperand = [ATYPES.value, null]; break;
          case TYPE_SIGNIFIERS.NaN    : preparedOperand = [ATYPES.value, NaN]; break;

          default: {
            if( charFirst === KEYWORDS.NaN )
            preparedOperand = createValue(NaN);
            else if( charFirst === KEYWORDS.null )
            preparedOperand = createValue(null);
            else
            preparedOperand = createValue(operand);
          } break;
        }
      }
      else
      preparedOperand = createValue(operand);

      preparedInstruction.push(preparedOperand);
    }

    return preparedInstruction;
  }
}
