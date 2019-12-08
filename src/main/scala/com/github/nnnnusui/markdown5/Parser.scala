package com.github.nnnnusui.markdown5

import com.github.nnnnusui.markdown5
import com.github.nnnnusui.markdown5.CompilationError.ParserError
import com.github.nnnnusui.markdown5.Element.{Block, BlockQuote, CodeBlock, Paragraph, Section, Title}

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
  def markdown5: Parser[Markdown5] = section ~ rep(section) ^^ {case first ~ others => new Markdown5(first.title, first.elements ::: others)}

  def section: Parser[Section] = title ~ contents  ^^ {case title ~ contents => Section(title, contents)}
  def block: Parser[Block] = contents ^^ (it=> Block(it))
  def indented[A](parser: Parser[A]): Parser[A] = Token.Indent ~> (indented(parser) | parser) <~ Token.Dedent

  def contents: Parser[List[Element]] = rep(content)
  def content: Parser[Element] = indented(section) | paragraph | blockQuote | codeBlock

  def paragraph: Parser[Paragraph] = rep1(line) ^^ (it=> Paragraph(it))
  def blockQuote: Parser[BlockQuote] = Token.BlockQuote ~> indented(block) ^^ (it=> BlockQuote(it))
  def codeBlock: Parser[CodeBlock] = Token.CodeBlock ~> indented(block) ^^ (it=> CodeBlock(it))

  private def title: Parser[Title] ={
    accept("title", {case Token.Title(value) => Title(value)})
  }
  private def line: Parser[String] ={
    accept("line", {case Token.Line(value) => value})
  }
}
