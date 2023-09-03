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
  if (str.length > maxLen) {
    return { string: str, truncatedString: str.slice(0, maxLen) + '...', isTruncated: true };
  } else {
    return { string: str, truncatedString: str, isTruncated: false };
  }
}
