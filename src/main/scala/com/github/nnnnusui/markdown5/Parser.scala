package com.github.nnnnusui.markdown5

import scala.util.matching.Regex
import scala.util.parsing.combinator.RegexParsers

object Parser extends Parser {
  def main(args: Array[String]): Unit = {
    val text = Sample.text
    parse(tokens, text) match {
      case Success(matched, _) => println(matched.mkString("\n"))
      case Failure(msg, _) => println(s"FAILURE: $msg")
      case Error(msg, _) => println(s"ERROR: $msg")
    }
//    val lines = text.filterNot(_=='\r')
//      .split("\n")
//      .map{it=>
//        val text = it.dropWhile(_ == ' ')
//        val spaceLength = it.length - text.length
//        Line(spaceLength, text)
//      }.toList
//    println(lines)
  }
  case class Line(spaceLength: Int, text: String)

  trait Token
  case class Block(contents: List[Token]) extends Token
  case class Title(value: String) extends Token
  case class Text(value: String) extends Token

//  def lineParse(lines: List[Line], indent: Int = 0, stock: List[Block] = List.empty): List[Token] ={
//    if (lines.isEmpty) return List.empty
//    val line = lines.head
//    val token = textParse(line.text)
//    line.spaceLength match {
//      case it if indent < it => // indent
//        Block(List(token)) :: stock
//      case it if indent > it => // dedent
//
//      case _ => //normal
//
//    }
//  }
//  def textParse(text: String): Token
//    = text match {
//        case it startsWith("# ") =>
//          Title(it)
//        case it =>
//          Text(it)
//      }
}

sealed trait Token
object Token{
  case class Title(value: String) extends LineToken
  case class Text(value: String) extends LineToken
  case class Indentation(size: Int) extends LineToken
  case object Indent extends LineToken
  case object Dedent extends LineToken
  sealed trait Block extends LineToken
  object Block {
    case class CodeBlock(value: List[String]) extends Block
  }
//  case object LineBreak extends Token
//  case object CodeBlockHeader extends Token
//  case object CodeBlockFooter extends Token
}
import Token._
import Token.Block._
class Parser extends RegexParsers{
  override def skipWhitespace: Boolean = true
  override protected val whiteSpace: Regex = "[\r]+".r

  def spaces = " " | "\t"
  def lineBreak = "\n"
  def char: Parser[String] = ".".r

  def codeBlock = {
    val header = "```" ~ textLine
    val footer = lineBreak ~ rep(spaces) ~ "```"
    val line = lineBreak ~> rep(char) ^^ (_.mkString)
    header ~> rep(line - footer) <~ footer
  } ^^ (it=> CodeBlock(it))

  def textLine = rep1(char - lineBreak) ^^ (_.mkString)
  def title = "# " ~> textLine ^^ (it=> Title(it))
  def text = textLine ^^ (it=>Text(it.mkString))

  def indent: Parser[Indentation] = lineBreak ~> rep(' ') ^^ (it =>Indentation(it.size))
  def tokens: Parser[List[LineToken]] = phrase(rep1(indent | codeBlock | title | text)) ^^ (it=> indentProcess(it))


  def indentProcess(tokens: List[LineToken], indents: List[Int] = List(0)): List[LineToken] ={
    tokens.headOption match {
      case Some(Indentation(size)) if size > indents.head =>
        Indent :: indentProcess(tokens.tail, size :: indents)
      case Some(Indentation(size)) if size < indents.head =>
        val (dropped, kept) = indents.partition(_ > size)
        (dropped map (_ => Dedent)) ::: indentProcess(tokens.tail, kept)
      case Some(Indentation(size)) if size == indents.head =>
        indentProcess(tokens.tail, indents)
      case Some(codeBlock: CodeBlock) =>
        val indent = (indents.head :: codeBlock.value.map(_.takeWhile(_==' ').length)).min
        val indentAdjustedLines = codeBlock.value.map(it=> it.drop(indent))
        CodeBlock(indentAdjustedLines) :: indentProcess(tokens.tail, indents)
      case Some(token) =>
        token :: indentProcess(tokens.tail, indents)
      case None =>
        indents.filter(_ > 0).map(_=> Dedent)
    }
  }
}