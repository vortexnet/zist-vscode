import { DebounceScrollFunction, Files, Gist, GistFileType } from '../../types';
export function getFilesAsArray(files: Files[]) {
  const outputArray: GistFileType[]  = [];

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
  console.log('OUT PUT ARRAY', outputArray);
  return outputArray;
}

export function getFiles(parentObjectArray: Gist[]): GistFileType[] {
  const files = [];
  console.log('PARENT OBJECT', parentObjectArray);

  // Iterate through the parent object array and extract the 'files' objects
  for (const parentObject of parentObjectArray) {
    const filesObject = parentObject.files;
    files.push(filesObject);
  }
  console.log('FILES', files);
  return getFilesAsArray(files);
}

export function truncateString(str: string, maxLen: number):{ truncatedString: string; isTruncated: boolean }  {
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
  let timeout: NodeJS.Timeout | undefined;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}
