package com.github.nnnnusui.markdown5

case class Markdown5(value: List[Element]){
  def toHtml: String = value.map(_.toHtml).mkString
}
