/**
 * Channel Comparison Script
 * Compares channels from API response with staging data
 */

import fs from 'fs/promises';

async function loadJsonFile(filepath) {
    try {
        const data = await fs.readFile(filepath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filepath}:`, error);
        throw error;
    }
}

function normalizeChannelName(name) {
    return name.replace(/\+/g, ' Plus')
        // .replace(/\&/g, 'and')
        .replace(/\_/, ' ')
        .toLowerCase()
        .trim();
}

async function compareChannels() {
    try {
        // Load both data sources
        const stagingData = await loadJsonFile('./staging_data.json');
        const apiResponse = await loadJsonFile('./data.json');
        let apiResponseMod = [];
        let mergedDataFinal = [];

        // Normalize staging data channel names
        const stagingChannels = new Set(
            stagingData.map(name => normalizeChannelName(name))
        );

        // Process API response channels
        const apiChannels = new Set();
        const apiChannelDetails = new Map();
        
        for(let i = 0; i < apiResponse.length; i++) {
            let data = Object.assign({}, apiResponse[i]);
            data.name = normalizeChannelName(apiResponse[i].name);
            apiResponseMod.push(data);
        }
        
        for (let i = 0; i < apiResponseMod.length; i++) {
            const channel = apiResponseMod[i];
            if(stagingChannels.has(channel.name)) {
                 mergedDataFinal.push(apiResponse[i]);
            }
        }

        // Write to merged.json
        await fs.writeFile(
            './merged.json',
            JSON.stringify(mergedDataFinal, null, 2),
            'utf8'
        );

        // Print results
        console.log('\nComparison Summary:');
        console.log(`Staging Data Channels: ${stagingChannels.size}`);
        console.log(`Merged Data Channels: ${mergedDataFinal.length}`);
        console.log('\nResults have been written to merged.json');

    } catch (error) {
        console.error('Error during comparison:', error);
    }
}

// Execute the comparison
compareChannels();
