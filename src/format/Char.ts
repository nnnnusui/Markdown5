type Char = string & { length: 1 };
export default Char;

declare global {
  interface String {
    char(): Char;
    chars(): Char[];
  }
}
String.prototype.char = function () {
  return this.charAt(0) as Char;
};
String.prototype.chars = function () {
  return this.split("") as Char[];
};
