import { expect } from "chai";
import { parse } from "../../format/Parser";

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
      kind: "markdown5",
      value: {
        title: { kind: "title", value: "Title", offset: 1 },
        contents: [
          {
            kind: "section",
            value: {
              header: { kind: "sectionHeader", value: "1", offset: 9 },
              contents: [
                {
                  kind: "section",
                  value: {
                    header: { kind: "sectionHeader", value: "1-1", offset: 15 },
                    contents: [],
                  },
                  offset: 15,
                },
              ],
            },
            offset: 9,
          },
          {
            kind: "section",
            value: {
              header: { kind: "sectionHeader", value: "2", offset: 21 },
              contents: [],
            },
            offset: 21,
          },
          {
            kind: "section",
            value: {
              header: { kind: "sectionHeader", value: "3", offset: 25 },
              contents: [
                {
                  kind: "section",
                  value: {
                    header: { kind: "sectionHeader", value: "3-1", offset: 31 },
                    contents: [],
                  },
                  offset: 31,
                },
                {
                  kind: "section",
                  value: {
                    header: { kind: "sectionHeader", value: "3-2", offset: 39 },
                    contents: [
                      {
                        kind: "section",
                        value: {
                          header: {
                            kind: "sectionHeader",
                            value: "3-2-1",
                            offset: 49,
                          },
                          contents: [],
                        },
                        offset: 49,
                      },
                    ],
                  },
                  offset: 39,
                },
                {
                  kind: "section",
                  value: {
                    header: { kind: "sectionHeader", value: "3-3", offset: 59 },
                    contents: [],
                  },
                  offset: 59,
                },
              ],
            },
            offset: 25,
          },
          {
            kind: "section",
            value: {
              header: { kind: "sectionHeader", value: "4", offset: 65 },
              contents: [{ kind: "paragraph", value: "", offset: 69 }],
            },
            offset: 65,
          },
        ],
      },
      offset: 0,
    },
    tails: { values: [], offset: 71 },
  });
});
