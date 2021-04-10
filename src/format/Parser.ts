import chain from "../parser/combinator/chain";
import chainR from "../parser/combinator/chainR";
import convert from "../parser/combinator/convert";
import not from "../parser/combinator/not";
import or from "../parser/combinator/or";
import repeat from "../parser/combinator/repeat";
import { Combinator, err } from "../parser/Types";
import option from "../parser/combinator/option";
import tokenize from "./combinator/tokenize";
import { Token, Content } from "./Types";
import init from "../parser/combinator/util/init";
import sames from "./combinator/sames";
import {
  emptyLines,
  indent,
  line,
  sectionHeaderPrefix,
} from "./combinator/util";
import paragraph from "./combinator/paragraph";

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
export const parse = (src: string): ReturnType<Parser<Token<"markdown5">>> =>
  init(conversion)(src.chars());
