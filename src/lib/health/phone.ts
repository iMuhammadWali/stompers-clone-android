export type PhoneSnapshot={source:'health'|'phone';mode:'counter'|'detector'|'estimate';running:boolean;enabled:boolean;steps:number;day:string;gap:boolean;unallocated:number;error:string|null};
export type PhoneBridge={snapshot():Promise<PhoneSnapshot>;capabilities():Promise<{counter:boolean;detector:boolean;estimate:boolean}>;start(estimate:boolean):Promise<PhoneSnapshot>;stop():Promise<PhoneSnapshot>;useHealth():Promise<void>};
export function getPhoneBridge():PhoneBridge|null{return null;}
export async function requestActivityPermission(){return false;}
