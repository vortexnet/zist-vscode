import * as vscode from 'vscode';
import { UserManager, UserObject } from '../GlobalStateManager';
import { apiBaseUrl, constKeys, constType } from '../common/constants';
import { getNonce } from '../common/getNonce';
import { authorize } from '../oAuth/authorize';

export class ShowZistProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'zist-vscode.sidebar-accordian-list';
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async data => {
      switch (data.type) {
        case constKeys.onAuthenticate: {
          const user = UserManager.getUserObject() as UserObject;
          console.log('user', user);
          if (!user.accessToken) {
            vscode.commands.executeCommand('zist-vscode.authenticate').then(() => {
              webviewView.webview.postMessage({
                type: constKeys.authenticated,
                value: UserManager.getUserObject(),
              });
            });
          }
          webviewView.webview.postMessage({
            type: constType.token,
            value: UserManager.getUserObject(),
          });
          break;
        }

        case constKeys.getUser: {
          webviewView.webview.postMessage({
            type: constType.userName,
            value: UserManager.getUserObject(),
          });
        }

        case constKeys.onInfo: {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }

        case constKeys.onError: {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }

        case constKeys.openURL: {
          if (!data.value) {
            return;
          }
          vscode.env.openExternal(vscode.Uri.parse(data.value));
          break;
        }
        case constKeys.unAuthenticate: {
          UserManager.setUserObject({});
          webviewView.webview.postMessage({
            type: constKeys.unAuthenticate,
            value: UserManager.getUserObject(),
          });
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
    const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));

    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'out', 'compiled/ShowZist.js'));
    const highlightJSStyles = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'out', 'compiled/bundle.css'));

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
      <link rel="stylesheet" href="https://unpkg.com/mono-icons@1.0.5/iconfont/icons.css" >
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${
          webview.cspSource
        }; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${highlightJSStyles}" rel="stylesheet">
        <script nonce="${nonce}" >
        const vscodeChannel = acquireVsCodeApi()
        const apiBaseUrl = ${JSON.stringify(apiBaseUrl)}
        </script> 
			</head>
      <body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}
