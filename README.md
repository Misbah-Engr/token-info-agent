# Token Info Shade Agent

An autonomous AI agent built with JavaScript that provides real-time cryptocurrency price information using natural language queries.

## 🚀 Quick Start

1. **Visit the live demo**: [Your GitHub Pages URL]
2. **Try these queries**:
   - "What's the price of SOL?"
   - "How much is 1 ETH in USD?"
   - "Compare BTC and ETH prices"

## 📁 Project Structure

```bash
token-info-agent/
├── README.md              # This file
├── index.html             # Main UI
├── js/
│   ├── agent.js          # Core agent logic
│   └── app.js            # UI controller
├── css/
│   └── styles.css        # Styling
├── examples/
│   └── prompt_examples.txt # Sample queries
└── .github/
└── workflows/
└── deploy.yml    # GitHub Pages deployment

```


## 🛠️ Local Development

1. Clone the repository:
```bash
git clone https://github.com/Misbah-Engr/token-info-agent.git
cd token-info-agent
```
Open index.html in your browser, or serve locally:

# Using Python

```bash
python -m http.server 8000
```

# Using Node.js

```
npx serve .
```

## How It Works
### Core Features
Natural Language Processing: Parses user queries to identify token symbols
Real-time Data: Uses CoinGecko API for live price data
Multi-token Support: Can handle single tokens or comparisons
Responsive UI: Works on desktop and mobile devices

## API Integration
The agent uses CoinGecko's free API to fetch real-time data:

```
const response = await fetch(
  `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd&include_24hr_change=true`
);

```

### Query Examples
T
"What's the price of SOL?"	Current SOL price with 24h change
"How much is 1 ETH in USD?"	Current ETH price in USD
"Compare BTC and ETH"	Side-by-side price comparison

## 🎥 Demo Video
[link]

## 🚢 Deployment
This project is automatically deployed to GitHub Pages when you push to the main branch.

## 🤝 Contributing
Fork the repository
Create a feature branch
Make your changes
Test thoroughly
Submit a pull request

## 📄 License
MIT License - feel free to use this for your own projects!

## 🆘 Support

For issues or questions:
- Open an issue
- Check the CoinGecko API docs
