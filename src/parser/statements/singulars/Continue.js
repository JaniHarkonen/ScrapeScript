import Singular from "./Singular.js";

import { KEYWORDS } from "../../../tokenizer/tokenizer.js";


export default function Continue(target, startPosition) {
  return Singular(target, startPosition, KEYWORDS.continue);
}
