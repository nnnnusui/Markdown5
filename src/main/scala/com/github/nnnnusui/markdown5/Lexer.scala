package com.github.nnnnusui.markdown5

import com.github.nnnnusui.markdown5.CompilationError.Markdown5LexerError
import com.github.nnnnusui.markdown5.Token.{CodeBlock, Indent, Text}

import scala.util.matching.Regex
import scala.util.parsing.combinator.RegexParsers

object Lexer extends RegexParsers{
  def apply(text: String): Either[Markdown5LexerError, List[Token]] = {
    parse(lines, text) match {
      case NoSuccess(msg, _) => Left(Markdown5LexerError(msg))
      case Success(result, _) => Right(result)
    }
  }

  override def skipWhitespace = true
  override val whiteSpace: Regex = "[\t\r\f]+".r

  def spaces: Parser[String] = " " | "\t"
  def lineBreak = "\n"
  def char: Parser[String] = ".".r - lineBreak
  def stringLine: Lexer.Parser[String] = rep1(char) ^^ (_.mkString)

  def indent: Parser[Indentation] = lineBreak ~> rep(spaces) ^^ (it=> Indentation(it.length))
  def text: Parser[Text] = stringLine ^^ (it=> Text(it))
  def lines: Parser[List[Token]] = rep(indent | text)
}
