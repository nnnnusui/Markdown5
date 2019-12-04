package com.github.nnnnusui.markdown5

sealed trait Token
object Token {
  case class Indentation(depth: Int) extends Token
  case class Title(value: String) extends Token
  case class Line(value: String) extends Token
  case object BlockQuote extends Token
  case object Indent extends Token
  case object Dedent extends Token

  case class IndentAndToken(indent: Indentation, token: Token) extends Token
}
