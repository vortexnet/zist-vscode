<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { writable } from 'svelte/store';

  import PreviewComponent from './PreviewComponent.svelte';
  import type { GistFileType, UserObject } from '../types';
  import { debounce, getFiles, getHeader } from './utils/editor_utils';
  import Skeleton from './Skeleton.svelte';
  import { constKeys, constType } from './common/constants';
  import type { AxiosRequestConfig, AxiosResponse } from 'axios';
  import axios from 'axios';
  import UnAuthenticated from './UnAuthenticated.svelte';

  let userObject: UserObject | null = null;
  let gists = writable<GistFileType[]>([]);
  let isAuthenticated: boolean = true;
  let limitReached = false;
  let isLoading = false;
  let page = 1;

  async function fetchData() {
    const headers: AxiosRequestConfig | undefined = getHeader(userObject!);

    if (!userObject || isLoading || limitReached || !isAuthenticated) return;

    try {
      isLoading = true;
      const response: AxiosResponse = await axios.get(`https://api.github.com/gists?page=${page}&per_page=10`, {
        method: 'GET',
        headers: headers?.headers,
      });
      if (response.status === 200) {
        const jsonData = await response.data;
        const sanitizedGists = getFiles(jsonData);

        if (jsonData.length === 0) {
          limitReached = true;
        }

        gists.update(existingGists => [...existingGists, ...sanitizedGists]);
        page++;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      isLoading = false;
    }
  }

  onMount(async () => {
    window.addEventListener('message', async event => {
      const message = event.data;
      switch (message.type) {
        case constType.userName:
          userObject = message.value;
          if (!userObject?.accessToken) {
            isAuthenticated = false;
            return;
          }
          await fetchData();
          break;
      }
    }),
      vscodeChannel.postMessage({ type: constKeys.getUser, value: undefined });
  });

  const debounceScroll = debounce(() => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      fetchData();
    }
  }, 500);

  afterUpdate(() => {
    fetchData;
    window.addEventListener('scroll', debounceScroll);
  });

  function updateAuthenticationStatus(status: boolean) {
    isAuthenticated = status;
    fetchData();
  }
</script>

<div>
  {#if isLoading}
    {#each [0, 1, 2, 3, 4, 5, 6] as item (item)}
      <div class="code-box">
        <Skeleton />
      </div>
    {/each}
  {:else if !isAuthenticated && !isLoading}
    <div>
      <UnAuthenticated {isAuthenticated} {updateAuthenticationStatus} />
    </div>
  {:else}
    <ul>
      {#each $gists as item (item)}
        <PreviewComponent {item} />
      {/each}
    </ul>
  {/if}
  <div class="ratelimit-hit" />
</div>
