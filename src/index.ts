import { parse } from "./format/Parser";

const result = parse(`
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
`);
console.dir(result, { depth: null });
