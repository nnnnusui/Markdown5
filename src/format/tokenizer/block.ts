import lazy from "../../parser/combinator/lazy";
import or from "../../parser/combinator/or";
import { indented } from "../combinator/util";
import code from "./code";
import list from "./list";
import section from "./section";

const block = or(indented(lazy(() => section)), list, code);
export default block;
