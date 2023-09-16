/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { gistsEndPoint } from '../common/constants';
import { UserManager } from '../GlobalStateManager';

interface FileVisibility {
  label: string;
  description: string;
}

type ConstructPayloadTypes = {
  fileName: string;
  description: string;
  isPublic: boolean;
  language: string;
  content: string;
};

type ConstructPayloadReturnType = {
  description: string;
  public: boolean;
  files: {
    [filename: string]: {
      content: string;
      language: string;
    };
  };
};

type ConstructedInputType = {
  fileName: string;
  language: string;
  content: string;
};

type UserObject = {
  accessToken: string;
  name: string;
  scopes: [string];
};

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

export function getHeader(): AxiosRequestConfig | undefined {
  const userObject = UserManager.getUserObject() as UserObject;
  if (!userObject) {
    return undefined;
  }
  const token = userObject.accessToken;
  const header: AxiosRequestConfig = {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  };

  return header;
}

export function constructPayload(params: ConstructPayloadTypes): ConstructPayloadReturnType {
  const { fileName, description, content, isPublic, language } = params;

  const payload = {
    description: description,
    public: isPublic,
    files: {
      [fileName]: {
        content: content,
        language: language,
      },
    },
  };
  return payload;
}

export async function saveSnippet(params: ConstructPayloadTypes): Promise<string> {
  const payload = constructPayload(params);
  const header = getHeader();
  if (!header) {
    throw new Error('Missing authorization header');
  }

  try {
    const response: AxiosResponse = await axios.post('https://api.github.com/gists', payload, {
      headers: header.headers,
    });

    if (response.status === 200) {
      // Handle the API response data as needed
      // For example, you can access response.data to get the data returned by the API
      return 'API call successful';
    } else {
      return 'API call failed';
    }
  } catch (error) {
    if (error instanceof Error) {
      return `API call error: ${error.message}`;
    } else {
      return 'An unknown error occurred';
    }
  }
}

export async function activeTextEditorReference(sharedPayload: SharedPayloadType) {
  const { activeTextEditor } = vscode.window;
  const file = activeTextEditor ? activeTextEditor.document.fileName : 'random.ts';
  const language = activeTextEditor ? activeTextEditor.document.languageId : 'text';

  const lastIndex = file.lastIndexOf('\\');
  const fileName = lastIndex !== -1 ? file.substring(lastIndex + 1) : file;

  if (!activeTextEditor) {
    vscode.window.showInformationMessage('No active text editor');
  }

  const text = activeTextEditor?.document.getText(activeTextEditor.selection);
  sharedPayload.fileName = fileName;
  sharedPayload.language = language;
  sharedPayload.content = text || '';

  await showFileInputForm(sharedPayload);
}

export async function showFileInputForm(
  params: SharedPayloadType,
): Promise<{ finalFileName: string; isPrivate: boolean; description: string | undefined } | undefined> {
  const { fileName, content, language } = params;

  const defaultFileName = fileName || '';

  const description = await vscode.window.showInputBox({
    prompt: 'Enter a description',
    placeHolder: 'e.g., this snippet is about ...',
    value: '',
  });

  const userInputFileName = await vscode.window.showInputBox({
    prompt: 'Enter a file name',
    placeHolder: 'e.g., my-file.txt',
    value: defaultFileName,
    validateInput: value => {
      if (!value) {
        return 'File name is required';
      }
      return '';
    },
  });

  const visibilityOptions: FileVisibility[] = [
    { label: '🔒 Private', description: 'This file will be private' },
    { label: '🌐 Public', description: 'This file will be public (default)' },
  ];

  const selectedVisibility = await vscode.window.showQuickPick(visibilityOptions, {
    placeHolder: 'Select the file visibility',
  });

  if (selectedVisibility === undefined) {
    return undefined;
  }

  const isPublic = !selectedVisibility.label.includes('🔒 Private');
  const finalFileName = userInputFileName || fileName;

  const loadingPromise = vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Saving your snippet...',
      cancellable: false,
    },
    async progress => {
      const apiResponse = await saveSnippet({ fileName: finalFileName, isPublic, description, language, content } as ConstructPayloadTypes);
      vscode.window.showInformationMessage(apiResponse);
    },
  );

  await loadingPromise;

  return { description, finalFileName, isPrivate: !isPublic };
}
