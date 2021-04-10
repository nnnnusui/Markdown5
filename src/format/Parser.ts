import chain from "../parser/combinator/chain";
import chainR from "../parser/combinator/chainR";
import convert from "../parser/combinator/convert";
import not from "../parser/combinator/not";
import or from "../parser/combinator/or";
import repeat from "../parser/combinator/repeat";
import same from "../parser/combinator/minimum/same";
import { Combinator, err } from "../parser/Types";
import option from "../parser/combinator/option";
import chainL from "../parser/combinator/chainL";
import tokenize from "./combinator/tokenize";
import { Token, Content } from "./Types";
import init from "../parser/combinator/util/init";
import to from "./combinator/to";

export type Char = string & { length: 1 };
type Parser<T> = Combinator<T, Char>;
export default Parser;

declare global {
  interface String {
    char(): Char;
    chars(): Char[];
  }
}
String.prototype[`char`] = function () {
  return this.charAt(0) as Char;
};
String.prototype[`chars`] = function () {
  return this.split("") as Char[];
};

const sames = (it: string) => {
  const sames = it
    .chars()
    .reduce<Parser<Char>[]>((sum, it) => [...sum, same(it)], []);
  return convert(chain(...sames), (it) => it.join(""));
};

const eol = sames("\n");
const indentChar = or(sames(" "), sames("\t"));
const emptyLine = chainL(repeat(indentChar), eol);
const emptyLines = repeat(emptyLine);
const line = convert(to(eol), (it) => it.join(""));
const sectionHeaderPrefix = sames("# ");

const indent = convert(repeat(indentChar), (it) => it.join(""));
const paragraph = (blockIndent: string) => {
  const paragraphIndent = chainR(or(indentChar, sames("　")), not(indentChar));
  const startOtherBlock = chain(indent, sectionHeaderPrefix);
  const nots = not(or(paragraphIndent, startOtherBlock, emptyLine));
  const oneLine = chainR(nots, line);
  const head = chainR(option(paragraphIndent), oneLine);
  const tails = repeat(chainR(sames(blockIndent), oneLine));
  const syntax = chain(head, tails);
  return tokenize(syntax, ([head, tails]) => ({
    kind: "paragraph",
    value: [head, ...tails].join(""),
  }));
};
const section = (() => {
  const section = (allowIndent: boolean): Parser<Token<"section">> => (src) => {
    const indentResult = indent(src);
    if (!indentResult.ok) return indentResult;
    const { head: blockIndent, tail } = indentResult.get;
    if (allowIndent && blockIndent === "") return err(src);
    const header = (() => {
      const syntax = chain(sectionHeaderPrefix, line);
      return tokenize(syntax, ([, line]) => ({
        kind: "sectionHeader",
        value: line,
      }));
    })();
    const syntax = chain(
      header,
      option(
        chainR(
          not(chain(sames(blockIndent), sectionHeaderPrefix)),
          contents(blockIndent)
        )
      )
    );
    return tokenize(syntax, ([header, contents]) => ({
      kind: "section",
      value: { header, contents: contents ? contents : [] },
    }))(tail);
  };
  return {
    top: section(false),
    nested: section(true),
  } as const;
})();

const content = (indent: string): Parser<Content> => {
  const syntax = chain(sames(indent), or(section.nested, paragraph(indent)));
  return convert(syntax, ([, content]) => content);
};
const contents = (indent: string) =>
  repeat(chainR(emptyLines, content(indent)));

const syntax = repeat(chainR(emptyLines, section.top));
const conversion = tokenize(syntax, ([head, ...tails]) => {
  const { header, contents } = head.value;
  const title = { ...header, kind: "title" as const };
  return {
    kind: "markdown5",
    value: { title, contents: [...contents, ...tails] },
  };
});
export const parse = (
  src: string //: ReturnType<Parser<Token<"markdown5">>> =>
) =>
  init(repeat(chainR(chainL(repeat(indentChar), eol), section.top)))(
    src.chars()
  );
