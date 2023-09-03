import * as _vscode from "vscode";

declare global {
  const vscodeChannel: {
    postMessage: ({ type: string, value: any }) => void;
    getState: () => any;
    setState: (state: any) => void;
  };
  const apiBaseUrl: string;
}