export function formatZAR(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(amount).replace('ZAR', 'R');
}

export function formatPercent(rate: number): string {
  return `${rate}%`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export interface RemainingDaysResult {
  days: number;
  daysRemaining: number;
  isOverdue: boolean;
  isToday: boolean;
  displayText: string;
  label: string;
  badgeClass: string;
}

export function calculateRemainingDays(targetDateString?: string): RemainingDaysResult {
  if (!targetDateString) {
    return {
      days: 30,
      daysRemaining: 30,
      isOverdue: false,
      isToday: false,
      displayText: '30 Days Remaining',
      label: '30 Days Remaining',
      badgeClass: 'bg-blue-900/30 text-blue-400 border-blue-500/30'
    };
  }

  const targetDate = new Date(targetDateString).getTime();
  const now = Date.now();
  const diffMs = targetDate - now;
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (days < 0) {
    const overdueCount = Math.abs(days);
    const txt = `${overdueCount} Day${overdueCount === 1 ? '' : 's'} Overdue`;
    return {
      days: overdueCount,
      daysRemaining: days,
      isOverdue: true,
      isToday: false,
      displayText: txt,
      label: txt,
      badgeClass: 'bg-red-900/40 text-red-400 border-red-500/40 font-bold animate-pulse'
    };
  }

  if (days === 0) {
    return {
      days: 0,
      daysRemaining: 0,
      isOverdue: false,
      isToday: true,
      displayText: 'Due Today',
      label: 'Due Today',
      badgeClass: 'bg-amber-900/40 text-amber-300 border-amber-500/40 font-bold'
    };
  }

  if (days <= 5) {
    const txt = `${days} Day${days === 1 ? '' : 's'} Left`;
    return {
      days,
      daysRemaining: days,
      isOverdue: false,
      isToday: false,
      displayText: txt,
      label: txt,
      badgeClass: 'bg-amber-900/30 text-amber-400 border-amber-500/30 font-bold'
    };
  }

  const txt = `${days} Days Remaining`;
  return {
    days,
    daysRemaining: days,
    isOverdue: false,
    isToday: false,
    displayText: txt,
    label: txt,
    badgeClass: 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30'
  };
}
