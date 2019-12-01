package com.github.nnnnusui.markdown5

import com.github.nnnnusui.markdown5.CompilationError.LexerError
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

  def span: Parser[Span] = emphasis | code | text
  def text: Parser[Span.Text] = rep1(char - (emphasis | code)) ^^ (it=> Span.Text(it.mkString))
  def code: Parser[Span.Code] = spanToken("`") ^^ (it=> Span.Code(it))
  def emphasis: Parser[Span.Emphasis] = spanToken("*") ^^ (it=> Span.Emphasis(it))

  def spanToken(enclosure: String): Parser[String] = spanToken(enclosure, enclosure)
  def spanToken(prefix: String, suffix: String): Parser[String] ={
    val escapedChar = escapePrefix ~> suffix
    val textChar = escapedEscapePrefix | escapedChar | (char - suffix)
    prefix ~> rep(textChar) <~ suffix ^^ (_.mkString)
  }

  def escapedEscapePrefix: String = escapePrefix.repeat(2)
  def escapePrefix = "\\"

  def toEndOfLine: Parser[String] = rep1(char - lineBreak) ^^ (_.mkString)
  def spaces: Parser[String] = " " | "\t"
  def char: Parser[String] = ".".r
  def lineBreak = "\n"
}
