package com.github.nnnnusui.markdown5

import org.scalatest.FunSuite

class CompilerTest extends FunSuite {

  test("testApply") {
    val md5 = Compiler(Sample.text)
    println(md5.right.get.value.mkString("\n"))
  }

}
