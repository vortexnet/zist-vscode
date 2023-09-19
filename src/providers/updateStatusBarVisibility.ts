// status-bar.ts

import * as vscode from 'vscode';

let copyButton: vscode.StatusBarItem | undefined;

export function initializeStatusBarAndSelectionHandler() {
  copyButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
  copyButton.text = 'Create Zist';
  copyButton.command = 'zist.explorer-quickpick-input';
  vscode.window.onDidChangeTextEditorSelection(() => {
    const editor = vscode.window.activeTextEditor;
    if (editor && !editor.selection.isEmpty) {
      // Show the "Create Zist" button when text is selected
      copyButton?.show();
    } else {
      // Hide the "Create Zist" button when no text is selected
      copyButton?.hide();
    }
  });
  // copyButton.show();
  return copyButton;
}
