/**
 * Roku Channel Listing Fetcher
 * Fetches channel information from Roku's channel store API
 */

import fs from 'fs/promises';

// Constants
const API_BASE_URL = 'https://channelstore.roku.com/api/v7/channels';
const MAX_PAGES = 50;
const PAGE_SIZE = 100;
const ROKU_CATEGORY_ID = '22CDB2ED-AF5E-4C7A-8CCF-6E18CCE49DF2';

// API Headers
const headers = {
  'Accept': 'application/json',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Referer': 'https://channelstore.roku.com/browse/recommended',
  'Connection': 'keep-alive',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'no-cors',
  'Sec-Fetch-Site': 'same-origin',
  'Priority': 'u=4',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
};

/**
 * Constructs the API URL with query parameters
 * @param {string} lastChId - ID of the last channel from previous fetch
 * @returns {string} Complete API URL
 */
const buildApiUrl = (lastChId) => {
  const params = new URLSearchParams({
    category: ROKU_CATEGORY_ID,
    pagesize: PAGE_SIZE,
    lastChId,
    categoryType: 'tag',
    country: 'US',
    language: 'en'
  });
  return `${API_BASE_URL}?${params}`;
};

/**
 * Fetches channel data recursively
 * @param {string} lastChId - ID of the last channel from previous fetch
 * @param {Array} accumulator - Accumulated channel data
 * @param {number} pageCount - Current page count
 * @returns {Promise<Array>} Collected channel data
 */
async function fetchChannelData(lastChId = '0', accumulator = [], pageCount = 0) {
  try {
    if (pageCount >= MAX_PAGES) {
      console.log(`Reached maximum page limit of ${MAX_PAGES}`);
      return accumulator;
    }

    const response = await fetch(buildApiUrl(lastChId), { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.length) {
      console.log('No more data to fetch');
      return accumulator;
    }

    const newAccumulator = [...accumulator, ...data];
    console.log(`Fetched page ${pageCount + 1}, total channels: ${newAccumulator.length}`);

    // Recursive call for next page
    return fetchChannelData(
      data[data.length - 1].id,
      newAccumulator,
      pageCount + 1
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return accumulator;
  }
}

/**
 * Main execution function
 */
async function main() {
  try {
    console.log('Starting Roku channel data collection...');
    const channelData = await fetchChannelData();
    
    await fs.writeFile(
      'data.json',
      JSON.stringify(channelData, null, 2)
    );
    
    console.log(`Successfully saved ${channelData.length} channels to data.json`);
  } catch (error) {
    console.error('Failed to complete operation:', error);
    process.exit(1);
  }
}

// Execute the script
main();
