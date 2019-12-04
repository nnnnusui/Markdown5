package com.github.nnnnusui.markdown5

import com.github.nnnnusui.markdown5.Element.Block

case class Markdown5(value: Block){
  def toHtml: String = value.toHtml
}
