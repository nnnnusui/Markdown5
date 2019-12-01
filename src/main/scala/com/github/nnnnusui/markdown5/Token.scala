package com.github.nnnnusui.markdown5

sealed trait Token
object Token {
  case class Indentation(depth: Int) extends Token
  case class Text(value: String) extends Token {override def toString: String = value}
  case class Title(value: String) extends Token //{override def toString: String = s"# $value"}
  case object Indent extends Token
  case object Dedent extends Token

  case object ThematicBreak extends Token

//  case class Paragraph(value: List[Text]) extends Token //{override def toString: String = value.mkString}
  case class CodeBlockEnclosure(attributesText: String) extends Token
}
