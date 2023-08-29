import IfStatement from "./IfStatement.js";
import ForLoop from "./loops/ForLoop.js";
import WhileLoop from "./loops/WhileLoop.js";
import DoWhileLoop from "./loops/DoWhileLoop.js";
import RepeatLoop from "./loops/RepeatLoop.js";
import SwitchStatement from "./switch/SwitchStatement.js";
import VariableDeclaration from "./declarations/VariableDeclaration.js";
import FunctionDeclaration from "./declarations/FunctionDeclaration.js";
import Return from "./Return.js";
import Expression from "./Expression.js";
import Yield from "./Yield.js";
import Import from "./Import.js";

import { attemptParse } from "../parserUtils.js";
import Break from "./singulars/Break.js";
import Continue from "./singulars/Continue.js";


export default function Line(target, startPosition) {
  return attemptParse(target, startPosition, [
    Import,
    IfStatement,
    ForLoop,
    WhileLoop,
    DoWhileLoop,
    RepeatLoop,
    SwitchStatement,
    VariableDeclaration,
    FunctionDeclaration,
    Return,
    Expression,
    Yield,
    Break,
    Continue
  ]);
}
