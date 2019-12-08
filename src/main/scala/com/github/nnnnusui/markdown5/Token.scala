package com.github.nnnnusui.markdown5

sealed trait Token
object Token {
  case class Indentation(depth: Int) extends Token
  case class IndentAndToken(indent: Indentation, token: Token) extends Token
  case class Title(value: String) extends Token
  case class Line(value: String) extends Token
  case object Indent extends Token
  case object Dedent extends Token

  sealed trait BlockPrefix extends Token

  sealed trait Span
  sealed trait LinePrefix
  sealed trait DestructiveBlockEnclosure
  case object BlockQuote extends BlockPrefix
  case object CodeBlock extends BlockPrefix
}
