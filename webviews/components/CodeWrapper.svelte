<!-- ScrollFetch.svelte -->
<script>
  import { onMount } from 'svelte';

  // Track whether the API has been called
  export let data;
  let apiCalled = false;

  let fetchedData = new Array(urls.length).fill(null);
  let isLoading = new Array(urls.length).fill(false);

  let startIndex = 0; // Index of the first URL to fetch
  let batchSize = 6; // Number of URLs to fetch initially
  // Function to fetch data from the API
  async function fetchData(index) {
    try {
      isLoading[index] = true;
      const response = await fetch(data[index].raw_url);
      fetchedData[index] = await response.json();
    } catch (error) {
      console.error(`Error fetching data for index ${index}:`, error);
    } finally {
      isLoading[index] = false;
    }
  }

  // Function to handle the scroll event
  function handleScroll() {
    // Adjust this value to trigger the API call at the desired scroll position
    const triggerScrollPosition = 500;

    // Check if the API has not been called and the scroll position is past the trigger point
    if (!apiCalled && window.scrollY >= triggerScrollPosition) {
      fetchData();
    }
  }

  // Attach the scroll event listener when the component is mounted
  onMount(() => {
    onMount(() => {
      for (let i = startIndex; i < startIndex + batchSize; i++) {
        if (i < urls.length) {
          i;
        }
      }
    });

    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component is destroyed
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<!-- Your component's content -->
<div>
  <p>Scroll down to trigger the API call.</p>
</div>
