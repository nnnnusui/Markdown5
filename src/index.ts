/* eslint-disable @typescript-eslint/naming-convention */
import cac from "cac";
import { glob } from "glob";
import { readFileSync, stat } from "fs";
import { parse } from "./format/Parser";
import { transpile } from "./format/Transpiler";

const Markdown5 = {
  parse: (source: string) => {
    const { ok, head, tails } = parse(source);
    const result = ok ? [head] : [];
    return result;
  },
  transpile: transpile,
};
export default Markdown5;
export * from "./format/Types";

const cli = cac();
cli.command("compile <path>", "transpile to html").action((path: string) => {
  stat(path, (err, stats) => {
    if (stats.isDirectory()) {
      const template = readFileSync(path + "m5template.html", {
        encoding: "utf8",
      });
      const pathPattern = path + "**/*.m5";
      glob(pathPattern, (err, paths) => {
        const transpiledResults = paths.flatMap((path) => {
          const text = readFileSync(path, { encoding: "utf8" });
          return Markdown5.parse(text).map(
            (it) => [it.value.title.value, Markdown5.transpile(it)] as const
          );
        });
        const templateApplyed = transpiledResults.map(([title, html]) =>
          template.replace("{title}", title).replace("{body}", html)
        );
        console.log(templateApplyed);
      });
    }
  });
});
cli.help();
cli.parse();
