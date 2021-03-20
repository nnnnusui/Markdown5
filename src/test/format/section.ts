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
    head: [
      TokenKind.section,
      {
        header: [TokenKind.sectionHeader, "Title"],
        contents: [
          [
            TokenKind.section,
            {
              header: [TokenKind.sectionHeader, "1"],
              contents: [
                [
                  TokenKind.section,
                  { header: [TokenKind.sectionHeader, "1-1"], contents: [] },
                ],
              ],
            },
          ],
          [
            TokenKind.section,
            { header: [TokenKind.sectionHeader, "2"], contents: [] },
          ],
          [
            TokenKind.section,
            {
              header: [TokenKind.sectionHeader, "3"],
              contents: [
                [
                  TokenKind.section,
                  { header: [TokenKind.sectionHeader, "3-1"], contents: [] },
                ],
                [
                  TokenKind.section,
                  {
                    header: [TokenKind.sectionHeader, "3-2"],
                    contents: [
                      [
                        TokenKind.section,
                        {
                          header: [TokenKind.sectionHeader, "3-2-1"],
                          contents: [],
                        },
                      ],
                    ],
                  },
                ],
                [
                  TokenKind.section,
                  { header: [TokenKind.sectionHeader, "3-3"], contents: [] },
                ],
              ],
            },
          ],
          [
            TokenKind.section,
            { header: [TokenKind.sectionHeader, "4"], contents: [[1, ""]] },
          ],
        ],
      },
    ],
    tails: [],
  });
});
