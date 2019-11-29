package com.github.nnnnusui.markdown5

object Compiler {
  def main(args: Array[String]): Unit = {
    println(Lexer(Sample.text))
  }
}
