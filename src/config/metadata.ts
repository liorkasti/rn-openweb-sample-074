import { Platform } from 'react-native';

declare global {
  var __turboModuleProxy: any;
}

export const getArchitectureInfo = (): string => {
  if (Platform.OS === 'ios') {
    const isTurboModuleEnabled = global.__turboModuleProxy != null;
    return isTurboModuleEnabled ? 'New (Fabric/TurboModules)' : 'Old (Paper)';
  } else if (Platform.OS === 'android') {
    const isTurboModuleEnabled = global.__turboModuleProxy != null;
    return isTurboModuleEnabled ? 'New (Fabric/TurboModules)' : 'Old (Bridge)';
  }
  return 'Unknown';
};

export const APP_METADATA = {
  version: '0.0.1',
  build: '1',
  rnVersion: '0.74.3',
  nativeSDK: 'N/A',
} as const;
