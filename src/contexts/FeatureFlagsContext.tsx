
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface FeatureFlags {
  enable2DSeating: boolean;
  enable3DPreview: boolean;
  enableMultiOrg: boolean;
}

interface FeatureFlagsContextType {
  featureFlags: FeatureFlags;
  setFeatureFlag: (flag: keyof FeatureFlags, value: boolean) => void;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined);

export const FeatureFlagsProvider = ({ children }: { children: ReactNode }) => {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>({
    enable2DSeating: true,
    enable3DPreview: false,
    enableMultiOrg: true,
  });

  const setFeatureFlag = (flag: keyof FeatureFlags, value: boolean) => {
    setFeatureFlags(prev => ({ ...prev, [flag]: value }));
  };

  return (
    <FeatureFlagsContext.Provider value={{ featureFlags, setFeatureFlag }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
};
