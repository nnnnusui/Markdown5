export { parse } from "./format/Parser";
export { transpile } from "./format/Transpiler";

// const text = `
// # Markdown5
// # paragraph
//   # empty line separating
//   sample paragraph

//   double line
//   paragraph

//   # paragraph-indent separating
//    first paragra-
//   ph. sample text.
//    second paragraph
//    third paragarph sample
//   text.
// `;
// const parsed = parse(text);
// console.dir(parsed, { depth: null });
// const transpiled = transpile(parsed.head);
// console.dir(transpiled, { depth: null });
