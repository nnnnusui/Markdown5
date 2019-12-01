package com.github.nnnnusui.markdown5

import com.github.nnnnusui.markdown5.CompilationError.Markdown5ParserError
import com.github.nnnnusui.markdown5.Element.{Block, CodeBlock, Line, Title}
import com.github.nnnnusui.markdown5.Token.{Dedent, Indent}

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
  def markdown5: Parser[Markdown5] = contents ^^ (it=> Markdown5(it))

  def contents: Parser[List[Element]] = rep1(content)
  def content: Parser[Element] = codeBlock | block | title | line

  def codeBlock: Parser[CodeBlock] = codeBlockEnclosure ~> (backBlock | contents) <~ codeBlockEnclosure ^^ (it=> CodeBlock(it))

  def block: Parser[Block] = Indent ~> contents <~ Dedent ^^ (it=> Block(it))
  def backBlock: Parser[List[Element]] = Dedent ~> (backBlock | contents) <~ Indent

  def title: Parser[Title] = titleToken ^^ (it=> Title(it.value))
  def line: Parser[Line] = text ^^ (it=> Line(it.value))

  private def text: Parser[Token.Text]
    = accept("text", { case text @ Token.Text(value) => text })
  private def titleToken: Parser[Token.Title]
    = accept("title", { case title @ Token.Title(value) => title })
  private def codeBlockEnclosure: Parser[Token.CodeBlockEnclosure]
    = accept("text", { case codeBlockEnclosure @ Token.CodeBlockEnclosure(value) => codeBlockEnclosure })
}
