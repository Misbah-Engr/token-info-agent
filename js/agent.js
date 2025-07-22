class TokenInfoAgent {
    constructor() {
        this.coinGeckoApi = 'https://api.coingecko.com/api/v3';
        this.sessionMemory = new Map();
    }

    async fetchTokenPrice(tokenSymbol) {
        try {
            // Convert common symbols to CoinGecko IDs
            const symbolMap = {
                'btc': 'bitcoin',
                'eth': 'ethereum',
                'sol': 'solana',
                'near': 'near',
                'usdc': 'usd-coin',
                'usdt': 'tether',
                'doge': 'dogecoin',
                'ada': 'cardano',
                'matic': 'polygon',
                'dot': 'polkadot'
            };

            const tokenId = symbolMap[tokenSymbol.toLowerCase()] || tokenSymbol.toLowerCase();
            
            const response = await fetch(`${this.coinGeckoApi}/simple/price?ids=${tokenId}&vs_currencies=usd&include_24hr_change=true`);
            const data = await response.json();
            
            if (data[tokenId]) {
                return {
                    symbol: tokenSymbol.toUpperCase(),
                    price: data[tokenId].usd,
                    change24h: data[tokenId].usd_24h_change
                };
            }
            
            throw new Error('Token not found');
        } catch (error) {
            console.error('Error fetching price:', error);
            throw error;
        }
    }

    parseQuery(userQuery) {
        const query = userQuery.toLowerCase();
        const tokens = [];
        
        // Common patterns
        const patterns = [
            /price of (\w+)/,
            /(\w+) price/,
            /how much is (\w+)/,
            /what's (\w+) worth/,
            /(\w+) in usd/
        ];
        
        for (const pattern of patterns) {
            const match = query.match(pattern);
            if (match) {
                tokens.push(match[1]);
            }
        }
        
        // Check for multiple tokens
        const multiTokenPattern = /compare (\w+) and (\w+)/;
        const multiMatch = query.match(multiTokenPattern);
        if (multiMatch) {
            tokens.push(multiMatch[1], multiMatch[2]);
        }
        
        // Extract direct token mentions
        const commonTokens = ['btc', 'eth', 'sol', 'near', 'usdc', 'usdt', 'doge', 'ada', 'matic', 'dot'];
        commonTokens.forEach(token => {
            if (query.includes(token) && !tokens.includes(token)) {
                tokens.push(token);
            }
        });
        
        return [...new Set(tokens)];
    }

    async processQuery(userQuery) {
        const tokens = this.parseQuery(userQuery);
        
        if (tokens.length === 0) {
            return {
                type: 'error',
                message: "I couldn't find any token symbols in your query. Try asking 'What's the price of SOL?' or 'How much is 1 ETH?'"
            };
        }
        
        try {
            const results = await Promise.all(
                tokens.map(token => this.fetchTokenPrice(token))
            );
            
            if (results.length === 1) {
                const token = results[0];
                return {
                    type: 'single',
                    data: {
                        symbol: token.symbol,
                        price: `$${token.price.toLocaleString()}`,
                        change: token.change24h > 0 ? `+${token.change24h.toFixed(2)}%` : `${token.change24h.toFixed(2)}%`,
                        isPositive: token.change24h >= 0
                    }
                };
            } else {
                return {
                    type: 'comparison',
                    data: results.map(token => ({
                        symbol: token.symbol,
                        price: `$${token.price.toLocaleString()}`,
                        change: token.change24h > 0 ? `+${token.change24h.toFixed(2)}%` : `${token.change24h.toFixed(2)}%`,
                        isPositive: token.change24h >= 0
                    }))
                };
            }
        } catch (error) {
            return {
                type: 'error',
                message: 'Unable to fetch token data. Please check the token symbol and try again.'
            };
        }
    }

    formatResponse(response) {
        if (response.type === 'single') {
            const { symbol, price, change, isPositive } = response.data;
            return `
                <div class="token-card">
                    <h3>${symbol}</h3>
                    <div class="price">${price}</div>
                    <div class="change ${isPositive ? 'positive' : 'negative'}">${change} (24h)</div>
                </div>
            `;
        } else if (response.type === 'comparison') {
            const cards = response.data.map(token => `
                <div class="token-card comparison">
                    <h3>${token.symbol}</h3>
                    <div class="price">${token.price}</div>
                    <div class="change ${token.isPositive ? 'positive' : 'negative'}">${token.change} (24h)</div>
                </div>
            `).join('');
            
            return `<div class="comparison-container">${cards}</div>`;
        } else {
            return `<div class="error">${response.message}</div>`;
        }
    }
}
