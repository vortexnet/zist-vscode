<script lang="ts">
  import { onMount } from 'svelte';
  import type { Gist } from '../types';
    let isLoading = true;

    export let data: Gist[] = [];
  
    async function fetchData() {
      try {
        const response = await fetch('https://api.github.com/users/MillanSharma/gists');
        const jsonData = await response.json();
        data = jsonData;
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
      <p>Loading...</p>
    {:else}
      <ul>
        {#each data as item (item.id)}
          <li>{item.description}</li>
        {/each}
      </ul>
    {/if}
  </div>
  