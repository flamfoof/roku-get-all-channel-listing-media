/**
 * Roku Channel Listing Fetcher
 * Fetches channel information from Roku's channel store API
 */

import fs from 'fs/promises';

// Constants
const API_BASE_URL = 'https://channelstore.roku.com/api/v7/channels';
const MAX_PAGES = 50;
const PAGE_SIZE = 100;
const ROKU_CATEGORY_IDS = [  // Original category
    {"id":'B9C56C2F-B01D-4226-A012-DAFA5DCEB050', "pageSize":24},
    {"id":'22CDB2ED-AF5E-4C7A-8CCF-6E18CCE49DF2', "pageSize":PAGE_SIZE},
    {"id":'FB0C4BF5-EDD6-440D-B47E-1EDF0FD7E136', "pageSize":PAGE_SIZE}   // New category
];

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
 * @param {string} categoryId - Category ID to fetch channels for
 * @returns {string} Complete API URL
 */
const buildApiUrl = (lastChId, categoryId, pageSizes) => {
    const params = new URLSearchParams({
        category: categoryId,
        pagesize: pageSizes,
        lastChId,
        categoryType: 'tag',
        country: 'US',
        language: 'en'
    });
    console.log(`API URL: ${API_BASE_URL}?${params}`);
    return `${API_BASE_URL}?${params}`;
};

/**
 * Fetches channel data recursively for a specific category
 * @param {string} categoryId - Category ID to fetch channels for
 * @param {string} lastChId - ID of the last channel from previous fetch
 * @param {Array} accumulator - Accumulated channel data
 * @param {number} pageCount - Current page count
 * @returns {Promise<Array>} Collected channel data
 */
async function fetchChannelData(categoryId, lastChId = '0', accumulator = [], pageCount = 1) {
    if (pageCount > MAX_PAGES) {
        console.log(`Reached maximum page count (${MAX_PAGES})`);
        return accumulator;
    }

    try {
        const response = await fetch(buildApiUrl(lastChId, categoryId.id, categoryId.pageSize), { headers });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Fetched page ${pageCount} for category ${categoryId.id}`);

        if (!data.length) {
            return accumulator;
        }

        const newAccumulator = [...accumulator, ...data];
        const lastChannel = data[data.length - 1];
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        
        return fetchChannelData(categoryId, lastChannel.id, newAccumulator, pageCount + 1);
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
        let allChannels = [];

        // Fetch channels for each category
        for (const categoryId of ROKU_CATEGORY_IDS) {
            console.log(`\nFetching channels for category: ${categoryId.id}`);
            const categoryChannels = await fetchChannelData(categoryId);
            allChannels = [...allChannels, ...categoryChannels];
        }

        // Remove duplicates based on channel ID
        const uniqueChannels = Array.from(
            new Map(allChannels.map(channel => [channel.id, channel])).values()
        );

        for(let i = 0; i < uniqueChannels.length; i++) {
            uniqueChannels[i].name = uniqueChannels[i].name.trim()
              .replace(/ - .*/g, '')
              .replace(/ \| .*/g, '');

        }

        console.log(`\nTotal unique channels found: ${uniqueChannels.length}`);
        
        // Write to data_backup.json
        await fs.writeFile(
            './data.json',
            JSON.stringify(uniqueChannels, null, 2)
        );
        console.log('Data written to data_backup.json');

    } catch (error) {
        console.error('Error in main execution:', error);
    }
}

// Execute the script
main();
