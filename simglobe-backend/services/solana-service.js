/**
 * Solana Service
 * Handles Solana Pay transactions for hedging
 */

const QRCode = require('qrcode');

class SolanaService {
  constructor() {
    this.rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
    this.isDevelopment = process.env.NODE_ENV === 'development' || !process.env.SOLANA_PRIVATE_KEY;

    // In-memory transaction store (use database in production)
    this.transactions = new Map();
  }

  /**
   * Create a hedge transaction
   * @param {Object} params - Transaction parameters
   * @returns {Promise<Object>} Transaction details
   */
  async createHedgeTransaction({ marketId, amount, walletAddress }) {
    // For hackathon: Use mock transactions
    if (this.isDevelopment) {
      return this.createMockTransaction(marketId, amount);
    }

    try {
      // Real Solana Pay implementation would go here
      // Using @solana/pay library

      const transactionId = this.generateTransactionId();
      const reference = this.generateReference();

      // Build Solana Pay URL
      const recipient = process.env.SIMGLOBE_WALLET || 'SimGLobeXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
      const label = `SimGlobe Hedge - ${marketId}`;
      const message = `Hedging ${amount} USDC`;
      const memo = `HEDGE:${marketId}:${Date.now()}`;

      const solanaPayUrl = this.buildSolanaPayUrl({
        recipient,
        amount,
        reference,
        label,
        message,
        memo
      });

      // Generate QR code
      const qrCodeUrl = await this.generateQRCode(solanaPayUrl);

      // Store transaction
      const transaction = {
        id: transactionId,
        reference,
        marketId,
        amount,
        walletAddress,
        status: 'pending',
        qrCodeUrl,
        deepLink: solanaPayUrl,
        createdAt: new Date().toISOString()
      };

      this.transactions.set(transactionId, transaction);

      return transaction;

    } catch (error) {
      console.error('Solana transaction error:', error);
      // Fallback to mock
      return this.createMockTransaction(marketId, amount);
    }
  }

  /**
   * Create mock transaction for demo
   */
  async createMockTransaction(marketId, amount) {
    const transactionId = this.generateTransactionId();

    // Generate a mock QR code
    const mockUrl = `solana:SimGLobeDemo?amount=${amount}&label=SimGlobe%20Hedge&memo=HEDGE:${marketId}`;
    const qrCodeUrl = await this.generateQRCode(mockUrl);

    const transaction = {
      id: transactionId,
      marketId,
      amount,
      status: 'pending',
      qrCodeUrl,
      deepLink: mockUrl,
      createdAt: new Date().toISOString(),
      isMock: true
    };

    this.transactions.set(transactionId, transaction);

    // Auto-confirm mock transaction after 3 seconds (for demo)
    setTimeout(() => {
      const tx = this.transactions.get(transactionId);
      if (tx && tx.status === 'pending') {
        tx.status = 'confirmed';
        tx.signature = `mock_sig_${transactionId}`;
        tx.confirmedAt = new Date().toISOString();
      }
    }, 3000);

    return transaction;
  }

  /**
   * Get transaction status
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} Transaction status
   */
  async getTransactionStatus(transactionId) {
    const transaction = this.transactions.get(transactionId);

    if (!transaction) {
      return {
        transactionId,
        status: 'not_found'
      };
    }

    // For real implementation, check on-chain status
    if (!transaction.isMock && !this.isDevelopment) {
      // Would check blockchain here
      // const status = await this.checkOnChainStatus(transaction.reference);
    }

    return {
      transactionId,
      status: transaction.status,
      signature: transaction.signature,
      confirmedAt: transaction.confirmedAt,
      amount: transaction.amount
    };
  }

  /**
   * Get transaction history for a wallet
   * @param {string} walletAddress - Wallet address
   * @param {number} limit - Max results
   * @returns {Promise<Array>} Transaction history
   */
  async getTransactionHistory(walletAddress, limit = 10) {
    // In production, query blockchain for actual history
    // For demo, return mock history

    return [
      {
        id: 'hist_1',
        marketId: 'mock-port-strike',
        amount: 500,
        status: 'confirmed',
        signature: 'abc123...',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'hist_2',
        marketId: 'mock-inflation',
        amount: 250,
        status: 'confirmed',
        signature: 'def456...',
        createdAt: new Date(Date.now() - 172800000).toISOString()
      }
    ].slice(0, limit);
  }

  /**
   * Build Solana Pay URL
   */
  buildSolanaPayUrl({ recipient, amount, reference, label, message, memo }) {
    const params = new URLSearchParams();

    if (amount) params.append('amount', amount);
    if (reference) params.append('reference', reference);
    if (label) params.append('label', label);
    if (message) params.append('message', message);
    if (memo) params.append('memo', memo);

    // SPL token (USDC)
    params.append('spl-token', 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

    return `solana:${recipient}?${params.toString()}`;
  }

  /**
   * Generate QR code for Solana Pay URL
   */
  async generateQRCode(url) {
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });

      return qrDataUrl;

    } catch (error) {
      console.error('QR code generation error:', error);
      // Return placeholder
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    }
  }

  /**
   * Generate unique transaction ID
   */
  generateTransactionId() {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate reference for tracking
   */
  generateReference() {
    return `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = SolanaService;
