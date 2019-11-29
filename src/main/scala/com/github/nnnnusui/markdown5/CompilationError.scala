package com.github.nnnnusui.markdown5

sealed trait CompilationError
object CompilationError{
  case class Markdown5LexerError(msg: String) extends CompilationError
  case class Markdown5ParserError(msg: String) extends CompilationError
}
