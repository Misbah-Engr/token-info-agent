class TokenInfoAgent {
    constructor() {
        this.coinGeckoApi = 'https://api.coingecko.com/api/v3';
        this.sessionMemory = new Map();
        
        // Comprehensive token mapping with proper CoinGecko IDs
        this.symbolMap = {
            'btc': 'bitcoin',
            'bitcoin': 'bitcoin',
            'eth': 'ethereum',
            'ethereum': 'ethereum',
            'sol': 'solana',
            'solana': 'solana',
            'near': 'near',
            'usdc': 'usd-coin',
            'usdt': 'tether',
            'doge': 'dogecoin',
            'ada': 'cardano',
            'matic': 'polygon',
            'dot': 'polkadot',
            'shib': 'shiba-inu',
            'link': 'chainlink',
            'xrp': 'ripple',
            'ltc': 'litecoin',
            'bch': 'bitcoin-cash',
            'uni': 'uniswap',
            'avax': 'avalanche-2',
            'atom': 'cosmos',
            'algo': 'algorand',
            'vet': 'vechain',
            'fil': 'filecoin',
            'trx': 'tron',
            'etc': 'ethereum-classic',
            'xlm': 'stellar',
            'vet': 'vechain',
            'theta': 'theta-token',
            'xmr': 'monero',
            'eos': 'eos',
            'neo': 'neo',
            'miota': 'iota',
            'dash': 'dash',
            'zec': 'zcash',
            'xem': 'nem',
            'xtz': 'tezos',
            'omg': 'omisego',
            'bat': 'basic-attention-token',
            'zrx': '0x',
            'rep': 'augur',
            'gnt': 'golem',
            'snt': 'status',
            'cvc': 'civic',
            'mana': 'decentraland',
            'lrc': 'loopring',
            'knc': 'kyber-network',
            'bnt': 'bancor',
            'poly': 'polymath',
            'fun': 'funfair',
            'powr': 'power-ledger',
            'salt': 'salt',
            'mco': 'crypto-com',
            'pay': 'tenx',
            'req': 'request-network',
            'dgb': 'digibyte',
            'steem': 'steem',
            'waves': 'waves',
            'strat': 'stratis',
            'sc': 'siacoin',
            'xvg': 'verge',
            'ardr': 'ardor',
            'nxt': 'nxt',
            'emc2': 'einsteinium',
            'flo': 'florincoin',
            'nav': 'nav-coin',
            'ppc': 'peercoin',
            'nmc': 'namecoin',
            'qrk': 'quark',
            'ftc': 'feathercoin',
            'nvc': 'novacoin',
            'trc': 'terracoin',
            'src': 'securecoin',
            'tag': 'tagcoin',
            'start': 'startcoin',
            'mint': 'mintcoin',
            'vtc': 'vertcoin',
            'uno': 'unobtanium',
            'moon': 'mooncoin',
            'cann': 'cannabiscoin',
            'drk': 'dash',
            'aur': 'auroracoin',
            'pot': 'potcoin',
            'huc': 'huntercoin',
            'anc': 'anoncoin',
            'cap': 'bottlecap',
            'xpm': 'primecoin',
            'yac': 'yacoin',
            'zet': 'zetacoin',
            'nxt': 'nxt',
            'ripple': 'ripple',
            'litecoin': 'litecoin',
            'cardano': 'cardano',
            'polkadot': 'polkadot',
            'chainlink': 'chainlink',
            'stellar': 'stellar',
            'dogecoin': 'dogecoin',
            'vechain': 'vechain',
            'filecoin': 'filecoin',
            'tron': 'tron',
            'ethereum-classic': 'ethereum-classic',
            'monero': 'monero',
            'eos': 'eos',
            'algorand': 'algorand',
            'cosmos': 'cosmos',
            'tezos': 'tezos',
            'decentraland': 'decentraland',
            'the-sandbox': 'the-sandbox',
            'axie-infinity': 'axie-infinity',
            'aave': 'aave',
            'compound-governance-token': 'compound-coin',
            'maker': 'maker',
            'sushi': 'sushi',
            'yearn-finance': 'yearn-finance'
        };
    }

    async fetchTokenPrice(tokenSymbol) {
        try {
            // Clean and normalize the symbol
            const cleanSymbol = tokenSymbol.toLowerCase().trim();
            const tokenId = this.symbolMap[cleanSymbol] || cleanSymbol;
            
            console.log(`Fetching price for ${tokenSymbol} (ID: ${tokenId})`);
            
            const response = await fetch(
                `${this.coinGeckoApi}/simple/price?ids=${tokenId}&vs_currencies=usd&include_24hr_change=true`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('API Response:', data);
            
            if (data[tokenId]) {
                return {
                    symbol: tokenSymbol.toUpperCase(),
                    price: data[tokenId].usd,
                    change24h: data[tokenId].usd_24h_change || 0
                };
            }
            
            // Try direct symbol search
            const searchResponse = await fetch(
                `${this.coinGeckoApi}/search?query=${tokenSymbol}`
            );
            const searchData = await searchResponse.json();
            
            if (searchData.coins && searchData.coins.length > 0) {
                const topResult = searchData.coins[0];
                const retryResponse = await fetch(
                    `${this.coinGeckoApi}/simple/price?ids=${topResult.id}&vs_currencies=usd&include_24hr_change=true`
                );
                const retryData = await retryResponse.json();
                
                if (retryData[topResult.id]) {
                    return {
                        symbol: topResult.symbol.toUpperCase(),
                        price: retryData[topResult.id].usd,
                        change24h: retryData[topResult.id].usd_24h_change || 0
                    };
                }
            }
            
            throw new Error(`Token "${tokenSymbol}" not found`);
        } catch (error) {
            console.error('Error fetching price:', error);
            throw error;
        }
    }

    parseQuery(userQuery) {
        const query = userQuery.toLowerCase();
        const tokens = [];
        
        // Common patterns with better regex
        const patterns = [
            /price of (\w+)/,
            /(\w+) price/,
            /how much is (\w+)/,
            /what's (\w+) worth/,
            /(\w+) in usd/,
            /(\w+) to usd/,
            /(\w+) value/,
            /current (\w+) price/,
            /(\w+) crypto price/,
            /cryptocurrency (\w+)/
        ];
        
        // Find all matches from patterns
        for (const pattern of patterns) {
            const matches = query.match(pattern);
            if (matches) {
                tokens.push(matches[1]);
            }
        }
        
        // Check for multiple tokens
        const multiPatterns = [
            /compare (\w+) and (\w+)/,
            /(\w+) vs (\w+)/,
            /(\w+) or (\w+)/
        ];
        
        for (const pattern of multiPatterns) {
            const match = query.match(pattern);
            if (match) {
                tokens.push(match[1], match[2]);
            }
        }
        
        // Extract any known symbols from text
        const knownSymbols = Object.keys(this.symbolMap);
        knownSymbols.forEach(symbol => {
            if (query.includes(symbol) && !tokens.includes(symbol)) {
                tokens.push(symbol);
            }
        });
        
        // Remove duplicates and clean
        return [...new Set(tokens)].filter(token => token && token.length > 2);
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
            const results = await Promise.allSettled(
                tokens.map(async (token) => {
                    try {
                        return await this.fetchTokenPrice(token);
                    } catch (error) {
                        console.error(`Failed to fetch ${token}:`, error);
                        return null;
                    }
                })
            );
            
            const validResults = results
                .filter(result => result.status === 'fulfilled' && result.value !== null)
                .map(result => result.value);
            
            if (validResults.length === 0) {
                return {
                    type: 'error',
                    message: `Unable to find data for: ${tokens.join(', ')}. Please check the token symbols and try again.`
                };
            }
            
            if (validResults.length === 1) {
                const token = validResults[0];
                return {
                    type: 'single',
                    data: {
                        symbol: token.symbol,
                        price: `$${token.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
                        change: token.change24h > 0 ? `+${token.change24h.toFixed(2)}%` : `${token.change24h.toFixed(2)}%`,
                        isPositive: token.change24h >= 0
                    }
                };
            } else {
                return {
                    type: 'comparison',
                    data: validResults.map(token => ({
                        symbol: token.symbol,
                        price: `$${token.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
                        change: token.change24h > 0 ? `+${token.change24h.toFixed(2)}%` : `${token.change24h.toFixed(2)}%`,
                        isPositive: token.change24h >= 0
                    }))
                };
            }
        } catch (error) {
            console.error('Error in processQuery:', error);
            return {
                type: 'error',
                message: 'Unable to fetch token data. Please try again later.'
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
