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
  def token: Parser[Token] = indentAndTitle | indentAndLine

  def indent: Parser[Indentation] = lineBreak ~> rep(spaces) ^^ (it=> Indentation(it.size))
  def title: Parser[Title] = "# " ~> rep1(char) ^^ (it=> Title(it.mkString))
  def indentAndTitle: Parser[IndentAndTitle] = indent ~ title ^^ {case(indent ~ title)=> IndentAndTitle(indent, title)}
  def line: Parser[Line] = rep(char) ^^ (it=> Line(it.mkString))
  def indentAndLine: Parser[IndentAndLine] = indent ~ line ^^ {case(indent ~ line)=> IndentAndLine(indent, line)}

  def spaces: Parser[String] = " " | "\t"
  def char: Parser[String] = ".".r
  def lineBreak = "\n"

  def indentProcess(tokens: List[Token], indent: Int = 0): List[Token] ={
    tokens.headOption match {
      case Some(IndentAndTitle(Indentation(depth), title)) =>
        val indentTokens = List.fill(depth - indent){ Indent }
        indentTokens ::: (title :: indentProcess(tokens.tail, depth))
      case Some(IndentAndLine(Indentation(depth), line))=>
        depth match {
          case _ if depth < indent =>
            val dedentTokens = List.fill(indent - depth){ Dedent }
            dedentTokens ::: indentProcess(tokens.tail, depth)
          case _ if depth > indent =>
            val spaces = " ".repeat(depth - indent)
            Line(s"$spaces${line.value}") :: indentProcess(tokens.tail, indent)
          case _ =>
            line :: indentProcess(tokens.tail, indent)
        }
      case Some(token) =>
        token :: indentProcess(tokens.tail, indent)
      case None =>
        val dedentTokens = List.fill(indent){ Dedent }
        dedentTokens
    }
  }
}
