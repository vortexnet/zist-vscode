<script lang="ts">
  export let code: string;
  export let copyToClipboard: () => void;
  export let copied: boolean;
  export let openInBrowser: () => void;
  export let isTruncated: boolean;
  export let showExtendUp: boolean;
  export let handleExtendClick: () => void;
  export let filename: string;
  export let handleCompressClick: () => void;

  import atomOneDark from 'svelte-highlight/styles/atom-one-dark';
  import { HighlightAuto } from 'svelte-highlight';
</script>

<svelte:head>
  {@html atomOneDark}
</svelte:head>

<div class="code-container">
  <HighlightAuto {code} class="pre-code" />
</div>
<div class="icons-container">
  <div class="file-name">{filename}</div>
  <div class="actionable-icons">
    {#if !copied}<i on:click={copyToClipboard} on:keypress={copyToClipboard} class="mi-copy" />
    {:else}
      <i class="mi-check" />
    {/if}
    <i on:click={openInBrowser} on:keypress={openInBrowser} class="mi-external-link" />
  </div>
</div>

{#if isTruncated}
  <div class="code-box-extend">
    {#if !showExtendUp}
      <i on:click={handleExtendClick} on:keypress={handleExtendClick} class="mi-chevron-down" />
    {:else}
      <i on:click={handleCompressClick} on:keypress={handleCompressClick} class="mi-chevron-up" />
    {/if}
  </div>
{/if}
