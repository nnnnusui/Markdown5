import chainR from "../../parser/combinator/chainR";
import repeat from "../../parser/combinator/repeat";
import section from "./section";
import tokenize from "../combinator/tokenize";
import { emptyLines } from "../combinator/util";

const syntax = repeat(chainR(emptyLines, section("")));

const markdown5 = tokenize(syntax, ([head, ...tails]) => {
  const { header, contents } = head.value;
  const title = { ...header, kind: "title" as const };
  return {
    kind: "markdown5",
    value: { title, contents: [...contents, ...tails] },
  };
});
export default markdown5;
