import React from 'react';
import { 
  ShieldCheck, 
  Tag, 
  MapPin, 
  FileCheck2, 
  Lock, 
  Layers, 
  ArrowUpRight 
} from 'lucide-react';
import { CollateralAsset } from '../types';
import { formatZAR, formatPercent } from '../utils/formatters';

interface CollateralCardProps {
  asset: CollateralAsset;
  onInvestClick?: () => void;
}

export const CollateralCard: React.FC<CollateralCardProps> = ({ asset, onInvestClick }) => {
  return (
    <div className="bg-[#161922] border border-gray-800 hover:border-blue-500/50 rounded-2xl p-5 transition-all shadow-xl hover:shadow-2xl hover:shadow-blue-500/5 flex flex-col justify-between group">
      <div className="space-y-4">
        
        {/* Category & Status Header */}
        <div className="flex items-center justify-between text-xs">
          <span className="px-2.5 py-1 rounded-md bg-blue-900/30 text-blue-400 border border-blue-500/20 font-medium flex items-center space-x-1.5">
            <Tag className="w-3.5 h-3.5" />
            <span>{asset.collateralCategory}</span>
          </span>

          <span className="px-2.5 py-1 rounded-md bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center space-x-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>VAULT VERIFIED</span>
          </span>
        </div>

        {/* Collateral Item Name & Serial Mask */}
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
            {asset.collateralItem}
          </h3>
          <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1 font-mono">
            <Lock className="w-3.5 h-3.5 text-gray-500" />
            <span>Serial: {asset.collateralSerialMasked || 'SN-VERIFIED-991'}</span>
          </div>
        </div>

        {/* Financial Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#0F1117] border border-gray-800/80">
          <div>
            <span className="text-[11px] text-gray-400 block font-sans">Estimated Asset Value</span>
            <span className="text-sm font-bold text-white font-mono">{formatZAR(asset.collateralEstimatedValue)}</span>
          </div>

          <div>
            <span className="text-[11px] text-gray-400 block font-sans">Credit Capital Backed</span>
            <span className="text-sm font-bold text-blue-400 font-mono">{formatZAR(asset.amountRequested)}</span>
          </div>
        </div>

        {/* Collateral Coverage Indicator */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-gray-400">Vault Coverage Ratio</span>
            <span className="text-emerald-400 font-bold">{asset.collateralCoverage}%</span>
          </div>
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (asset.collateralCoverage / 200) * 100)}%` }}
            />
          </div>
        </div>

        {/* Purpose & Location */}
        <div className="pt-1 space-y-1.5 border-t border-gray-800/60 text-xs text-gray-400">
          <p className="line-clamp-1 italic text-gray-300">
            "{asset.purpose || 'Escrow collateral pledged to central liquidity fund'}"
          </p>
          <div className="flex items-center space-x-1.5 text-gray-400 text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            <span className="truncate">{asset.vaultLocation || 'Sandton Central Escrow Depository'}</span>
          </div>
        </div>

      </div>

      {/* Action Button */}
      {onInvestClick && (
        <div className="pt-4 mt-2">
          <button
            onClick={onInvestClick}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
          >
            <span>Fund Central Account</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
