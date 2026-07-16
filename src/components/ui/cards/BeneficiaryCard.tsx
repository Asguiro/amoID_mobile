import type { BeneficiarySummary } from '../../../api/types/beneficiary.types';
import {
  BeneficiaryIdentityCard,
  type BeneficiaryIdentityCardProps,
} from './BeneficiaryIdentityCard';

export type BeneficiaryCardProps = BeneficiaryIdentityCardProps;

/**
 * @deprecated Prefer `BeneficiaryIdentityCard` — kept for backward compatibility.
 */
export function BeneficiaryCard(props: BeneficiaryCardProps) {
  return <BeneficiaryIdentityCard {...props} />;
}

export type { BeneficiarySummary };
