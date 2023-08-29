import MakeArray from "./make/MakeArray.js";
import MakeJson from "./make/MakeJson.js";
import Sequence from "./meta/Sequence.js";

import { tokenAt, isValue, attemptParse, isExpressionStart, isOperator, isReference, isFieldAccess, isArrayStart, isFunctionCall, isExpressionEnd, isBuiltIn, isFieldIdentifier } from "../parserUtils.js";
import { Operation, getOperatorPrecedence, ASSOCIATIVITY, Success, OPERATIONS, getOperationPrecedence, Fail } from "../parser.js";
import { didFail } from "../../errorStates.js";
import { ERRORS, throwFatalError } from "../../ERRORS.js";


const endArgumentSequence = (target, cursor) => isExpressionEnd(tokenAt(target, cursor));

export default function Expression(target, startPosition) {
  const OP1 = 0;
  const OP2 = 1;
  const pivotOperations = [];
  
  let cursor = startPosition;
  let opCurrent = Operation();
  let expectFieldName = false;
  let opAccess = null;
  let lastOperatorPrecedence = -1;
  let argumentIndex = OP1;
  let isFirstOperator = true;
  let accessArgumentIndex = 0;
  while( cursor < target.length )
  {
    const tCurrent = tokenAt(target, cursor);
    const isAccessing = !!opAccess;

    if( expectFieldName ) // JSON field name expected
    {
        // Must be an identifier (string-based access possible via arrays)
      if( !isFieldIdentifier(tCurrent) )
      throwFatalError(ERRORS.parser, ERRORS.parser.expression.fieldNameExpected, { type: tCurrent.type, value: tCurrent.value });
      
      opAccess.arguments.push(tCurrent);
      expectFieldName = false;
    }
    else if( isOperator(tCurrent) )  // Encountered an operator, the previous operation is parsed here
    {
      const peCurrentOperator = getOperatorPrecedence(tCurrent);

        // Parsing order can be changed via associativity when the precedence is the same
      const lastPrecedenceIsEqual = peCurrentOperator.precedence === lastOperatorPrecedence;
      const overrideWithAssociativity = (lastPrecedenceIsEqual && peCurrentOperator.associativity === ASSOCIATIVITY.right);
      let operationName = tCurrent.value;

        // First operator
      if( isFirstOperator )
      {
        opCurrent.operator = operationName;
        pivotOperations.push(opCurrent);
        isFirstOperator = false;
      } 
      else if( peCurrentOperator.precedence < lastOperatorPrecedence || overrideWithAssociativity )
      {
          // Higher precedence operations are placed into deeper nodes in the AST
          // (unless associativity overrides the order)
        const opNext = Operation(operationName);
        opNext.arguments[OP1] = opCurrent.arguments[OP2];
        opCurrent.arguments[OP2] = opNext;
        pivotOperations.push(opNext);
        opCurrent = opNext;
      }
      else
      {
          // Determine the last pivot operation whose precedence is at least equal
          // to the current operator's precedence
        let opLastPivot;
        let opLastValidPivot;
        let pivotPrecedence;
        do
        {
          pivotPrecedence = getOperationPrecedence(pivotOperations[pivotOperations.length - 1]);

            // Don't pop operations with higher precedence
          if( pivotPrecedence.precedence > peCurrentOperator.precedence )
          break;

          opLastPivot = pivotOperations.pop();
          
          if( opLastPivot )
          opLastValidPivot = opLastPivot;
        }
        while( opLastPivot && pivotPrecedence.precedence < peCurrentOperator.precedence )

          // Make this operation the next pivot operation
        const opValid = opLastPivot || opLastValidPivot;
        const opNext = Operation(operationName, opValid);

        if( pivotOperations.length > 0 )
        pivotOperations[pivotOperations.length - 1].arguments[1] = opNext;

        pivotOperations.push(opNext);
        opCurrent = opNext;
      }

      lastOperatorPrecedence = peCurrentOperator.precedence;
      opAccess = null;
    }
    else if( isAccessing )  // Handles reference accesses
    {
      if( isExpressionStart(tCurrent) ) // Expression start is handled as a function call
      {
        const opNewAccess = Operation(OPERATIONS.call);
        opNewAccess.arguments = [opAccess];
        opAccess = opNewAccess;

        const rArgumentSequence = Sequence(target, cursor + 1, Expression, endArgumentSequence);
        opAccess.arguments = opAccess.arguments.concat(rArgumentSequence.result);
        cursor = rArgumentSequence.position + 1;
        opCurrent.arguments[accessArgumentIndex] = opAccess;
      }
      else if( isArrayStart(tCurrent) ) // Array access via brackets
      {
        const rArrayAccess = Expression(target, cursor + 1);

        if( !isFunctionCall(opAccess) )
        opAccess.arguments.push(rArrayAccess.result);
        else
        {
          opAccess = Operation(OPERATIONS.access, opAccess, rArrayAccess.result);
          opCurrent.arguments[accessArgumentIndex] = opAccess;
        }

        cursor = rArrayAccess.position + 1;
      }
      else if( isFieldAccess(tCurrent) )  // Dot operator, start expecting a field name
      {
        if( isFunctionCall(opAccess) )
        {
          const opNewAccess = Operation(OPERATIONS.access);
          opNewAccess.arguments = [opAccess];
          opAccess = opNewAccess;
          opCurrent.arguments[accessArgumentIndex] = opAccess;
        }

        expectFieldName = true;
      }
      else
      {
        cursor--;
        break;
      }
    }
    else if( isExpressionStart(tCurrent) ) // Parse subexpression
    {
      let rSubExpression = Expression(target, cursor + 1);
      cursor = rSubExpression.position + 1;
      opCurrent.arguments[argumentIndex] = rSubExpression.result;
    }
    else if( isValue(tCurrent) )  // Encountered a value (string, number, boolean), set as operand candidate
    opCurrent.arguments[argumentIndex] = tCurrent;
    else if( isReference(tCurrent) ) // Encountered a reference (identifier or a built-in function name)
    {
        // Built-in functions shouldn't be accessed as they won't resolve to line numbers
      if( isBuiltIn(tCurrent) )
      opAccess = tCurrent;
      else
      {
        opAccess = Operation(OPERATIONS.access);
        opAccess.arguments = [tCurrent];
        opCurrent.arguments[argumentIndex] = opAccess;
      }

      accessArgumentIndex = argumentIndex;
    }
    else
    {
      const rStatements = attemptParse(target, cursor, [MakeJson, MakeArray]);

      if( didFail(rStatements) )
      {
        if( argumentIndex === OP1 )
        return Fail(startPosition);

        cursor--;
        break;
      }

      opCurrent.arguments[argumentIndex] = rStatements.result;
      cursor = rStatements.position;
    }

    argumentIndex = OP2;
    cursor++;
  }

  return Success(cursor, pivotOperations[0] || opCurrent.arguments[OP1]);
};
