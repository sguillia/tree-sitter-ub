import assert from "assert"
import chalk from "chalk"
import Parser from "tree-sitter";
import JavaScript from "tree-sitter-javascript";
import { parseExpect } from "../../lib/callexpression"

export const parser = new Parser();
parser.setLanguage(JavaScript);

const code =
	`
test(function () {
	expect(index).toBe();
})
`

function repro() {
	let program = parser.parse(code);

	let cursor = program.rootNode.walk()
	assert(cursor.gotoFirstChild());

	// expression_statement
	let input_node = cursor.currentNode

	//@ts-ignore
	const args: Parser.SyntaxNode = input_node.firstNamedChild.argumentsNode

	let cursor3 = args.walk()
	assert(cursor3.gotoFirstChild())
	assert(cursor3.gotoNextSibling())
	let callback = cursor3.currentNode

	//@ts-ignore // body is a statement_block
	var body: Parser.SyntaxNode = callback.bodyNode
	assert(body)

	const expr = body.firstNamedChild!.firstNamedChild!

	// expr is a call_expression
	//expr.text == expect(index).toBe()
	parseExpect(expr)
}

describe("Tree sitter reproduce", () => {

	it("Works", () => {
		//@ts-ignore
		global.__workaround = true

		repro()

		console.log(chalk.green("With workaround it works"))
	})

	it("Not work", () => {
		//@ts-ignore
		global.__workaround = false

		repro() // won't work - will throw
		console.log(chalk.yellow("Without workaround it works (bug doesn't reproduce) ..."))
	})

})
