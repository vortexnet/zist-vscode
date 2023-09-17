import * as vscode from 'vscode';
import { authorize } from './oAuth/authorize';
import { ShowZistProvider } from './providers/ShowZistProvider';
import { CreateZistProvider } from './providers/CreateZistProvider';
import { AboutZistProvider } from './providers/AboutZistProvider';
import { UserManager } from './GlobalStateManager';
import { activeTextEditorReference } from './providers/QuickPickProvider';
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

  context.subscriptions.push(vscode.window.registerWebviewViewProvider(ShowZistProvider.viewType, showProvider));

  context.subscriptions.push(vscode.window.registerWebviewViewProvider(CreateZistProvider.viewType, createProvider));

  context.subscriptions.push(vscode.window.registerWebviewViewProvider(AboutZistProvider.viewType, aboutProvider));

  context.subscriptions.push(initializeStatusBarAndSelectionHandler());

  context.subscriptions.push(
    vscode.commands.registerCommand('zist-vscode.expolorer-quickpick-input', async () => {
      activeTextEditorReference(sharedPayload);
    }),
  );

  context.subscriptions.push(vscode.commands.registerCommand('zist-vscode.authenticate', authorize));

}

export function deactivate() { }
