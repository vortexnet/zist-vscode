/* eslint-disable @typescript-eslint/naming-convention */
import type { AxiosRequestConfig } from 'axios';
import type
{
  DebounceScrollFunction,
  Files,
  Gist,
  GistFileType,
  ThemeValue,
  UserObject,
} from '../../types';



export function getFilesAsArray(files: Files[]) {
  const outputArray: GistFileType[] = [];

  files.forEach(item => {
    // Check if an object contains multiple key-value pairs
    const keys = Object.keys(item);
    if (keys.length === 1) {
      // If only one key-value pair, add it to the output as is
      outputArray.push(item[keys[0]]);
    } else {
      // If multiple key-value pairs, flatten and add them individually
      keys.forEach(key => {
        outputArray.push(item[key]);
      });
    }
  });
  return outputArray;
}

export function getFiles(parentObjectArray: Gist[]): GistFileType[] {
  const files = [];

  // Iterate through the parent object array and extract the 'files' objects
  for (const parentObject of parentObjectArray) {
    const filesObject = parentObject.files;
    files.push(filesObject);
  }
  return getFilesAsArray(files);
}

export function truncateString(str: string, maxLen: number): { truncatedString: string; isTruncated: boolean } {
  const lines = str.split(/\r\n|\r|\n/);
  const numberOfLines = lines.length;
  const truncatedLines = numberOfLines > maxLen ? lines.slice(0, maxLen) : lines;

  let truncatedText = truncatedLines.join('\n');

  if (numberOfLines > maxLen) {
    truncatedText += '...';
  }
  return { truncatedString: truncatedText, isTruncated: numberOfLines > maxLen };
}

export function debounce(func: DebounceScrollFunction, wait: number) {
  let timeout: number | undefined;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}

export function getHeader(userObject: UserObject): AxiosRequestConfig | undefined {
  if (!userObject) {
    return undefined;
  }
  const token = userObject.accessToken;
  const header: AxiosRequestConfig = {
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28'
    }
  };

  return header;
}

export function getFallbackThemeName(value: number): ThemeValue {
  //because more number of user use darktheme in vs code
  //https://css-tricks.com/poll-results-light-on-dark-is-preferred/
  if (!value) { return 'atom-one-dark'; }

  if (value === 2) {
    return 'atom-one-dark';
  }
  return 'atom-one-light';
}