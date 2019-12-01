package com.github.nnnnusui.markdown5

sealed trait Element
object Element{
  case class Title(text: String) extends Element
  case class Line(value: String) extends Element
  case class Paragraph(lines: List[Line]) extends Element
  case class Block(contents: List[Element]) extends Element
  case class CodeBlock(contents: List[Element]) extends Element
}
