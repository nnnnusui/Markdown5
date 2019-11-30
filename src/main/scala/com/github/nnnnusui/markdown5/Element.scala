package com.github.nnnnusui.markdown5

sealed trait Element
object Element{
  case class Line(value: String) extends Element
  case class Paragraph(lines: List[Line]) extends Element
  case class Block(contents: Element) extends Element
}
