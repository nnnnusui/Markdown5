package com.github.nnnnusui.markdown5

sealed trait Token
object Token {
  case class Title(value: String) extends Token
  case class Line(value: String) extends Token
  case class Text(value: String) extends Token
  case class Indentation(depth: Int) extends Token
  case object Indent extends Token
  case object Dedent extends Token
  case object LineBreak extends Token

  case class IndentAndTitle(indent: Indentation, title: Title) extends Token
  case class IndentAndLine(indent: Indentation, line: Line) extends Token
}
