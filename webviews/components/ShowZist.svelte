<script lang="ts">
  import { onMount } from 'svelte';
  import PreviewComponent from './PreviewComponent.svelte';
  import { Gist } from '../types';
  import { getFiles } from '../../src/utils/editor_utils';
  import Skeleton from './Skeleton.svelte';

  let isLoading = true;

  export let data: Gist[] = [];

  async function fetchData() {
    try {
      const response = await fetch('https://api.github.com/users/benawad/gists');
      const jsonData = await response.json();
      data = getFiles(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      isLoading = false;
    }
  }
  onMount(fetchData);
  fetchData();
</script>

<div>
  {#if isLoading}
    {#each [0, 1, 2, 3, 4, 5, 6] as item (item)}
      <Skeleton />
    {/each}
  {:else}
    <ul>
      {#each data as item (item)}
        <PreviewComponent {item} />
      {/each}
    </ul>
  {/if}
</div>
