const express = require('express');
const cors = require('cors');
const { Alchemy, Network } = require('alchemy-sdk');

const app = express();
const PORT = 3003; // or any other available port

// Enable CORS for all origins (or specify your frontend origin)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); // Specific origin
    // OR res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const config = {
    apiKey: "dQfPBdboVvVWs0jErnw3G39kqTa_MC_x", // Replace with your actual Alchemy API key
    network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

app.get('/balances', async (req, res) => {
    const address = req.query.address; // Get the address from the query parameters
    try {
        const balances = await alchemy.core.getTokenBalances(address);
        const nonZeroBalances = balances.tokenBalances.filter(token => token.tokenBalance !== "0");

        // Map the token balances to include metadata
        const tokenData = await Promise.all(nonZeroBalances.map(async (token) => {
            const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
            return {
                name: metadata.name,
                symbol: metadata.symbol,
                tokenBalance: token.tokenBalance,
                decimals: metadata.decimals,
            };
        }));

        res.json({ tokenBalances: tokenData }); // Send the balances as a JSON response
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching balances');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 