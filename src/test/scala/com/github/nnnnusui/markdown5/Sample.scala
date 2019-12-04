package com.github.nnnnusui.markdown5

object Sample {
  val text: String =
    """
      |# Markdown5
      |*test\*``\**x`nest*emph*`** *nest`code`*textdoshiyo **stron*nestem*g**
      |# H2
      |line1
      |  line2
      |line3
      |  # H3
      |  >>>
      |    引用ブロック
      |  的な。
      |# H2
      |ででんと
      |　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　空白テスト
      |""".stripMargin
}
