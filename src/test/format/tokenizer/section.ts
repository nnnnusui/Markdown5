import { expect } from "chai";
import section from "../../../format/tokenizer/section";
import sames from "../../../format/combinator/sames";
import chainR from "../../../parser/combinator/chainR";
import init from "../../../parser/combinator/util/init";
import { ok } from "../../../parser/Types";

describe("section test", () => {
  const s = section("");

  it("header only", () =>
    expect(init(s)("# Header".chars())).to.deep.equal(
      ok({
        head: {
          kind: "section",
          offset: 0,
          value: {
            header: {
              kind: "sectionHeader",
              offset: 0,
              value: "Header",
            },
            contents: [],
          },
        },
        tail: {
          offset: 8,
          values: [],
        },
      })
    ));

  it("multi paragraph", () =>
    expect(init(s)("# Title\np1\n p2".chars())).to.deep.equal(
      ok({
        head: {
          kind: "section",
          offset: 0,
          value: {
            header: {
              kind: "sectionHeader",
              offset: 0,
              value: "Title",
            },
            contents: [
              { kind: "paragraph", offset: 8, value: "p1" },
              { kind: "paragraph", offset: 11, value: "p2" },
            ],
          },
        },
        tail: {
          offset: 14,
          values: [],
        },
      })
    ));

  it("indented inner section", () => {
    const indent = "  ";
    const syntax = chainR(sames(indent), section(indent));
    expect(init(syntax)(`${indent}# indented`.chars())).to.deep.equal(
      ok({
        head: {
          kind: "section",
          offset: 2,
          value: {
            header: {
              kind: "sectionHeader",
              offset: 2,
              value: "indented",
            },
            contents: [],
          },
        },
        tail: {
          offset: 12,
          values: [],
        },
      })
    );
  });

  it("contains inner section", () =>
    expect(init(s)("# section1\n  # section2".chars())).to.deep.equal(
      ok({
        head: {
          kind: "section",
          offset: 0,
          value: {
            header: {
              kind: "sectionHeader",
              offset: 0,
              value: "section1",
            },
            contents: [
              {
                kind: "section",
                offset: 13,
                value: {
                  header: {
                    kind: "sectionHeader",
                    offset: 13,
                    value: "section2",
                  },
                  contents: [],
                },
              },
            ],
          },
        },
        tail: {
          offset: 23,
          values: [],
        },
      })
    ));

  it("Ends with a section header of the same indent level", () =>
    expect(init(s)("# one\n# two".chars())).to.deep.equal(
      ok({
        head: {
          kind: "section",
          offset: 0,
          value: {
            header: {
              kind: "sectionHeader",
              offset: 0,
              value: "one",
            },
            contents: [],
          },
        },
        tail: {
          offset: 6,
          values: ["#", " ", "t", "w", "o"],
        },
      })
    ));
});
