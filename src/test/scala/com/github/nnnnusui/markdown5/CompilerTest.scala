package com.github.nnnnusui.markdown5

import org.scalatest.FunSuite

class CompilerTest extends FunSuite {

  test("testApply") {
    Compiler(Sample.text) match {
      case Right(md5) => println(s"$md5\n${md5.toHtml}")
      case Left(msg) => println(s"ERROR: $msg")
    }
  }

}
