import * as vscode from 'vscode';
import { authorize } from './oAuth/authorize';
import { ShowZistProvider } from './providers/ShowZistProvider';
import { CreateZistProvider } from './providers/CreateZistProvider';
import { FullscreenProvider } from './providers/FullscreenProvider';
import { AboutZistProvider } from './providers/AboutZistProvider';
import { UserManager } from './GlobalStateManager';

export function activate(context: vscode.ExtensionContext) {
  // create global context
  UserManager.globalState = context.globalState;

  // register providers
  const showProvider = new ShowZistProvider(context.extensionUri);
  const createProvider = new CreateZistProvider(context.extensionUri);
  const aboutProvider = new AboutZistProvider(context.extensionUri);

  // register status bar item [botton at the bottom]
  const copyButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
  copyButton.text = 'Create Zist';
  copyButton.command = 'zist-vscode.statusbar-create';
  copyButton.show();

  //theme config
  const config = vscode.workspace.getConfiguration('workbench');
  const themeName = config.get('colorTheme');
  console.log('THEME', themeName);

  context.subscriptions.push(vscode.window.registerWebviewViewProvider(ShowZistProvider.viewType, showProvider));

  context.subscriptions.push(vscode.window.registerWebviewViewProvider(CreateZistProvider.viewType, createProvider));

  context.subscriptions.push(vscode.window.registerWebviewViewProvider(AboutZistProvider.viewType, aboutProvider));

  context.subscriptions.push(
    vscode.commands.registerCommand('zist-vscode.fullscreen', () => {
      FullscreenProvider.createOrShow(context.extensionUri);
    }),
  );

  //demo
  const disposable = vscode.commands.registerCommand('zist-vscode.helloWorld', () => {
    vscode.window.showInformationMessage(`Hello World!,`);
  });

  // authentication with github
  context.subscriptions.push(vscode.commands.registerCommand('zist-vscode.authenticate', authorize));

  context.subscriptions.push(disposable);
}

export function deactivate() {}
