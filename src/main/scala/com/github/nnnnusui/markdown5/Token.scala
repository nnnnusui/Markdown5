package com.github.nnnnusui.markdown5

sealed trait Token
object Token {
  case class Indentation(depth: Int) extends Token
  case class Text(value: String) extends Token
  case class Title(value: String) extends Token
  case object Indent extends Token
  case object Dedent extends Token

  case class CodeBlockEnclosure(attributesText: String) extends Token
}
