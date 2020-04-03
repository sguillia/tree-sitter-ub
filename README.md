# tree-sitter bug repro

```
npm install
npm run build
npm test
```

The `npm test` command will run two test cases.

The only difference between the two test cases, is that the file `visitTree` will go through the following statement the first time only:

```
void (cursor.currentNode.parent)
```

This read expression has the side-effect of changing the AST, more precisely, changing some `node.parent`.

Without the read expression, the target parent type is `_expression`, which I do not desire.
With the read expression, the target parent type is `call_expression`, which I want.

So I leave the read expression in my production code and it works in most cases, but I still have problems when developing new features.

Note that the following statement also has side-effects, in `callexpression.ts`:
```
void (node.functionNode)
```

Try commenting it out and re-running the tests.
