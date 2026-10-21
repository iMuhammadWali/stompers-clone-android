/** All players share the same day, regardless of the device timezone. */
export function raceWindow(now=new Date()) {
  const day=new Date(now.getTime()+18000000).toISOString().slice(0,10);
  const start=new Date(`${day}T00:00:00+05:00`);
  return {day,timeZone:'Asia/Karachi',startTime:start.toISOString(),endTime:now.toISOString(),resetsAt:new Date(+start+86400000).toISOString()};
}
