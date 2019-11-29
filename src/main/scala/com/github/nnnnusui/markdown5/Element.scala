package com.github.nnnnusui.markdown5

sealed trait Element
object Element{
  case class Line(value: String) extends Element
}
