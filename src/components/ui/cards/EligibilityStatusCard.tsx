import type { BeneficiaryCoverageStatus } from '../../../api/types/beneficiary.types';
import { EligibilityCard, type EligibilityCardProps } from './EligibilityCard';

export type EligibilityStatusCardProps = EligibilityCardProps;

/**
 * @deprecated Prefer `EligibilityCard` — kept for backward compatibility.
 */
export function EligibilityStatusCard(props: EligibilityStatusCardProps) {
  return <EligibilityCard {...props} />;
}

export type { BeneficiaryCoverageStatus };
