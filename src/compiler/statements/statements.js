import compileAccess from "./compileAccess.js";
import compileArray from "./compileArray.js";
import compileBreak from "./compileBreak.js";
import compileContinue from "./compileContinue.js";
import compileDoWhileLoop from "./compileDoWhileLoop.js";
import compileForLoop from "./compileForLoop.js";
import compileRepeatLoop from "./compileRepeatLoop.js";
import compileFunctionCall from "./compileFunctionCall.js";
import compileFunctionDeclaration from "./compileFunctionDeclaration.js";
import compileIfStatement from "./compileIfStatement.js";
import compileJson from "./compileJson.js";
import compileReturn from "./compileReturn.js";
import compileYield from "./compileYield.js";
import compileSwitchStatement from "./compileSwitchStatement.js";
import compileVariableDeclaration from "./compileVariableDeclaration.js";
import compileExpression from "./compileExpression.js";
import compileWhileLoop from "./compileWhileLoop.js";


export const COMPILABLE_STATEMENTS = {
  access: compileAccess,                // Array access
  array: compileArray,                  // Array creation
  break: compileBreak,                  // Breaking out of structure
  continue: compileContinue,            // Continuation of structure
  doWhile: compileDoWhileLoop,          // Do-while-loop
  defaultCompiler: compileExpression,   // Expression (default compiler)
  expression: compileExpression,        // Expression (double take for consistency)
  for: compileForLoop,                  // For-loop
  call: compileFunctionCall,            // Function call
  function: compileFunctionDeclaration, // Function declaration
  if: compileIfStatement,               // If-statement
  json: compileJson,                    // Json creation
  repeat: compileRepeatLoop,            // Repeat-loop
  return: compileReturn,                // Function return
  switch: compileSwitchStatement,       // Switch-statement
  let: compileVariableDeclaration,      // Standard variable declaration
  const: compileVariableDeclaration,    // Constant variable declaration (same as standard variable)
  while: compileWhileLoop,              // While-loop
  yield: compileYield                   // Program yield (return/exits program)
};

export const getStatementCompiler = (compilerType) => {
  return COMPILABLE_STATEMENTS[compilerType];
};
