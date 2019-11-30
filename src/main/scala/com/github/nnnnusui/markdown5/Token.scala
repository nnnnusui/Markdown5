package com.github.nnnnusui.markdown5

sealed trait Token
object Token {
  case class Indent(depth: Int) extends Token
  case class Text(value: String) extends Token

  case class CodeBlockEnclosure(attributesText: String) extends Token
}
