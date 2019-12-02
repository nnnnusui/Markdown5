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
  def tokens: Parser[List[Token]] = rep1(token) ^^ (it=> indentProcess(it))
  def token: Parser[Token] = line | indent

  def line: Parser[Line] = rep1(char) ^^ (it=> Line(it.mkString))
  def indent: Parser[Indentation] = lineBreak ~> rep(spaces) ^^ (it=> Indentation(it.size))

  def spaces: Parser[String] = " " | "\t"
  def char: Parser[String] = ".".r
  def lineBreak = "\n"

  def indentProcess(tokens: List[Token], indent: Int = 0): List[Token] ={
    tokens.headOption match {
      case Some(Indentation(size)) if size > indent =>
        val indentTokens = List.fill(size - indent){ Indent }
        indentTokens ::: indentProcess(tokens.tail, size)
      case Some(Indentation(size)) if size < indent =>
        val dedentTokens = List.fill(indent - size){ Dedent }
        dedentTokens ::: indentProcess(tokens.tail, size)
      case Some(Indentation(size)) if size == indent =>
        indentProcess(tokens.tail, indent)
      case Some(token) =>
        token :: indentProcess(tokens.tail, indent)
      case None =>
        val dedentTokens = List.fill(indent){ Dedent }
        dedentTokens
    }
  }
}
