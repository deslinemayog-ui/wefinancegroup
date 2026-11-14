/**
 * WEFINANCE DYNAMIC INTEREST ENGINE
 * =================================
 * SENSITIVE FINANCIAL LOGIC MODULE
 * 
 * Rules & Constraints:
 * 1. Investor Interest Rate: 20% to 50%
 *    - Base / Minimum yield: 20%
 *    - Ceiling / Maximum yield: 50%
 * 
 * 2. Borrower Financing Rate: 35% to 60%
 *    - Base / Minimum borrowing cost: 35%
 *    - Ceiling / Maximum borrowing cost: 60%
 * 
 * 3. Market Demand Dynamics:
 *    - High Demand (Borrower requests > Investor supply):
 *      Interest rate for investors increases up to 50% to incentivize capital inflow.
 *      Borrowing cost for borrowers increases up to 60% due to capital scarcity.
 *    - Low Demand / Capital Surplus (Investor capital > Borrower demand):
 *      Interest rate for investors decreases down to 20%.
 *      Borrowing cost for borrowers decreases down to 35% to attract credit applicants.
 * 
 * 4. Platform Custody & Operational Spread:
 *    - Borrower Rate always covers Investor Yield + Platform Spread (10% - 15%).
 *    - The spread funds physical vault security, biometric custody, notary registration,
 *      FICA verification, and default reserve backing.
 */

export const MIN_INVESTOR_RATE = 20; // 20%
export const MAX_INVESTOR_RATE = 50; // 50%

export const MIN_BORROWER_RATE = 35; // 35%
export const MAX_BORROWER_RATE = 60; // 60%

export const MIN_PLATFORM_SPREAD = 10; // 10%
export const MAX_PLATFORM_SPREAD = 15; // 15%

export type DemandLevel = 'LOW' | 'BALANCED' | 'HIGH';

export interface DynamicInterestRates {
  investorRate: number;        // Rate earned by investors (20% - 50%)
  borrowerRate: number;        // Rate paid by borrowers (35% - 60%)
  platformSpread: number;      // Operational spread (10% - 15%)
  demandScore: number;         // Normalized 0.0 (High Capital / Low Demand) to 1.0 (High Demand)
  demandRatio: number;         // Ratio of borrowers to investors
  demandLevel: DemandLevel;    // 'LOW' | 'BALANCED' | 'HIGH'
  demandLabel: string;         // Human-readable status e.g. "High Demand (+48% Yield)"
  demandSummary: string;       // Brief explanatory text
  borrowerCount: number;
  investorCount: number;
}

export interface DemandCalculationParams {
  borrowerCount: number;
  investorCount: number;
  capitalRequested?: number;
  capitalFunded?: number;
}

/**
 * Calculates dynamic interest rates using algorithmic supply/demand sigmoid curve.
 * Guarantees mathematical safety:
 * - Investor yield is strictly clamped between 20% and 50%.
 * - Borrower cost is strictly clamped between 35% and 60%.
 * - Platform spread is always positive (10% - 15%).
 */
