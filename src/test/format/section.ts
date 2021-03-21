import { expect } from "chai";
import { parse } from "../../format/Parser";
import { TokenKind } from "../../format/Types";

it("section test", () => {
  const text = `
# Title
# 1
  # 1-1
# 2
# 3
  # 3-1
  # 3-2
    # 3-2-1
  # 3-3
# 4
`;
  expect(parse(text)).to.deep.equal({
    ok: true,
    head: {
      kind: TokenKind.markdown5,
      value: {
        title: { kind: TokenKind.sectionHeader, value: "Title" },
        contents: [
          {
            kind: TokenKind.section,
            value: {
              header: { kind: TokenKind.sectionHeader, value: "1" },
              contents: [
                {
                  kind: TokenKind.section,
                  value: {
                    header: { kind: TokenKind.sectionHeader, value: "1-1" },
                    contents: [],
                  },
                },
              ],
            },
          },
          {
            kind: TokenKind.section,
            value: {
              header: { kind: TokenKind.sectionHeader, value: "2" },
              contents: [],
            },
          },
          {
            kind: TokenKind.section,
            value: {
              header: { kind: TokenKind.sectionHeader, value: "3" },
              contents: [
                {
                  kind: TokenKind.section,
                  value: {
                    header: { kind: TokenKind.sectionHeader, value: "3-1" },
                    contents: [],
                  },
                },
                {
                  kind: TokenKind.section,
                  value: {
                    header: { kind: TokenKind.sectionHeader, value: "3-2" },
                    contents: [
                      {
                        kind: TokenKind.section,
                        value: {
                          header: {
                            kind: TokenKind.sectionHeader,
                            value: "3-2-1",
                          },
                          contents: [],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: TokenKind.section,
                  value: {
                    header: { kind: TokenKind.sectionHeader, value: "3-3" },
                    contents: [],
                  },
                },
              ],
            },
          },
          {
            kind: TokenKind.section,
            value: {
              header: { kind: TokenKind.sectionHeader, value: "4" },
              contents: [{ kind: TokenKind.paragraph, value: "" }],
            },
          },
        ],
      },
    },
    tails: [],
  });
});
