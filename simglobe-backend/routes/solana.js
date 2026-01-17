/**
 * Solana Routes
 * Handles hedge transactions via Solana Pay
 */

const express = require('express');
const router = express.Router();
const SolanaService = require('../services/solana-service');

const solana = new SolanaService();

/**
 * POST /api/hedge
 * Create a Solana Pay transaction for hedging
 */
router.post('/', async (req, res, next) => {
  try {
    const { marketId, amount, walletAddress } = req.body;

    // Validate input
    if (!marketId) {
      return res.status(400).json({
        error: { message: 'marketId is required' }
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: { message: 'amount must be a positive number' }
      });
    }

    // Create hedge transaction
    const transaction = await solana.createHedgeTransaction({
      marketId,
      amount: parseFloat(amount),
      walletAddress: walletAddress || null
    });

    res.json({
      transactionId: transaction.id,
      qrCodeUrl: transaction.qrCodeUrl,
      deepLink: transaction.deepLink,
      amount: transaction.amount,
      marketId: transaction.marketId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 min expiry
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/hedge/:transactionId
 * Check transaction status
 */
router.get('/:transactionId', async (req, res, next) => {
  try {
    const { transactionId } = req.params;

    const status = await solana.getTransactionStatus(transactionId);

    res.json({
      transactionId,
      status: status.status,
      signature: status.signature,
      confirmedAt: status.confirmedAt,
      amount: status.amount
    });

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/hedge/history/:walletAddress
 * Get hedge transaction history for a wallet
 */
router.get('/history/:walletAddress', async (req, res, next) => {
  try {
    const { walletAddress } = req.params;
    const { limit = 10 } = req.query;

    const history = await solana.getTransactionHistory(
      walletAddress,
      parseInt(limit, 10)
    );

    res.json({
      walletAddress,
      transactions: history,
      count: history.length
    });

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/hedge/estimate
 * Estimate hedge amount based on risk
 */
router.post('/estimate', async (req, res, next) => {
  try {
    const { riskScore, portfolioValue, marketId } = req.body;

    if (!riskScore || !portfolioValue) {
      return res.status(400).json({
        error: { message: 'riskScore and portfolioValue are required' }
      });
    }

    // Simple hedge calculation
    // Higher risk = higher hedge percentage
    let hedgePercentage;
    if (riskScore >= 70) {
      hedgePercentage = 0.15; // 15% of portfolio
    } else if (riskScore >= 50) {
      hedgePercentage = 0.10; // 10% of portfolio
    } else if (riskScore >= 30) {
      hedgePercentage = 0.05; // 5% of portfolio
    } else {
      hedgePercentage = 0.02; // 2% of portfolio
    }

    const estimatedHedge = Math.round(portfolioValue * hedgePercentage);

    res.json({
      riskScore,
      portfolioValue,
      hedgePercentage: hedgePercentage * 100,
      estimatedHedge,
      currency: 'USDC',
      reasoning: `Based on risk score of ${riskScore}%, recommended hedge is ${hedgePercentage * 100}% of portfolio value.`
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
