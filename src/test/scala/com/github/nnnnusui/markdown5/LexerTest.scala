package com.github.nnnnusui.markdown5

import org.scalatest.FunSuite

class LexerTest extends FunSuite {

  test("testApply") {
    Lexer(Sample.text) match {
      case Right(tokens) => println(tokens.mkString("\n"))
      case Left(msg) => println(s"ERROR: $msg")
    }
  }

}
