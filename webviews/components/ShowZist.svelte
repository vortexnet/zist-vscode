<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { writable } from 'svelte/store';

  import PreviewComponent from './PreviewComponent.svelte';
  import { Gist } from '../types';
  import { debounce, getFiles } from '../../src/utils/editor_utils';
  import Skeleton from './Skeleton.svelte';

  let isLoading = false;
  let page = 1;

  let gists = writable<Gist[]>([]);

  async function fetchData() {
    if (isLoading) return; // Don't fetch data if already loading
    isLoading = true;
    try {
      const response = await fetch(`https://api.github.com/users/benawad/gists?page=${page}&per_page=10`);
      if (response.status === 200) {
        const jsonData = await response.json();
        const sanitizedGists = getFiles(jsonData);
        gists.update(existingGists => [...existingGists, ...sanitizedGists]);
        console.log('value', $gists);
        page++;
      }
      console.log('PAGE', page);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      isLoading = false;
    }
  }
  onMount(fetchData);

  const debounceScroll = debounce(() => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      fetchData();
    }
  }, 500);

  afterUpdate(() => {
    window.addEventListener('scroll', debounceScroll);
  });
</script>

<div>
  {#if isLoading}
    {#each [0, 1, 2, 3, 4, 5, 6] as item (item)}
      <div class="code-box">
        <Skeleton />
      </div>
    {/each}
  {:else}
    <ul>
      {#each $gists as item (item)}
        <PreviewComponent {item} />
      {/each}
    </ul>
  {/if}
</div>
