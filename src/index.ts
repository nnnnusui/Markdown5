import { parse } from "./format/Parser";
import { transpile } from "./format/Transpiler";

const text = `
# Markdown5
# paragraph
  # empty line separating
  sample paragraph

  double line
  paragraph

  # paragraph-indent separating
   first paragra-
  ph. sample text.
   second paragraph
   third paragarph sample
  text.
`;
const result = transpile(parse(text).head);
console.dir(result, { depth: null });
