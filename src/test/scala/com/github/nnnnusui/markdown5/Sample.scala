package com.github.nnnnusui.markdown5

object Sample {
  val text: String =
    """
      |# Markdown5 (mandatory)
      |*test\*``\**x`nest*emph*`** *nest`code`*textdoshiyo **stron*nestem*g**
      |# H2
      |line1
      |  line2
      |line3
      |  # インデントブロック
      |  '>
      |    引用ブロック
      |  `>
      |    コードブロック
      |
      |  的な。
      |# H2
      |ででんと
      |                                                                          空白テスト
      |""".stripMargin
}
