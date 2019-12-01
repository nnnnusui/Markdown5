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
  def token: Parser[Token] = code | text

  def text = rep1(escapedChar | char - '`') ^^ (it=> Text(it.mkString))
  def code = '`' ~> rep(escapedChar | (char - '`')) <~ '`' ^^ (it=> Code(it.mkString))

  def escapedChar = '\\' ~> char

  def toEndOfLine: Parser[String] = rep1(char - lineBreak) ^^ (_.mkString)
  def spaces: Parser[String] = " " | "\t"
  def char: Parser[String] = ".".r
  def lineBreak = "\n"
}
