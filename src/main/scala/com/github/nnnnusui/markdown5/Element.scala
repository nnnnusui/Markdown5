package com.github.nnnnusui.markdown5

sealed trait Element{
  def toHtml: String
}
object Element {
  case class Title(values: String) extends Element {
    override def toHtml: String = s"<h1>$values</h1>"
  }
  case class Paragraph(lines: List[String]) extends Element {
    override def toHtml: String = s"<p>${lines.map(_.replace(" ", "&nbsp;")).mkString("<br>")}</p>"
    override def toString: String = lines.mkString("\n")
  }
  case class Block(title: Title, elements: List[Element]) extends Element {
    override def toHtml: String = s"<section>${title.toHtml}${elements.map(_.toHtml).mkString}</section>"
    override def toString: String = s"Block(${title}\n${elements.mkString(", ")})"
  }

  case class BlockQuote(block: Block) extends Element {
    override def toHtml: String = s"<blockquote>${block.toHtml}</blockquote>"
  }
}