export function calculateDynamicRates(
  paramsOrBorrowers: DemandCalculationParams | number,
  optionalInvestors?: number,
  optionalCapitalRequested?: number,
  optionalCapitalFunded?: number
): DynamicInterestRates {
  let params: DemandCalculationParams;

  if (typeof paramsOrBorrowers === 'number') {
    params = {
      borrowerCount: paramsOrBorrowers,
      investorCount: optionalInvestors ?? 0,
      capitalRequested: optionalCapitalRequested,
      capitalFunded: optionalCapitalFunded,
    };
  } else {
    params = paramsOrBorrowers;
  }

  const borrowers = Math.max(0, params.borrowerCount || 0);
  const investors = Math.max(0, params.investorCount || 0);

  // Participant ratio with Laplace smoothing to prevent division by zero
  // When borrowers == investors, ratio = 1.0
  // When borrowers > investors, ratio > 1.0 (High demand)
  // When investors > borrowers, ratio < 1.0 (Low demand / capital surplus)
  const participantRatio = (borrowers + 1) / (investors + 1);

  // Optional capital factor if target and funded capital are provided
  let capitalDemandFactor = 0.5; // neutral default
  if (params.capitalRequested && params.capitalRequested > 0) {
    const funded = Math.max(0, params.capitalFunded || 0);
    const remaining = Math.max(0, params.capitalRequested - funded);
    // Ratio of remaining capital needed to total target (1.0 = 0% funded, 0.0 = 100% funded)
    capitalDemandFactor = Math.min(1, Math.max(0, remaining / params.capitalRequested));
  }

  // Logistic sigmoid function mapping participant ratio to [0, 1]
  // k controls the slope/sensitivity of the curve
  const k = 1.35;
  const logRatio = Math.log(participantRatio);
  const participantDemandScore = 1 / (1 + Math.exp(-k * logRatio));

  // Blend participant demand (70%) with capital demand (30%) if capital info is available
  let rawDemandScore: number;
  if (params.capitalRequested && params.capitalRequested > 0) {
    rawDemandScore = 0.7 * participantDemandScore + 0.3 * capitalDemandFactor;
  } else {
    rawDemandScore = participantDemandScore;
  }

  // Strictly clamp demand score between 0 and 1
  const demandScore = Math.min(1, Math.max(0, rawDemandScore));

  // Map demand score to rates:
  // Investor: 20% + demandScore * (50% - 20%) = 20 + 30 * demandScore
  const rawInvestorRate = MIN_INVESTOR_RATE + demandScore * (MAX_INVESTOR_RATE - MIN_INVESTOR_RATE);
  // Borrower: 35% + demandScore * (60% - 35%) = 35 + 25 * demandScore
  const rawBorrowerRate = MIN_BORROWER_RATE + demandScore * (MAX_BORROWER_RATE - MIN_BORROWER_RATE);

  // Round to 1 decimal place for clean institutional presentation
  const investorRate = Math.min(
    MAX_INVESTOR_RATE,
    Math.max(MIN_INVESTOR_RATE, Math.round(rawInvestorRate * 10) / 10)
  );

  const borrowerRate = Math.min(
    MAX_BORROWER_RATE,
    Math.max(MIN_BORROWER_RATE, Math.round(rawBorrowerRate * 10) / 10)
  );

  // Spread is the exact difference
  const platformSpread = Math.round((borrowerRate - investorRate) * 10) / 10;

  // Determine market classification
  let demandLevel: DemandLevel;
  let demandLabel: string;
  let demandSummary: string;

  if (demandScore >= 0.65) {
    demandLevel = 'HIGH';
    demandLabel = `High Demand (+${investorRate}% Yield)`;
    demandSummary = `High borrower request volume (${borrowers} applicants vs ${investors} investors). Yield elevated to +${investorRate}% to incentivize capital providers.`;
  } else if (demandScore <= 0.35) {
    demandLevel = 'LOW';
    demandLabel = `Capital Surplus (+${investorRate}% Yield)`;
    demandSummary = `Abundant investor capital (${investors} investors vs ${borrowers} applicants). Borrowing cost discounted to ${borrowerRate}% to drive credit allocation.`;
  } else {
    demandLevel = 'BALANCED';
    demandLabel = `Balanced Liquidity (+${investorRate}% Yield)`;
    demandSummary = `Supply and demand in equilibrium (${borrowers} borrowers, ${investors} investors). Standard yield rate of +${investorRate}%.`;
  }

  return {
    investorRate,
    borrowerRate,
    platformSpread,
    demandScore,
    demandRatio: Math.round(participantRatio * 100) / 100,
    demandLevel,
    demandLabel,
    demandSummary,
    borrowerCount: borrowers,
    investorCount: investors,
  };
}

/**
 * Calculates dynamic interest rates for a given loan pool.
 */
export function calculatePoolDynamicRates(pool: {
  borrowerCount?: number;
  borrowers?: any[];
  investorCount?: number;
  investments?: any[];
  totalTargetAmount?: number;
  amountFunded?: number;
}): DynamicInterestRates {
  const bCount = pool.borrowerCount ?? (pool.borrowers?.length || 0);
  const iCount = pool.investorCount ?? (pool.investments?.length || 0);

  return calculateDynamicRates({
    borrowerCount: bCount,
    investorCount: iCount,
    capitalRequested: pool.totalTargetAmount,
    capitalFunded: pool.amountFunded,
  });
}

/**
 * Computes exact repayment breakdown for a borrower loan tranche.
 * loanAmount: principal requested
 * borrowerRate: dynamic interest percentage (35% - 60%)
 */
export function calculateBorrowerRepayment(
  loanAmount: number,
  borrowerRate: number = 48
): {
  principal: number;
  interestCost: number;
  totalRepayment: number;
  borrowerRate: number;
} {
  const principal = Math.max(0, loanAmount);
  const rate = Math.min(MAX_BORROWER_RATE, Math.max(MIN_BORROWER_RATE, borrowerRate));
  const interestCost = Math.round((principal * rate) / 100);
  const totalRepayment = principal + interestCost;

  return {
    principal,
    interestCost,
    totalRepayment,
    borrowerRate: rate,
  };
}

/**
 * Computes exact payout breakdown for an investor capital contribution.
 * investAmount: capital allocated
 * investorRate: dynamic target yield percentage (20% - 50%)
 */
export function calculateInvestorPayout(
  investAmount: number,
  investorRate: number = 35
): {
  principal: number;
  yieldReturn: number;
  totalPayout: number;
  investorRate: number;
} {
  const principal = Math.max(0, investAmount);
  const rate = Math.min(MAX_INVESTOR_RATE, Math.max(MIN_INVESTOR_RATE, investorRate));
  const yieldReturn = Math.round((principal * rate) / 100);
  const totalPayout = principal + yieldReturn;

  return {
    principal,
    yieldReturn,
    totalPayout,
    investorRate: rate,
  };
}
