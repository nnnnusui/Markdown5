import { convert, repeat, not, chain, or, same } from "../parser/Combinators";
import { Parser } from "../parser/Types";

const eol /* end of line */ = "\n";
const space = same(" ");
const tab = same("\t");

const indentChar = or([space, tab]);
const empties = convert(repeat(indentChar), (it) => it.join(""));
const emptyLine = chain([empties, same(eol)]);

const to = (keyword: string): Parser<string> => {
  const content = convert(repeat(not(keyword)), (it) => it.join(""));
  const hasKeyword = convert(
    chain([content, same(keyword)]),
    ([content]) => content
  );
  return or([hasKeyword, content]);
};

export const parse = to(eol);
