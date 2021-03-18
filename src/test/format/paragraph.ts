import { expect } from "chai";
import { parse } from "../../format/Parser";
import { TokenKind } from "../../format/Types";

it("paragraph test", () => {
  expect(
    parse(`
# Section1
p1
p1content

p2
  p2content

p3
 p4
p4content
    `)
  ).to.deep.equal({
    ok: true,
    head: [
      [
        TokenKind.section,
        {
          header: [TokenKind.sectionHeader, "Section1"],
          contents: [
            [TokenKind.paragraph, "p1p1content"],
            [TokenKind.paragraph, "p2  p2content"],
            [TokenKind.paragraph, "p3"],
            [TokenKind.paragraph, "p4p4content    "],
          ],
        },
      ],
    ],
    tails: [],
  });
});
