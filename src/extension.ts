import * as vscode from 'vscode';
import { authorize } from './oAuth/authorize';
import { ShowZistProvider } from './providers/ShowZistProvider';
import { CreateZistProvider } from './providers/CreateZistProvider';
import { AboutZistProvider } from './providers/AboutZistProvider';
import { UserManager } from './GlobalStateManager';
import { activeTextEditorReference, showFileInputForm } from './providers/QuickPickProvider';
import { initializeStatusBarAndSelectionHandler } from './providers/updateStatusBarVisibility';

type SharedPayloadType = {
  fileName: string;
  content: string;
  language: string;
  description: string;
  isPublic: boolean;
};

const sharedPayload: SharedPayloadType = {
  fileName: '',
  content: '',
  language: 'text',
  isPublic: true,
  description: '',
};

export function activate(context: vscode.ExtensionContext) {
  // create global context
  UserManager.globalState = context.globalState;

  // register providers
  const showProvider = new ShowZistProvider(context.extensionUri);
  const createProvider = new CreateZistProvider(context.extensionUri);
  const aboutProvider = new AboutZistProvider(context.extensionUri);

  //theme config
  const config = vscode.workspace.getConfiguration('workbench');
  const themeName = config.get('colorTheme');
  console.log('THEME', themeName);

  context.subscriptions.push(vscode.window.registerWebviewViewProvider(ShowZistProvider.viewType, showProvider));

  context.subscriptions.push(vscode.window.registerWebviewViewProvider(CreateZistProvider.viewType, createProvider));

  context.subscriptions.push(vscode.window.registerWebviewViewProvider(AboutZistProvider.viewType, aboutProvider));

  context.subscriptions.push(initializeStatusBarAndSelectionHandler());

  context.subscriptions.push(vscode.commands.registerCommand('zist-vscode.quickpick-input', async () => { activeTextEditorReference(sharedPayload); }));

  const disposable = vscode.commands.registerCommand('zist-vscode.helloWorld', () => {
    vscode.window.showInformationMessage(`Hello World!,`,);
  });

  // authentication with github
  context.subscriptions.push(vscode.commands.registerCommand('zist-vscode.authenticate', authorize));

  context.subscriptions.push(disposable);
}

export function deactivate() { }
