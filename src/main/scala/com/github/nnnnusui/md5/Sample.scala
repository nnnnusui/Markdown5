package com.github.nnnnusui.md5

object Sample {
  val text: String =
    """# 最初のたいとる
      |ニセMarkdownって感じの書式です。
      |拡張子は ‘md5’ 。
      |
      |# 書式一覧
      |  # タイトル
      |  ``` title.md5
      |  # h1 文書のタイトル
      |  # h2
      |    # h3
      |      #h4
      |  # h2
      |    # h3
      |  ```
      |  - 文書内に、htmlでの`h1`にあたるタイトルは1つのみ。
      |  - インデントの深さでタイトルのレベルを判断する。
      |    - が、h1とh2のインデントは同じになる。
      |
      |  # リスト
      |  ``` list.md5
      |  - list1
      |    - list1-1
      |      - list1-1-1
      |  - list2
      |  ^ list2に含まれる
      |  - list3
      |  ```
      |
      |
      |  # コードブロック
      |  ``` cordBlock.md5
      |    ``` example.txt
      |    example content.
      |    ```
      |  ```""".stripMargin
}
