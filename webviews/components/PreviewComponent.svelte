<script lang="ts">
  import { onMount } from 'svelte';
  import { GistFileType } from '../types';
  import { truncateString } from '../../src/utils/editor_utils';
  import { constKeys, webAppURL } from '../../src/common/constants';
  import Skeleton from './Skeleton.svelte';
  import type { Gist } from '../../src/types';
  import CodeContainer from './CodeContainer.svelte';

  let isLoading = true;
  export let item: GistFileType;

  let fileData = '';
  let truncatedCode = '';
  let isTruncated = false;
  let showFullcode = false;
  let showExtendUp = false;
  let code = '';
  let copied = false;

  async function fetchSingleGistData() {
    try {
      const response = await fetch(item.raw_url);
      fileData = await response.text();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      const result = truncateString(fileData, 16);
      truncatedCode = result.truncatedString;
      isTruncated = result.isTruncated;
      isLoading = false;
      code = truncatedCode;
    }
  }

  onMount(fetchSingleGistData);
  fetchSingleGistData();

  function handleExtendClick() {
    showFullcode = true;
    code = fileData;
    showExtendUp = true;
  }

  function handleCompressClick() {
    showFullcode = false;
    showExtendUp = false;
    code = truncatedCode;
  }

  function resetState() {
    copied = false;
  }

  function resetAfterTimeout() {
    setTimeout(resetState, 5000); // 5000 milliseconds (5 seconds)
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(fileData);
      copied = true;
    } catch (error) {
      console.error('Unable to copy text: ', error);
    } finally {
      resetAfterTimeout();
    }
  }

  function openInBrowser() {
    const id = item.raw_url.match(/\/([^/]+)\/raw\//)?.[1];
    console.log('ITEM', id);
    const url = `${webAppURL}/gist/${id}`;
    vscodeChannel.postMessage({ type: constKeys.openURL, value: url });
  }
</script>

<div>
  <div class="code-box">
    {#if isLoading}
      <Skeleton />
    {:else}
      <CodeContainer
        {handleCompressClick}
        {showExtendUp}
        {openInBrowser}
        {isTruncated}
        {copyToClipboard}
        filename={item.filename}
        {code}
        {copied}
        {handleExtendClick}
      />
    {/if}
  </div>
</div>
