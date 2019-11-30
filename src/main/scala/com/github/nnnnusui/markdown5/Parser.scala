package com.github.nnnnusui.markdown5

import com.github.nnnnusui.markdown5.CompilationError.Markdown5ParserError
import com.github.nnnnusui.markdown5.Element.{Block, Line, Paragraph}
import com.github.nnnnusui.markdown5.Token.{Dedent, Indent, Text}

import scala.util.parsing.combinator.Parsers

object Parser extends Parsers {
  def apply(lines: Seq[Token]): Either[CompilationError, Markdown5] ={
    val reader = new TokenReader(lines)
    markdown5(reader) match {
      case NoSuccess(msg, next)  => Left(Markdown5ParserError(msg))
      case Success(result, next) => Right(result)
    }
  }
  override type Elem = Token
  def markdown5: Parser[Markdown5] = rep1(block | line) ^^ (it=> Markdown5(it))

  def block: Parser[Block] = Indent ~> (block | paragraph) <~ Dedent ^^ (it=> Block(it))

  def paragraph: Parser[Paragraph] = rep(line) ^^ (it=> Paragraph(it))
  def line: Parser[Line] = opt(Indent) ~ text ^^ { case _ ~ text => Line(text.value) }
//  def blankLine: Parser[Element] = Indent ^^ (_=> Line(""))

  private def text: Parser[Text]
    = accept("text", { case text @ Text(value) => text })
}
