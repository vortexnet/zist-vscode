import * as vscode from 'vscode';
import { authorize } from './oAuth/authorize';
import { ShowZistProvider } from './providers/ShowZistProvider';
import { CreateZistProvider } from './providers/CreateZistProvider';
import { FullscreenProvider } from './providers/FullscreenProvider';
import { AboutZistProvider } from './providers/AboutZistProvider';

export function activate(context: vscode.ExtensionContext) {
  // register providers
  const showProvider = new ShowZistProvider(context.extensionUri);
  const createProvider = new CreateZistProvider(context.extensionUri);
  const aboutProvider = new AboutZistProvider(context.extensionUri)
  // register status bar item [botton at the bottom]
  const copyButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
  copyButton.text = 'Create Zist';
  copyButton.command = 'zist-vscode.statusbar-create';
  copyButton.show();

  context.subscriptions.push(vscode.window.registerWebviewViewProvider(ShowZistProvider.viewType, showProvider));

  context.subscriptions.push(vscode.window.registerWebviewViewProvider(CreateZistProvider.viewType, createProvider));

  context.subscriptions.push(vscode.window.registerWebviewViewProvider(AboutZistProvider.viewType, aboutProvider));


  context.subscriptions.push(vscode.commands.registerCommand('zist-vscode.fullscreen', () => {
		FullscreenProvider.createOrShow(context.extensionUri);
	}));

  //demo
  const disposable = vscode.commands.registerCommand('zist-vscode.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World!');
  });

  // authentication with github
  context.subscriptions.push(vscode.commands.registerCommand('zist-vscode.authenticate', authorize));

  context.subscriptions.push(disposable);
}

export function deactivate() {}
