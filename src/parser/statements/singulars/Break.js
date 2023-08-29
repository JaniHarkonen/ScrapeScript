import Singular from "./Singular.js";

import { KEYWORDS } from "../../../tokenizer/tokenizer.js";


export default function Break(target, startPosition) {
  return Singular(target, startPosition, KEYWORDS.break);
}
