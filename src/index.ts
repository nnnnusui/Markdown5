import { parse } from "./format/Parser";

const result = parse(`
# Header1
  indent
content1

  # Header2
  paragraph2-1

  paragraph2-2
   paragraph2-3
  , 2-3...

content1-2
`);
console.dir(result, { depth: null });
