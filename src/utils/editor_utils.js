export function getFilesAsArray(files) {
  const outputArray = [];

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

export function getFiles(parentObjectArray) {
  const files = [];

  // Iterate through the parent object array and extract the 'files' objects
  for (const parentObject of parentObjectArray) {
    const filesObject = parentObject.files;
    files.push(filesObject);
  }
  return getFilesAsArray(files);
}

export function truncateString(str, maxLen) {
  const lines = str.split(/\r\n|\r|\n/);
  const numberOfLines = lines.length;
  const truncatedLines = numberOfLines > 7 ? lines.slice(0, 7) : lines;

  let truncatedText = truncatedLines.join('\n');

  if (numberOfLines > 7) {
    truncatedText += '...';
  }
  return { truncatedString: truncatedText, isTruncated: numberOfLines > 7 };
}

export function debounce(func, wait) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}
