const options = {method: 'GET', headers: {accept: 'application/json'}};

function fetchTokenPrices(symbols = 'sol,btc') {
    fetch(`https://api.g.alchemy.com/prices/v1/dQfPBdboVvVWs0jErnw3G39kqTa_MC_x/tokens/by-symbol?symbols=${symbols}`, options)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(res => {
            console.log('API Response:', res); // Log the entire response

            const tokenPricesDiv = document.getElementById('token-prices');
            tokenPricesDiv.innerHTML = ''; // Clear previous content

            const tokens = res.data; // This is an array of token objects

            if (Array.isArray(tokens) && tokens.length > 0) {
                for (const token of tokens) {
                    const tokenDiv = document.createElement('div');
                    tokenDiv.className = 'token';
                    tokenDiv.innerHTML = `<span>${token.symbol}</span><span>$${token.prices[0].value}</span>`;
                    tokenPricesDiv.appendChild(tokenDiv);
                }
            } else {
                tokenPricesDiv.innerHTML = '<div class="error">No token data available.</div>';
            }
        })
        .catch(err => console.error('Fetch Error:', err));
}

// Fetch token prices immediately on load
fetchTokenPrices();

// Set interval to fetch token prices every 15 seconds (15000 milliseconds)
setInterval(fetchTokenPrices, 15000);

// Add event listener for the search button
document.getElementById('search-button').addEventListener('click', () => {
    const searchInput = document.getElementById('token-search').value;
    if (searchInput) {
        fetchTokenPrices(searchInput); // Fetch prices for the entered token symbol
    }
});

// Function to fetch wallet balances
async function fetchWalletBalances(address) {
    try {
        const response = await fetch(`http://localhost:3003/balances?address=${address}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json(); // Parse the JSON response
        console.log(data); // Log the entire data object to see its structure

        // Display the wallet balances
        const walletBalancesDiv = document.getElementById('wallet-balances');
        walletBalancesDiv.innerHTML = ''; // Clear previous content

        // Log the tokenBalances array to see how many tokens are returned
        console.log(data.tokenBalances); // Log the array of token balances

        // Loop through the tokenBalances array and display each balance
        data.tokenBalances.forEach((token, index) => {
            const balanceDiv = document.createElement('div');
            // Convert tokenBalance from hex to decimal (if needed)
            const balanceInDecimal = parseInt(token.tokenBalance, 16) / Math.pow(10, token.decimals); // Convert hex to decimal
            
            // Handle potential null values for name and symbol
            const tokenName = token.name || 'Unknown Token';
            const tokenSymbol = token.symbol || 'N/A';

            balanceDiv.innerHTML = `${index + 1}. ${tokenName}: ${balanceInDecimal.toFixed(2)} ${tokenSymbol}`;
            walletBalancesDiv.appendChild(balanceDiv);
        });
    } catch (error) {
        console.error('Fetch error:', error); // Log any errors
    }
}

// Event listener for the button click
document.getElementById('fetch-balances').addEventListener('click', () => {
    const address = document.getElementById('wallet-address').value; // Get the wallet address from the input
    if (address) {
        fetchWalletBalances(address); // Fetch balances for the entered address
    } else {
        alert('Please enter a valid wallet address.'); // Alert if the input is empty
    }
});

const testData = {
    tokenBalances: [
        { name: "Token A", symbol: "TKA", tokenBalance: "1000000000000000000", decimals: 18 },
        { name: "Token B", symbol: "TKB", tokenBalance: "2000000000000000000", decimals: 18 }
    ]
};

const walletBalancesDiv = document.getElementById('wallet-balances');
walletBalancesDiv.innerHTML = ''; // Clear previous content

testData.tokenBalances.forEach((token, index) => {
    const balanceDiv = document.createElement('div');
    const balanceInDecimal = parseInt(token.tokenBalance, 16) / Math.pow(10, token.decimals); // Convert hex to decimal
    balanceDiv.innerHTML = `${index + 1}. ${token.name}: ${balanceInDecimal.toFixed(2)} ${token.symbol}`;
    walletBalancesDiv.appendChild(balanceDiv);
});