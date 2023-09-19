// status-bar.ts

import * as vscode from 'vscode';

let copyButton: vscode.StatusBarItem | undefined;

export function initializeStatusBarAndSelectionHandler(context: vscode.ExtensionContext) {
  copyButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
  copyButton.text = 'Create Zist';
  copyButton.command = 'zist.explorer-quickpick-input';
  copyButton.hide();

  context.subscriptions.push(copyButton);

  vscode.window.onDidChangeTextEditorSelection(() => {
    const editor = vscode.window.activeTextEditor;
    if (editor && !editor.selection.isEmpty) {
      copyButton?.show();
    } else {
      copyButton?.hide();
    }
  });
}
