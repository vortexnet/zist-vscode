import { GITHUB_AUTH_PROVIDER_ID, SCOPES } from '../common/constants';
import * as vscode from 'vscode';

import { UserManager } from '../GlobalStateManager';
export async function authorize() {
  const session = await vscode.authentication.getSession(GITHUB_AUTH_PROVIDER_ID, SCOPES, { createIfNone: true });
  if (session) {
    UserManager.setUserObject({
      accessToken: session.accessToken,
      name: session.account.label,
      scopes: session.scopes,
    });
  } else {
    const callbackMessage = await vscode.window.showErrorMessage('Failed to authenticate with github, Please try again', 'Retry');
    if (callbackMessage === 'Retry') {
      vscode.commands.executeCommand('zest-b.getGitHubUser');
    } else {
      return null;
    }
  }
}
