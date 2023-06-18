import * as vscode from 'vscode';
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import axios from 'axios';

class ForLoopHoverProvider implements vscode.HoverProvider {
    provideHover(
      document: vscode.TextDocument,
      position: vscode.Position,
    ): vscode.ProviderResult<vscode.Hover> {
      const code = document.getText();
      const ast = acorn.parse(code, { ecmaVersion: 'latest' });
  
      let hover: vscode.Hover | undefined;
  
      walk.ancestor(ast, {
        ForStatement(node: acorn.Node) {
          if (
            node.start <= document.offsetAt(position) &&
            node.end >= document.offsetAt(position)
          ) {
            const hoverRange = new vscode.Range(
              document.positionAt(node.start),
              document.positionAt(node.end)
            );
            hover = new vscode.Hover("hi", hoverRange);
            
            return false; // Stop walking the AST
          }
        },
        ForOfStatement(node: acorn.Node) {
            if (
              node.start <= document.offsetAt(position) &&
              node.end >= document.offsetAt(position)
            ) {
              const forLoopCode = code.substring(node.start, node.end);
              const hoverRange = new vscode.Range(
                document.positionAt(node.start),
                document.positionAt(node.end)
              );
              hover = new vscode.Hover("ur code sux", hoverRange);
              return false; // Stop walking the AST
            }
          },
          ForInStatement(node: acorn.Node) {
            if (
              node.start <= document.offsetAt(position) &&
              node.end >= document.offsetAt(position)
            ) {
              const forLoopCode = code.substring(node.start, node.end);
              const hoverRange = new vscode.Range(
                document.positionAt(node.start),
                document.positionAt(node.end)
              );
              hover = new vscode.Hover("ur code bad", hoverRange);
              return false; // Stop walking the AST
            }
          },
      });
  
      return hover;
    }
  }

class ForLoopHighlighter {
  private decorationType: vscode.TextEditorDecorationType;

  constructor() {
    this.decorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
    });
  }

  public activate(context: vscode.ExtensionContext) {
    vscode.window.onDidChangeActiveTextEditor(this.updateDecorations, this, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument(this.updateDecorations, this, context.subscriptions);

    this.updateDecorations();
  }

  private updateDecorations() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const code = editor.document.getText();
    const ast = acorn.parse(code, { ecmaVersion: 'latest' });

    const forLoops: vscode.Range[] = [];

    console.log(ast);
    walk.simple(ast, {
      ForStatement(node: acorn.Node) {
        const { start, end } = node;
        const startPos = editor.document.positionAt(start);
        const endPos = editor.document.positionAt(end);

        const range = new vscode.Range(startPos, endPos);
        forLoops.push(range);
      },
      ForOfStatement(node: acorn.Node) {
        const { start, end } = node;
        const startPos = editor.document.positionAt(start);
        const endPos = editor.document.positionAt(end);

        const range = new vscode.Range(startPos, endPos);
        forLoops.push(range);
      },
      ForInStatement(node: acorn.Node) {
        const { start, end } = node;
        const startPos = editor.document.positionAt(start);
        const endPos = editor.document.positionAt(end);

        const range = new vscode.Range(startPos, endPos);
        forLoops.push(range);
      },
      ForAwaitOfStatement(node: acorn.Node) {
        const { start, end } = node;
        const startPos = editor.document.positionAt(start);
        const endPos = editor.document.positionAt(end);
      
        const range = new vscode.Range(startPos, endPos);
        forLoops.push(range);
      },
    });

    editor.setDecorations(this.decorationType, forLoops);
  }

  public async promptChatGPTranges(ranges: vscode.Range[]) {
    const suggestions: string[] = [];
  
    for (const range of ranges) {
      const codeSnippet = vscode.window.activeTextEditor?.document.getText(range);
      if (codeSnippet) {
        try {
          const response = await axios.post('https://api.openai.com/v1/completions', {
            prompt: `How can I improve the following code snippet?\n\n${codeSnippet}`,
            max_tokens: 100,
            temperature: 0.7,
            n: 1,
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer YOUR_OPENAI_API_KEY',
            },
          });
  
          const suggestion = response.data.choices[0]?.text.trim();
          if (suggestion) {
            suggestions.push(suggestion);
          }
        } catch (error) {
          console.error('Error calling ChatGPT:', error);
        }
      }
    }
  }

  public dispose() {
    this.decorationType.dispose();
  }
}

export function activate(context: vscode.ExtensionContext) {
    const forLoopHighlighter = new ForLoopHighlighter();
    forLoopHighlighter.activate(context);

    const hoverProvider = new ForLoopHoverProvider();
	const selector: vscode.DocumentSelector = { scheme: 'file' }; // specify the document selector here

	context.subscriptions.push(
		vscode.languages.registerHoverProvider(selector, hoverProvider)
	); 

    context.subscriptions.push(forLoopHighlighter);
}
