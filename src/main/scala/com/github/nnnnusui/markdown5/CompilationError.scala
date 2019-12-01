package com.github.nnnnusui.markdown5

sealed trait CompilationError
object CompilationError{
  case class LexerError(msg: String) extends CompilationError
  case class ParserError(msg: String) extends CompilationError
}
