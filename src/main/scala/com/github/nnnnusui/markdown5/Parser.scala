package com.github.nnnnusui.markdown5

import com.github.nnnnusui.markdown5.CompilationError.ParserError

import scala.util.parsing.combinator.Parsers

object Parser extends Parsers {
  def apply(lines: Seq[Token]): Either[CompilationError, Markdown5] ={
    val reader = new TokenReader(lines)
    markdown5(reader) match {
      case NoSuccess(msg, next)  => Left(ParserError(msg))
      case Success(result, next) => Right(result)
    }
  }
  override type Elem = Token
  def markdown5: Parser[Markdown5] = contents ^^ (it=> Markdown5(it))
  def contents: Parser[List[Element]] = rep1(content)
  def content: Parser[Element] = ???


}
