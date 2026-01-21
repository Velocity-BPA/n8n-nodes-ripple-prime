# n8n-nodes-ripple-prime

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

Comprehensive n8n community node for **Ripple Prime** (formerly Hidden Road), an institutional prime brokerage platform for multi-asset trading, cross-margining, and treasury management.

![n8n version](https://img.shields.io/badge/n8n-%3E%3D1.17.0-blue)
![Node version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![Version](https://img.shields.io/badge/version-1.0.0-orange)

## Features

- **18 Resource Categories** with 200+ operations
- **Multi-Asset Trading**: Equities, FX, crypto, derivatives, fixed income
- **Cross-Margining**: Unified margin across asset classes with BUIDL/RLUSD collateral
- **Real-Time Events**: WebSocket streaming for balances, trades, positions, risk alerts
- **FIX Protocol Support**: Direct exchange connectivity via FIX 4.2/4.4/5.0
- **Bitemporal Queries**: Point-in-time data access for compliance and reconciliation
- **Route28 Synthetic Prime**: OTC swap-based prime brokerage services

## Installation

### Community Nodes (Recommended)

1. Go to **Settings** > **Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-ripple-prime`
4. Agree to the risks and click **Install**

### Manual Installation

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-ripple-prime
```

### Development Installation

```bash
# Clone or extract the package
cd n8n-nodes-ripple-prime

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-ripple-prime

# Restart n8n
```

## Credentials Setup

### Ripple Prime API (REST)

| Field | Description |
|-------|-------------|
| Environment | Production or Sandbox |
| Authentication Method | API Key + Secret, OAuth 2.0, or mTLS |
| API Key | Your API key |
| API Secret | Your API secret for HMAC signing |
| Account ID | Default account ID |
| Organization ID | Your organization ID |

### Ripple Prime FIX (Trading)

| Field | Description |
|-------|-------------|
| FIX Version | 4.2, 4.4, 5.0, or 5.0 SP2 |
| Sender Comp ID | Your FIX sender ID |
| Target Comp ID | Ripple Prime FIX gateway ID |
| Host | FIX gateway hostname |
| Port | FIX gateway port |
| SSL/TLS | Enable secure connection |

### Ripple Prime WebSocket (Streaming)

| Field | Description |
|-------|-------------|
| Environment | Production or Sandbox |
| Authentication | API Key, JWT, or OAuth |
| Subscription Topics | Default topics to subscribe |
| Auto-Reconnect | Enable automatic reconnection |

## Resources & Operations

### Account Activity
Access balances, trades, positions, fees, settlements, and statements.

**Operations:** Get Balances, Get Trades, Get Positions, Get Fees, Get Settlements, Get Statements, Export Snapshot

### Risk Metrics
Monitor credit utilization, margin, exposure, VaR, and stress tests.

**Operations:** Get Credit Utilization, Get Credit Limits, Get Margin Status, Get Exposure, Get Counterparty Risk, Get VaR, Run Stress Test, Get Risk Alerts

### Treasury Management
Manage transfers, sweeps, collateral allocation, and margin calls.

**Operations:** Create Transfer, Get Transfer Status, Execute Sweep, Allocate Collateral, Optimize Collateral, Get Funding Status, Respond to Margin Call

### Trading (Multi-Asset)
Execute orders, cancels, and modifications across asset classes.

**Operations:** Create Order, Cancel Order, Modify Order, Get Order Status, Get Fills, Get Executions, Request Quote (RFQ), Get Trade Confirmations, Allocate Trade

### FX Trading
Execute FX spot, forwards, swaps, and options.

**Operations:** Get FX Quote, Execute Spot, Execute Forward, Execute Swap, Execute NDF, Get FX Positions, Get FX Settlements, Get FX Blotter, Roll Forward

### Digital Assets
Trade crypto assets and manage wallets.

**Operations:** Get Crypto Balances, Create Crypto Order, Get Crypto Markets, Get Crypto Quote, Get Crypto Positions, Request Withdrawal, Get Deposit Address, Get Wallet Info, Get Staking Positions

### Derivatives
Trade futures, options, and manage derivatives positions.

**Operations:** Create Futures Order, Create Options Order, Get Positions, Get Margin Requirements, Exercise Option, Get Expiry Schedule, Calculate Greeks, Get Settlements

### Fixed Income
Trade bonds, repos, and securities lending.

**Operations:** Get Bond Quote, Execute Bond Trade, Create Repo, Get Securities Lending, Get Yield Curves, Get Positions, Get Coupon Schedule, Get Maturities

### Prime Brokerage
Access prime brokerage services and financing.

**Operations:** Get Services, Get Financing Rates, Request Locate, Borrow Securities, Get Custody Assets, Get Clearing Status, Generate Report, Get Agreement Details

### Route28
Synthetic prime brokerage via OTC swaps.

**Operations:** Get Positions, Create Swap, Get Margin, Manage Collateral, Calculate PnL, Rebalance Portfolio, Get Funding Rates, Request Termination

### Collateral
Manage collateral positions and movements.

**Operations:** Get Positions, Get Movements, Get Haircuts, Get Valuations, Get Eligible Assets, Request Substitution, Optimize Allocation, Dispute Valuation

### Settlement
Manage settlement instructions and reconciliation.

**Operations:** Create Instructions, Get Pending, Get History, Get Netting Sets, Get Fails, Manage SSI, Run Reconciliation, Confirm Settlement

### Reporting
Generate and schedule reports.

**Operations:** Run Standard Report, Create Custom Report, Schedule Report, Get History, Get Templates, Export Data, Run Bitemporal Query, Get Analytics

### Counterparty
Manage counterparty relationships and limits.

**Operations:** List Counterparties, Get Details, Get Limits, Get Agreements, Get Exposure, Get Netting Sets, Get Credit Rating, Submit Onboarding

### Exchange
Connect to external exchanges.

**Operations:** Get Connected Exchanges, Get Exchange Status, Get Exchange Balances, Transfer to Exchange, Transfer from Exchange, Get Supported Exchanges, Get Exchange Fees, Get Exchange Markets

### Compliance
Access compliance and audit information.

**Operations:** Get Status, Get Surveillance Alerts, Get AML Alerts, Get Regulatory Filings, Get Audit Trail, Get SOC 2 Reports, Get KYC Status, Get Sanctions Screening

### Webhook
Manage webhook subscriptions.

**Operations:** Create Webhook, List Webhooks, Get Webhook, Update Webhook, Delete Webhook, Get Events, Test Webhook, Get Logs

### Utility
Access API utilities and reference data.

**Operations:** Get API Status, Get Supported Assets, Get Supported Markets, Get Trading Hours, Get Market Holidays, Get Fee Schedule, Get Rate Limits, Get SDK Version, Ping, Get Server Time

## Trigger Node

The **Ripple Prime Trigger** node provides real-time event notifications via WebSocket.

### Event Types

- **Balance Events**: Balance updates, alerts
- **Trade Events**: Executed, confirmed, settled, failed
- **Order Events**: Created, filled, partial, cancelled, rejected
- **Position Events**: Opened, updated, closed, liquidated
- **Risk Events**: Margin calls, alerts, limit breaches, exposure alerts
- **Settlement Events**: Pending, complete, failed
- **Collateral Events**: Received, released, calls
- **Market Events**: Price updates, status changes
- **FX Events**: Quotes, executions
- **Compliance Events**: Alerts, AML notifications
- **System Events**: Status updates, maintenance notices

## Bitemporal Queries

Many operations support bitemporal queries for compliance and reconciliation:

```javascript
{
  "asOf": "2024-01-15T00:00:00Z",  // Valid time
  "asAt": "2024-01-16T09:00:00Z"   // Transaction time
}
```

## Collateral Types

| Type | Haircut | Notes |
|------|---------|-------|
| BUIDL | 0% | BlackRock tokenized MMF |
| RLUSD | 0% | Ripple USD stablecoin |
| Cash | 0% | USD, EUR, GBP, etc. |
| US Treasuries | 2% | T-bills, notes, bonds |
| Equity | 25% | Listed securities |
| Crypto | 30% | BTC, ETH, XRP, etc. |

## Error Handling

The node includes comprehensive error handling with clear error messages:

- **Authentication Errors**: Invalid credentials or expired tokens
- **Validation Errors**: Invalid parameters or missing required fields
- **Rate Limiting**: Automatic retry with exponential backoff
- **Network Errors**: Connection timeouts and retries
- **Business Errors**: Insufficient funds, margin violations

## Security Best Practices

1. **Store credentials securely** using n8n's credential management
2. **Use environment-specific credentials** for sandbox vs production
3. **Enable mTLS** for production trading
4. **Implement IP whitelisting** for API access
5. **Monitor webhook signatures** for authenticity

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Format code
npm run format
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
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. All tests pass before submitting
2. Code follows the existing style
3. New features include appropriate tests
4. Documentation is updated accordingly

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-ripple-prime/issues)
- **Documentation**: [Ripple Prime API Docs](https://docs.ripple.com/prime)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io)

## Acknowledgments

- [n8n](https://n8n.io) for the workflow automation platform
- [Ripple](https://ripple.com) for the prime brokerage infrastructure
- The n8n community for feedback and contributions
