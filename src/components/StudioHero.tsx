import React from 'react';
import { StudioWorkspace, StudioWorkspaceProps } from './StudioWorkspace';

export type StudioRoomPill = 'Studio' | 'Living Room' | 'Bedroom' | 'Bathroom' | 'Kitchen';
export type StudioStylePill = 'Japandi' | 'Organic Modern' | 'Cozy Modern' | 'Quiet Luxury';

export interface StudioHeroProps extends StudioWorkspaceProps {}

export const StudioHero: React.FC<StudioHeroProps> = (props) => {
  return <StudioWorkspace {...props} />;
};

export { StudioWorkspace };
