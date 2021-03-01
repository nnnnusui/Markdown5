declare global {
  interface String {
    test(): string;
  }
}
Object.defineProperty(String.prototype, "test", {
  value: function (this: string) {
    return `test: ${this}`;
  },
});
const Lexer = () => {
  const header = "# ".test();
  return {
    header,
  };
};
export default Lexer;
