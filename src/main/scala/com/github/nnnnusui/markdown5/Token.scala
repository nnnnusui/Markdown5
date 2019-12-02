package com.github.nnnnusui.markdown5

sealed trait Token
object Token {
  case class Line(value: String) extends Token
  case class Indentation(depth: Int) extends Token
}
