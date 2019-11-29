package com.github.nnnnusui.markdown5

import com.github.nnnnusui.markdown5.CompilationError.Markdown5ParserError
import com.github.nnnnusui.markdown5.Element.Line
import com.github.nnnnusui.markdown5.Token.{Indent, Text}

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
  def markdown5: Parser[Markdown5] = rep1(line | blankLine) ^^ (it=> Markdown5(it))

  def line: Parser[Element] = opt(indent) ~ text ^^ { case indent ~ text => Line(text.value) }
  def blankLine: Parser[Element] = indent ^^ (_=> Line(""))

  private def indent: Parser[Indent]
    = accept("indent", { case indent @ Indent(depth) => indent })
  private def text: Parser[Text]
    = accept("text", { case text @ Text(value) => text })
}
