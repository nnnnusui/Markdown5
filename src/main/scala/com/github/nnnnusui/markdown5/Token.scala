package com.github.nnnnusui.markdown5

sealed trait Token
object Token {
  case class Text(value: String) extends Token
  case class Code(value: String) extends Token
}