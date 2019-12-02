package com.github.nnnnusui.markdown5

sealed trait Token
object Token {
  case class Line(value: String) extends Token
  case object Indent extends Token
}
