package expo.modules.stridesteps;

/** Original experimental magnitude/peak-valley detector, not a reproduction of a published model.
 * Requires four rhythmic candidates; first short bouts may be missed. Rhythmic shaking can fool it.
 */
public final class ExperimentalDetector {
  private long last = -1, candidate = -1, valleyTime = -1;
  private double gravity, smooth, envelope = .6, valley = 0, period = -1;
  private boolean armed;
  private int bout;
  public int sample(long nanos, double x, double y, double z) {
    double magnitude = Math.sqrt(x*x+y*y+z*z);
    if(!Double.isFinite(magnitude) || magnitude < 1 || magnitude > 45 || nanos < 0) { reset(); return 0; }
    if(last < 0 || nanos-last > 250_000_000L || nanos <= last) {
      reset(); last=nanos; gravity=magnitude; return 0;
    }
    double dt=(nanos-last)/1e9; last=nanos;
    gravity += (1-Math.exp(-dt/1.2))*(magnitude-gravity);
    smooth += (1-Math.exp(-dt/.055))*((magnitude-gravity)-smooth);
    envelope += (1-Math.exp(-dt/2))*(Math.abs(smooth)-envelope);
    double threshold=Math.max(.55,Math.min(2.5,envelope*.9));
    if(smooth < -threshold) { if(!armed || smooth < valley) {valley=smooth;valleyTime=nanos;} armed=true; }
    if(!armed || smooth < threshold) return 0;
    armed=false;
    if(nanos-valleyTime > 800_000_000L || smooth-valley < threshold*2) return 0;
    long interval=nanos-candidate;
    if(candidate>=0 && interval<280_000_000L) return 0;
    if(candidate<0 || interval>1_500_000_000L) { bout=0;period=-1; }
    else if(period>0 && (interval<period*.65 || interval>period*1.55)) { bout=0;period=-1; }
    else period=period<0?interval:period*.75+interval*.25;
    candidate=nanos; bout++;
    return bout==4?4:bout>4?1:0;
  }
  public void reset() { last=-1;candidate=-1;valleyTime=-1;gravity=0;smooth=0;envelope=.6;valley=0;period=-1;armed=false;bout=0; }
}
