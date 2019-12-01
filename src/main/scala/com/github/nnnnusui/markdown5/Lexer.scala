package com.github.nnnnusui.markdown5

import com.github.nnnnusui.markdown5.CompilationError.Markdown5LexerError
import com.github.nnnnusui.markdown5.Token._

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

  def lineBreak = "\n"
  def char: Parser[String] = ".".r - lineBreak
  def toEndOfLine: Parser[String] = rep1(char) ^^ (_.mkString)
  trait Line {
    val prefix: String
    def parser: Lexer.Parser[String] = prefix ~ ' ' ~> toEndOfLine
  }
  trait Span {
    val prefix: String
    val suffix: String
  }
  trait Block {
    val prefix: Line
    val suffix: Line
  }
  object Title extends Line{
    override val prefix: String = "#"
  }

  def spaces: Parser[String] = " " | "\t"
  def stringLine: Lexer.Parser[String] = rep1(char) ^^ (_.mkString)

  def codeBlockEnclosure: Parser[Token.CodeBlockEnclosure] = {
    val attributes = stringLine
    "```" ~> opt(attributes)
  } ^^ (it=> CodeBlockEnclosure(it.getOrElse("")))

  def indent: Parser[Token.Indentation] = lineBreak ~> rep(spaces) ^^ (it=> Token.Indentation(it.length))
  def text: Parser[Token.Text] = stringLine ^^ (it=> Token.Text(it))
  def title: Parser[Token.Title] = Title.parser  ^^ (it=> Token.Title(it))

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
