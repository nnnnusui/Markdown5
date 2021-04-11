import { expect } from "chai";
import markdown5 from "../../../format/combinator/markdown5";
import init from "../../../parser/combinator/util/init";
import { ok } from "../../../parser/Types";

describe("markdown5 test", () => {
  it("title and section", () =>
    expect(init(markdown5)("# Title\n# 1".chars())).to.deep.equal(
      ok({
        head: {
          offset: 0,
          kind: "markdown5",
          value: {
            title: {
              offset: 0,
              kind: "title",
              value: "Title",
            },
            contents: [
              {
                offset: 8,
                kind: "section",
                value: {
                  header: {
                    offset: 8,
                    kind: "sectionHeader",
                    value: "1",
                  },
                  contents: [],
                },
              },
            ],
          },
        },
        tail: {
          offset: 11,
          values: [],
        },
      })
    ));
});
