package com.github.nnnnusui.markdown5

import com.github.nnnnusui.markdown5.Element.{Section, Title}

class Markdown5(title: Title, elements: List[Element]) extends Section(title, elements){
  override def toHtml: String = s"<article>${title.toHtml}${elements.map(_.toHtml).mkString}</article>"
  override def toString: String = s"Markdown5(${title}\n${elements.mkString(", ")})"
}
