package com.github.nnnnusui.markdown5

import com.github.nnnnusui.markdown5.CompilationError.Markdown5LexerError
import com.github.nnnnusui.markdown5.Token.{Indent, Text}

import scala.util.matching.Regex
import scala.util.parsing.combinator.RegexParsers

object Lexer extends RegexParsers{
  override def skipWhitespace = true
  override val whiteSpace: Regex = "[\t\r\f]+".r

  def spaces: Parser[String] = " " | "\t"
  def lineBreak = "\n"
  def char: Parser[String] = ".".r - lineBreak

  def indent: Parser[Indent] = lineBreak ~> rep(spaces) ^^ (it=> Indent(it.length))
  def text: Parser[Text] = rep1(char) ^^ (it=> Text(it.mkString))
  def lines: Parser[List[Token]] = rep(indent | text)

  def apply(text: String): Either[Markdown5LexerError, List[Token]] = {
    parse(lines, text) match {
      case NoSuccess(msg, _) => Left(Markdown5LexerError(msg))
      case Success(result, _) => Right(result)
    }
  }
}
