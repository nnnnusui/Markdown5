import { expect } from "chai";
import section from "../../../format/tokenizer/section";
import init from "../../../parser/combinator/util/init";
import Result from "../../../type/Result";

describe("section test", () => {
  const s = section;

  it("header only", () =>
    expect(init(s)("# Header".chars())).to.deep.equal(
      Result.ok({
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
      Result.ok({
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
              {
                kind: "paragraph",
                offset: 8,
                value: [
                  {
                    offset: 8,
                    kind: "text",
                    value: "p1",
                  },
                ],
              },
              {
                kind: "paragraph",
                offset: 11,
                value: [
                  {
                    offset: 12,
                    kind: "text",
                    value: "p2",
                  },
                ],
              },
            ],
          },
        },
        tail: {
          offset: 14,
          values: [],
        },
      })
    ));

  it("contains inner section", () =>
    expect(
      init(s)("# section1\n  # section2\n # section3".chars())
    ).to.deep.equal(
      Result.ok({
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
              {
                kind: "section",
                offset: 25,
                value: {
                  header: {
                    kind: "sectionHeader",
                    offset: 25,
                    value: "section3",
                  },
                  contents: [],
                },
              },
            ],
          },
        },
        tail: {
          offset: 35,
          values: [],
        },
      })
    ));

  it("Ends with a section header of the same indent level", () =>
    expect(init(s)("# one\n# two".chars())).to.deep.equal(
      Result.ok({
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
