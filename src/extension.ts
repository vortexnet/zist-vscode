import * as vscode from 'vscode';
import { authorize } from './oAuth/authorize';
import { AccordianProvider } from './providers/accordialProvider';
import { SidebarProvider } from './providers/sidebarProvider';

export function activate(context: vscode.ExtensionContext) {

  // register providers
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  const accordianProvider = new AccordianProvider(context.extensionUri);

  // register status bar item [botton at the bottom]
  const copyButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
  copyButton.text = 'Create Zist';
  copyButton.command = 'zist-vscode.statusbar-create';
  copyButton.show();


  context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(SidebarProvider.viewType, sidebarProvider)
	  );

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(AccordianProvider.viewType, accordianProvider)
	);
  

  //demo 
  const disposable = vscode.commands.registerCommand('zist-vscode.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World!');
  });

  // authentication with github
  context.subscriptions.push(vscode.commands.registerCommand(
    'zist-vscode.authenticate', authorize));

  context.subscriptions.push(disposable);
}

export function deactivate() {}
