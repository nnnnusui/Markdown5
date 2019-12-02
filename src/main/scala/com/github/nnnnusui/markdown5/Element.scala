package com.github.nnnnusui.markdown5

sealed trait Element
object Element {
  case class Paragraph(lines: List[String]) extends Element {
    override def toString: String = lines.mkString("\n")
  }
  case class Block(elements: List[Element]) extends Element {
    override def toString: String = s"Block(${elements.mkString(", ")})"
  }
}
