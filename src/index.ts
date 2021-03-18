import { parse } from "./format/Parser";

const result = parse(`# Header1
content1
  # Header2
  content2
con1-2
`);
console.dir(result, { depth: null });
