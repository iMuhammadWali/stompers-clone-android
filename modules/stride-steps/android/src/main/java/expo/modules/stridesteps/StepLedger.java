package expo.modules.stridesteps;

/** Pure accounting core. Counter baselines never represent today's steps. */
public final class StepLedger {
  public String day = "", zone = "";
  public long total = 0, raw = -1, event = -1, boot = -1, unallocated = 0;
  public boolean gap = false;
  public void roll(String nextDay, String nextZone) {
    if (!day.equals(nextDay) || !zone.equals(nextZone)) {
      day = nextDay; zone = nextZone; total = 0; gap = true;
    }
  }
  public void rebaseline() { raw = -1; event = -1; }
  public void counter(long value, long timestamp, long bootId, String date, String tz) {
    if(value < 0 || timestamp < 0) return;
    if(boot == bootId && event >= timestamp) return;
    boolean boundary = !day.equals(date) || !zone.equals(tz);
    long delta = boot == bootId && raw >= 0 && value >= raw ? value - raw : 0;
    roll(date, tz);
    if(boundary) { unallocated += delta; } else { total += delta; }
    raw = value; event = timestamp; boot = bootId;
  }
  public void steps(int count, long timestamp, long bootId, String date, String tz) {
    if(count <= 0 || timestamp < 0 || (boot == bootId && timestamp <= event)) return;
    // Events are delivered in monotonic order; late data must never roll the displayed day back.
    if(!day.isEmpty() && date.compareTo(day) < 0) { gap = true; return; }
    roll(date,tz); total += count; event = timestamp; boot = bootId;
  }
}
