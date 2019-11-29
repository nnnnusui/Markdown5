package com.github.nnnnusui.markdown5

/* reference:
 *   https://enear.github.io/2016/03/31/parser-combinators/
 */
object Compiler {
  def apply(text: String): Either[CompilationError, Markdown5] ={
    for {
      tokens <- Lexer(text).right
      ast <- Parser(tokens).right
    } yield ast
  }
}
