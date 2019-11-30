package com.github.nnnnusui.markdown5

import com.github.nnnnusui.markdown5.CompilationError.Markdown5LexerError
import com.github.nnnnusui.markdown5.Token.{CodeBlockEnclosure, Dedent, Indent, Indentation, Text, Title}

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

  def codeBlockEnclosure: Parser[CodeBlockEnclosure] = {
    val attributes = stringLine
    "```" ~> opt(attributes)
  } ^^ (it=> CodeBlockEnclosure(it.getOrElse("")))

  def indent: Parser[Indentation] = lineBreak ~> rep(spaces) ^^ (it=> Indentation(it.length))
  def text: Parser[Text] = stringLine ^^ (it=> Text(it))
  def title: Parser[Token] = "# " ~> stringLine  ^^ (it=> Title(it))

  def line: Parser[Token] = codeBlockEnclosure | indent | title | text
  def lines: Parser[List[Token]] = rep1(line) ^^ (it=> indentProcess(it))

  def indentProcess(tokens: List[Token], indents: List[Int] = List(0)): List[Token] ={
    tokens.headOption match {
      case Some(Indentation(size)) if size > indents.head =>
        val indentTokens = List.fill(size - indents.head){ Indent }
        indentTokens ::: indentProcess(tokens.tail, size :: indents)
      case Some(Indentation(size)) if size < indents.head =>
        val kept = indents.filterNot(_ > size)
        val dedentTokens = List.fill(indents.head - size){ Dedent }
        dedentTokens ::: indentProcess(tokens.tail, kept)
      case Some(Indentation(size)) if size == indents.head =>
        indentProcess(tokens.tail, indents)
      case Some(token) =>
        token :: indentProcess(tokens.tail, indents)
      case None =>
        val dedentTokens = List.fill(indents.head){ Dedent }
        dedentTokens
    }
  }
}
