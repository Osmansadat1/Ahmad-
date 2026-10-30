import React from 'react';
import { PricingModal, PricingModalProps } from './PricingModal';

export interface PaywallModalProps extends PricingModalProps {}

export const PaywallModal: React.FC<PaywallModalProps> = (props) => {
  return <PricingModal {...props} />;
};

export { PricingModal };
