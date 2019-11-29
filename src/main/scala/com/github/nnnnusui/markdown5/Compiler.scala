package com.github.nnnnusui.markdown5

object Compiler {
  def apply(text: String): Either[CompilationError, Markdown5] ={
    for {
      tokens <- Lexer(text).right
      ast <- Parser(tokens).right
    } yield ast
  }
}
