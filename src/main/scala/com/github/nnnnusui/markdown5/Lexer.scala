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
  def token: Parser[Token] = indent ~ lineContent ^^ {case indent ~ content => IndentAndToken(indent, content)}
  def lineContent: Parser[Token] = blockquote | title | line

  def indent: Parser[Indentation] = lineBreak ~> rep(spaces) ^^ (it=> Indentation(it.size))
  def title: Parser[Title] = "# " ~> rep1(char) ^^ (it=> Title(it.mkString))
  def line: Parser[Line] = rep(char) ^^ (it=> Line(it.mkString))
  def blockquote: Lexer.Parser[Token.BlockQuote.type] = ">>>" ^^ (it=> BlockQuote)

  def spaces: Parser[String] = " " | "\t"
  def char: Parser[String] = ".".r
  def lineBreak = "\n"

  def indentProcess(tokens: List[Token], indent: Int = 0, isBlockHead: Boolean = false): List[Token] ={
    tokens.headOption match {
      case Some(IndentAndToken(Indentation(depth), line: Line)) if indent < depth && !isBlockHead =>
        val spaces = " ".repeat(depth - indent)
        Line(s"$spaces${line.value}") :: indentProcess(tokens.tail, indent)
      case Some(IndentAndToken(Indentation(depth), token))=>
        val indentationTokens = depth match {
          case _ if indent < depth => List.fill(depth - indent){ Indent }
          case _ if indent > depth => List.fill(indent - depth){ Dedent }
          case _                   => List.empty
        }
        val nextIsBlockHead = token == BlockQuote
        indentationTokens ::: token :: indentProcess(tokens.tail, depth, nextIsBlockHead)
      case None =>
        val dedentTokens = List.fill(indent){ Dedent }
        dedentTokens
    }
  }
}
