import { Badge } from './Badge';

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();
  const tone = normalized.includes('LOW') || normalized.includes('PENDING') || normalized.includes('SUBMITTED') || normalized.includes('MAINTENANCE') ? 'amber' : normalized.includes('CRITICAL') || normalized.includes('REJECTED') || normalized.includes('DAMAGE') || normalized.includes('LOSS') || normalized.includes('OVERDUE') ? 'red' : normalized.includes('APPROVED') || normalized.includes('OK') || normalized.includes('ACTIVE') || normalized.includes('RETURNED') || normalized.includes('OPERATIONAL') ? 'green' : normalized.includes('ISSUED') || normalized.includes('ASSIGNED') ? 'blue' : 'slate';
  return <Badge tone={tone}>{status.replace(/_/g, ' ')}</Badge>;
}
