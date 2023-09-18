<script lang="ts">
  import { onMount } from 'svelte';
  import { constKeys } from '../../webviews/components/common/constants';

  export let isAuthenticated: boolean;
  export let updateAuthenticationStatus: (status: boolean) => void;

  let userObject = {};

  onMount(() => {
    window.addEventListener('message', async event => {
      const message = event.data;
      switch (message.type) {
        case constKeys.authenticated:
          userObject = message.value;
          if (!userObject) {
            isAuthenticated = false;
            return;
          } else {
            isAuthenticated = true;
            updateAuthenticationStatus(true);
          }
          break;
        case constKeys.unAuthenticate:
          isAuthenticated = false;
      }
    });
  });

  async function authenticateWithGitHub() {
    vscodeChannel.postMessage({ type: constKeys.onAuthenticate, value: undefined });
  }
  // async function unAuthenticateWithGitHub() {
  //   vscodeChannel.postMessage({ type: constKeys.unAuthenticate, value: undefined });
  // }
</script>

<main class="unauthenticated">
  <h1 class="unauthenticated_header">Opps...</h1>
  <b>Looks like you are not authenticated</b>
  <p>Zist requires you to authenticate your VS Code with Github to access and create snippets</p>
  <button on:click={() => authenticateWithGitHub()}>Authenticate with GitHub</button>
  <!-- <button on:click={() => unAuthenticateWithGitHub()}> UnAuthenticate with GitHub</button> -->
  <h6>*When you authenticate with GitHub you are authenticating VS Code not Zist itself.</h6>
  <h5>Note: If you are having trouble authenticating, please try `Ctrl + Shift + P` and look for 'Zist Authenticate' command</h5>
</main>
