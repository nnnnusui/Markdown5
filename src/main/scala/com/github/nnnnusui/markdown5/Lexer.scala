package com.github.nnnnusui.markdown5

import com.github.nnnnusui.markdown5.CompilationError.LexerError
import com.github.nnnnusui.markdown5.Token.Span.Escaped
import com.github.nnnnusui.markdown5.Token._

import scala.util.matching.Regex
import scala.util.parsing.combinator.RegexParsers

object Lexer extends RegexParsers{
  def apply(text: String): Either[LexerError, List[Token]] = {
    parse(tokens, text) match {
      case NoSuccess(msg, _) => Left(LexerError(msg))
      case Success(result, _) => Right(result)
    }
  }
  override def skipWhitespace = true
  override val whiteSpace: Regex = "[\t\r\f]+".r
  def tokens: Parser[List[Token]] = rep1(token)
  def token: Parser[Token] = span

  def span: Parser[Span] = escaped | escape | strong | emphasis | code | text
  def text: Parser[Span.Text] = rep1(char - ("\\" | "**" | "*" | "`")) ^^ (it=> Span.Text(it.mkString))
  def code: Lexer.Parser[Span.Code.type] = "`" ^^ (_=> Span.Code)
  def emphasis: Lexer.Parser[Span.Emphasis.type] = "*" ^^ (_=> Span.Emphasis)
  def strong: Lexer.Parser[Span.Strong.type] = "**" ^^ (_=> Span.Strong)
  def escape: Lexer.Parser[Span.Escape.type] = escapePrefix ^^ (_=> Span.Escape)

  def escaped = "\\" ~> ("\\" | "**" | "*" | "`") ^^ (it=> Escaped(it))
  def escapedEscapePrefix: String = escapePrefix.repeat(2)
  def escapePrefix = "\\"

  def toEndOfLine: Parser[String] = rep1(char - lineBreak) ^^ (_.mkString)
  def spaces: Parser[String] = " " | "\t"
  def char: Parser[String] = ".".r
  def lineBreak = "\n"
}
