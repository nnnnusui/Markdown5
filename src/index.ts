import { parse } from "./format/Parser";

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
const result = parse(text);
console.dir(result, { depth: null });
