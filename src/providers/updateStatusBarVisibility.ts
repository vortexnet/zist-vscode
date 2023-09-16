// status-bar.ts

import * as vscode from 'vscode';

let copyButton: vscode.StatusBarItem | undefined;

export function initializeStatusBarAndSelectionHandler() {
  // Create the status bar item
  console.log('WASSUP');
  copyButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
  copyButton.text = 'Create Zist';
  copyButton.command = 'zist-vscode.quickpick-input';
  copyButton.show();

  // Register a listener for selection changes
  // vscode.window.onDidChangeTextEditorSelection(() => {
  //     const { activeTextEditor } = vscode.window;
  //     console.log('active text editor', activeTextEditor);
  //     if (activeTextEditor && !activeTextEditor.selection.isEmpty) {
  //         // Show the status bar button when there's a selection
  //         copyButton!.show();
  //     } else {
  //         // Hide the status bar button when there's no selection
  //         copyButton!.hide();
  //     }
  // });

  // // Initially hide the status bar button
  // copyButton.show();

  // Add the status bar item to the context subscriptions
  return copyButton;
}
