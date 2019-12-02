package com.github.nnnnusui.markdown5

sealed trait Token
object Token {
  sealed trait Span extends Token
  object Span {
    case object Empty extends Span
    case class Text(value: String) extends Span
    case object Code extends Span
    case object Emphasis extends Span
    case object Strong extends Span
    case object Escape extends Span
    case class Escaped(value: String) extends Span
//    case class Code(value: String) extends Span
//    case class Emphasis(value: String) extends Span
//    case class Strong(value: String) extends Span
  }
}
