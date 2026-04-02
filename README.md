# n8n-nodes-ripple-prime

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node integrates with Ripple Prime's institutional trading platform, providing access to 6 core resources for professional cryptocurrency trading and prime brokerage services. The node enables automated account management, order execution, trade monitoring, market data analysis, prime brokerage operations, and risk management workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Ripple](https://img.shields.io/badge/Ripple-Prime-0066cc)
![Cryptocurrency](https://img.shields.io/badge/Crypto-Trading-gold)
![Institutional](https://img.shields.io/badge/Institutional-Grade-green)

## Features

- **Account Management** - Complete account operations including balance inquiries, profile management, and account status monitoring
- **Advanced Order Execution** - Full order lifecycle management with support for limit, market, and complex order types
- **Real-time Trade Monitoring** - Comprehensive trade tracking, execution history, and settlement status updates
- **Institutional Market Data** - Access to professional-grade market data feeds, order books, and trading analytics
- **Prime Brokerage Services** - Custody operations, multi-counterparty trading, and institutional client management
- **Risk Management Integration** - Real-time risk metrics, position monitoring, and compliance workflow automation
- **Enterprise Security** - API key authentication with secure credential management and audit logging
- **High-Performance Architecture** - Optimized for institutional trading volumes with robust error handling

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-ripple-prime`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-ripple-prime
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-ripple-prime.git
cd n8n-nodes-ripple-prime
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-ripple-prime
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Ripple Prime API key from the institutional dashboard | Yes |
| Environment | Select between Production and Sandbox environments | Yes |
| Rate Limit | Maximum requests per minute (default: 1000) | No |

## Resources & Operations

### 1. Account

| Operation | Description |
|-----------|-------------|
| Get Balance | Retrieve account balances across all supported currencies |
| Get Profile | Fetch complete account profile and configuration settings |
| Update Profile | Modify account settings and trading preferences |
| Get Status | Check current account status and trading permissions |
| List Transactions | Retrieve transaction history with filtering options |
| Get Limits | View current trading and withdrawal limits |

### 2. Order

| Operation | Description |
|-----------|-------------|
| Create Order | Place new buy/sell orders with various execution types |
| Cancel Order | Cancel pending or partially filled orders |
| Get Order | Retrieve detailed order information by ID |
| List Orders | Get filtered list of orders with status and time filters |
| Modify Order | Update price, quantity, or other order parameters |
| Get Order Book | Access real-time order book for specified trading pairs |

### 3. Trade

| Operation | Description |
|-----------|-------------|
| Get Trade | Retrieve specific trade execution details |
| List Trades | Get comprehensive trade history with advanced filters |
| Get Trade Status | Check settlement and clearing status of trades |
| Export Trades | Generate trade reports in various formats |
| Get Fill Details | Access detailed fill information for complex orders |

### 4. MarketData

| Operation | Description |
|-----------|-------------|
| Get Ticker | Real-time price ticker for specified trading pairs |
| Get Candles | Historical OHLCV data with configurable time intervals |
| Get Depth | Market depth analysis and liquidity metrics |
| Get Trades | Public trade feed and market activity data |
| Get Stats | 24-hour trading statistics and volume metrics |
| List Pairs | Available trading pairs and market information |

### 5. PrimeBrokerage

| Operation | Description |
|-----------|-------------|
| Get Custody Balance | View assets held in custody accounts |
| Transfer Assets | Execute internal transfers between custody accounts |
| List Counterparties | Manage approved trading counterparties |
| Get Settlement Status | Track settlement progress for prime brokerage trades |
| Generate Reports | Create institutional reporting for clients |
| Manage Allocations | Handle trade allocation across client accounts |

### 6. Risk

| Operation | Description |
|-----------|-------------|
| Get Risk Metrics | Real-time portfolio risk analysis and VaR calculations |
| Set Risk Limits | Configure position limits and risk parameters |
| Get Exposure | Current market exposure across all positions |
| Generate Risk Report | Comprehensive risk assessment and stress testing |
| Monitor Compliance | Check regulatory compliance status |
| Get Margin Status | View margin requirements and utilization |

## Usage Examples

```javascript
// Get account balances
{
  "resource": "Account",
  "operation": "Get Balance",
  "currency": "USD"
}
```

```javascript
// Place a limit order
{
  "resource": "Order",
  "operation": "Create Order",
  "side": "buy",
  "type": "limit",
  "pair": "XRP/USD",
  "amount": "1000",
  "price": "0.52"
}
```

```javascript
// Get real-time market data
{
  "resource": "MarketData",
  "operation": "Get Ticker",
  "pair": "XRP/USD",
  "include_depth": true
}
```

```javascript
// Execute prime brokerage transfer
{
  "resource": "PrimeBrokerage",
  "operation": "Transfer Assets",
  "from_account": "custody_main",
  "to_account": "client_001",
  "currency": "XRP",
  "amount": "50000"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Authentication Failed | Invalid or expired API key | Verify API key in credentials and check permissions |
| Rate Limit Exceeded | Too many requests sent | Implement delays or reduce request frequency |
| Insufficient Balance | Not enough funds for operation | Check account balance before placing orders |
| Invalid Trading Pair | Unsupported currency pair | Use List Pairs operation to get valid trading pairs |
| Order Rejected | Order parameters violate risk limits | Review order size and check risk limits |
| Network Timeout | Connection timeout to Ripple Prime | Retry request with exponential backoff |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-ripple-prime/issues)
- **Ripple Prime Documentation**: [Ripple Prime API Docs](https://ripple.com/prime/docs)
- **Institutional Support**: [Ripple Prime Support](https://ripple.com/prime/support)