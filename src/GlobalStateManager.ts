import * as vscode from "vscode";

const KEY = 'token';

export class UserManager {
  static globalState: vscode.Memento;

  static setUserObject(userObject: Object) {
    return this.globalState.update(KEY, userObject);
  }

  static getUserObject(): Object | undefined {
    return this.globalState.get(KEY);
  }
}
