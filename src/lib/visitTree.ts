import Parser from "tree-sitter";

// This file implements a simple visitor pattern

// it also has a (void) expression that has unexpected side-effects

export function visitTree<T, O>(
	cursor: Parser.TreeCursor,
	visitCallback: (node: Parser.SyntaxNode, indent: number, visitor: T, output: O) => T,
	visitor: T,
	output: O,
	verbose?: false,
	indent: number = 0,
	visitSiblings: boolean = false,
	isRoot = true): O {

	//@ts-ignore
	if (global.__workaround === undefined) {
		throw new Error("no __workaround")
	}

	//@ts-ignore
	if (global.__workaround === true) {
		void (cursor.currentNode.parent)
		// void (cursor.currentNode.parent?.parent?.parent?.parent?.parent) // sometimes this helps too
	}

	let child_visitor: T;
	let stopChildVisit = false;
	child_visitor = visitCallback(cursor.currentNode, indent, visitor, output)

	try {
		if (!stopChildVisit) {
			if (cursor.gotoFirstChild()) {
				visitTree(cursor, visitCallback, child_visitor!, output, verbose, indent + 1, true, false)
				if (!cursor.gotoParent()) {
					throw new Error('tree sitter bug (another one)')
				}
			}
		}

		if (visitSiblings) {
			while (cursor.gotoNextSibling()) {
				visitTree(cursor, visitCallback, visitor, output, verbose, indent, false, false)
			}
		}
	} catch (e) {
		throw e;
	}

	return output;
}
