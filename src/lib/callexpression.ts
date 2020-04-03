import Parser from "tree-sitter";
import chalk from "chalk"
import * as visit from "./visitTree"

export function parseExpect(node: Parser.SyntaxNode) {

	const expectCall = findExpectCall(node)!

	let parent = expectCall.parent!.parent!

	console.log(chalk.yellow("The type of the node is " + chalk.bold(parent.type)))

	if (parent.type === '_expression') {
		// bug: the void expressions had side-effects: parent.type should always be call_expression
		throw new Error("tree-sitter bug just happened")
	}
}

function findExpectCall(node: Parser.SyntaxNode): Parser.SyntaxNode | undefined {
	let output = visit.visitTree(node.walk(), findExpectCallVisitor, undefined, {})
	return output.expectCall
}

type FindExpectCallVisitorOutput = {
	expectCall?: Parser.SyntaxNode
}

function findExpectCallVisitor(node: Parser.SyntaxNode, indent: number, visitor: undefined, output: FindExpectCallVisitorOutput): undefined {
	if (isExpectCall(node)) {
		output.expectCall = node
	}
	return undefined
}

function isExpectCall(node: Parser.SyntaxNode): boolean {

	// This has side-effects too

	//@ts-ignore
	void (node.functionNode)

	return node.firstNamedChild?.text === "expect"
}
