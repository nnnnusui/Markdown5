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
  def lineContent: Parser[Token] = blockquote | codeBlock | title | line

  def indent: Parser[Indentation] = lineBreak ~> rep(space) ^^ (it=> Indentation(it.size))
  def title: Parser[Title] = "# " ~> rep1(char) ^^ (it=> Title(it.mkString))
  def line: Parser[Line] = rep(char) ^^ (it=> Line(it.mkString))
  def blockquote: Parser[Token.BlockQuote.type] = blockPrefix("'") ^^ (it=> BlockQuote)
  def codeBlock: Parser[Token.CodeBlock.type] = blockPrefix("`") ^^ (it=> CodeBlock)
  def blockPrefix(prefix: String): Parser[String] = prefix <~ ">"

  def space: Parser[String] = " " | "\t"
  def char: Parser[String] = ".".r
  def lineBreak = "\n"

  def indentProcess(tokens: List[Token], indent: Int = 0, isBlockHead: Boolean = false): List[Token] ={
    tokens.headOption match {
      case Some(IndentAndToken(Indentation(depth), line: Line)) if indent < depth && !isBlockHead =>
        val spaces = "\u00A0".repeat(depth - indent)
        Line(s"$spaces${line.value}") :: indentProcess(tokens.tail, indent)
      case Some(IndentAndToken(Indentation(depth), token))=>
        (depth match {
          case _ if indent < depth => List.fill(depth - indent){ Indent }
          case _ if indent > depth => List.fill(indent - depth){ Dedent }
          case _                   => List.empty
        }) ::: token :: (token match {
          case _: BlockPrefix => indentProcess(tokens.tail, depth, isBlockHead = true)
          case _              => indentProcess(tokens.tail, depth)
        })
      case None =>
        val dedentTokens = List.fill(indent){ Dedent }
        dedentTokens
    }
  }
}
