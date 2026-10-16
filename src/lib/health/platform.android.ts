import type {HealthBridge} from './service';
export async function getHealthBridge():Promise<HealthBridge|null> {
  try {
    const hc=await import('react-native-health-connect');
    return {
      getSdkStatus:()=>hc.getSdkStatus(),initialize:()=>hc.initialize(),
      getGrantedPermissions:()=>hc.getGrantedPermissions(),
      requestPermission:permissions=>hc.requestPermission(permissions),
      aggregateRecord:request=>hc.aggregateRecord(request),
      openHealthConnectSettings:()=>hc.openHealthConnectSettings(),
    };
  } catch {return null;}
}
