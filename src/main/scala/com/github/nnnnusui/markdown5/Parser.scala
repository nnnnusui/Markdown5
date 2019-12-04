package com.github.nnnnusui.markdown5

import com.github.nnnnusui.markdown5.CompilationError.ParserError
import com.github.nnnnusui.markdown5.Element.{Block, BlockQuote, Paragraph, Title}

import scala.util.parsing.combinator.Parsers

object Parser extends Parsers {
  def apply(lines: Seq[Token]): Either[CompilationError, Markdown5] ={
    val reader = new TokenReader(lines)
    markdown5(reader) match {
      case NoSuccess(msg, next)  => Left(ParserError(msg))
      case Success(result, next) => Right(result)
    }
  }
  override type Elem = Token
  def markdown5: Parser[Markdown5] = block ~ rep(block) ^^ {case first ~ others => Markdown5(Block(first.title, first.elements ::: others))}

  def block: Parser[Block] = opt(title) ~ contents ^^ {case title ~ contents => Block(title.getOrElse(Title("")), contents)}
  def indent: Parser[Block] = Token.Indent ~> (indent | block) <~ Token.Dedent

  def contents: Parser[List[Element]] = rep1(content)
  def content: Parser[Element] = indent | paragraph | blockQuote

  def paragraph: Parser[Paragraph] = rep1(line) ^^ (it=> Paragraph(it))
  def blockQuote: Parser[BlockQuote] = Token.BlockQuote ~> indent ^^ (it=> BlockQuote(it))

  private def title: Parser[Title] ={
    accept("title", {case Token.Title(value) => Title(value)})
  }
  private def line: Parser[String] ={
    accept("line", {case Token.Line(value) => value})
  }
}
