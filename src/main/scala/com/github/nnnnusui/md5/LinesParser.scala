package com.github.nnnnusui.md5

import scala.util.matching.Regex
import scala.util.parsing.combinator.{Parsers, RegexParsers}
import scala.util.parsing.input.{NoPosition, Position, Reader}

object LinesCompiler{
  def apply(text: String): Either[LinesCompilationError, LinesAST] ={
    for {
      tokens <- LinesLexer(text).right
      ast <- LinesParser(tokens).right
    } yield ast
  }
  def main(args: Array[String]): Unit = {

    println(LinesCompiler(Sample.text))
  }
}

sealed trait LinesAST
case class Markdown5(value: List[LinesAST]) extends LinesAST
case class Line(value: String) extends LinesAST
object LinesParser extends Parsers {
  def apply(lines: Seq[LineToken]): Either[LinesCompilationError, LinesAST] ={
    val reader = new LinesReader(lines)
    markdown5(reader) match {
      case NoSuccess(msg, next)  => Left(LinesParserError(msg))
      case Success(result, next) => Right(result)
    }
  }
  override type Elem = LineToken
  def markdown5: Parser[LinesAST] = rep1(line | blankLine) ^^ (it=> Markdown5(it))

  def line: Parser[LinesAST] = opt(indent) ~ text ^^ { case indent ~ text => Line(text.value) }
  def blankLine: Parser[LinesAST] = indent ^^ (_=> Line(""))

  private def indent: Parser[Indent]
    = accept("indent", { case indent @ Indent(depth) => indent })
  private def text: Parser[Text]
    = accept("text", { case text @ Text(value) => text })
}

trait LineToken
case class Indent(depth: Int) extends LineToken
case class Text(value: String) extends LineToken

trait LinesCompilationError
case class LinesLexerError(msg: String) extends LinesCompilationError
case class LinesParserError(msg: String) extends LinesCompilationError

object LinesLexer extends RegexParsers{
  override def skipWhitespace = true
  override val whiteSpace: Regex = "[\t\r\f]+".r

  def spaces: LinesLexer.Parser[String] = " " | "\t"
  def lineBreak = "\n"
  def char: Parser[String] = ".".r - lineBreak

  def indent: LinesLexer.Parser[Indent] = lineBreak ~> rep(spaces) ^^ (it=> Indent(it.length))
  def text: LinesLexer.Parser[Text] = rep1(char) ^^ (it=> Text(it.mkString))
  def lines: LinesLexer.Parser[List[LineToken]] = rep(indent | text)

  def apply(text: String): Either[LinesLexerError, List[LineToken]] = {
    parse(lines, text) match {
      case NoSuccess(msg, next) => Left(LinesLexerError(msg))
      case Success(result, next) => Right(result)
    }
  }
}


//object LinesParser extends RegexParsers{
//  def apply(lines: Seq[Line]): LinesParser = new LinesParser()
//}
class LinesReader(lines: Seq[LineToken]) extends Reader[LineToken]{
  override def first: LineToken = lines.head
  override def atEnd: Boolean = lines.isEmpty
  override def pos: Position = NoPosition
  override def rest: Reader[LineToken] = new LinesReader(lines.tail)
}