import Singular from "../singulars/Singular.js";

import { KEYWORDS } from "../../../tokenizer/tokenizer.js";


export default function Default(target, startPosition) {
  return Singular(target, startPosition, KEYWORDS.default);
}
