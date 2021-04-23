import chainL from "../../parser/combinator/chainL";
import chainR from "../../parser/combinator/chainR";
import any from "../../parser/combinator/minimum/any";
import not from "../../parser/combinator/not";
import or from "../../parser/combinator/or";
import repeat from "../../parser/combinator/repeat";
import Char from "../Char";
import tokenize from "../combinator/tokenize";
import { eol } from "../combinator/util";
import link from "./link";

const text = tokenize(
  repeat(chainR(not(or(link, eol)), any<Char>())),
  (it) => ({
    kind: "text",
    value: it.join(""),
  })
);

const span = or(link, text);

export default span;
