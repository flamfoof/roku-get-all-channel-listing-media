import fs from 'fs/promises';
import { fetch } from 'bun';

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

async function fetchChannelDetails(channelId) {
    const url = `https://channelstore.roku.com/api/v6/channels/detailsunion/${channelId}?country=US&language=en`;
    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching details for channel ${channelId}:`, error.message);
        return null;
    }
}

async function main() {
    try {
        // Read merged.json
        const mergedData = JSON.parse(await fs.readFile('merged.json', 'utf-8'));
        const results = [];
        
        // Process channels with a delay to avoid rate limiting
        for (const channel of mergedData) {
            console.log(`Fetching details for channel: ${channel.name} (${channel.id})`);
            const details = await fetchChannelDetails(channel.id);
            if (details) {
                results.push(details);
            }
            // Add a small delay between requests
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Save results
        await fs.writeFile('channel_details.json', JSON.stringify(results, null, 2));
        console.log(`Successfully fetched details for ${results.length} channels`);
        console.log('Results saved to channel_details.json');

    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();