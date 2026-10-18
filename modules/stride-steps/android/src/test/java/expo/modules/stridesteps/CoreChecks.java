package expo.modules.stridesteps;
public class CoreChecks {
 static int assertions;
 static void check(boolean pass,String message){assertions++;if(!pass)throw new AssertionError(message);}
 static int trace(double hz,double amplitude,int duration,boolean rotate){
   ExperimentalDetector d=new ExperimentalDetector();int count=0;
   for(int i=0;i<duration*25;i++){
     double t=i/25.;double m=9.81+amplitude*Math.sin(2*Math.PI*hz*t);
     double angle=rotate?t*2:0;count+=d.sample(i*40_000_000L,m*Math.sin(angle),0,m*Math.cos(angle));
   }return count;
 }
 public static void main(String[] args){
   StepLedger l=new StepLedger();l.counter(5000,10,1,"2026-10-17","UTC");check(l.total==0,"First lifetime counter is baseline");
   l.counter(5020,20,1,"2026-10-17","UTC");check(l.total==20,"Counter delta");
   l.counter(5020,20,1,"2026-10-17","UTC");check(l.total==20,"Duplicate event ignored");
   l.counter(6000,19,1,"2026-10-17","UTC");check(l.total==20,"Out of order ignored");
   l.counter(5030,30,1,"2026-10-18","UTC");check(l.total==0&&l.unallocated==10,"Midnight ambiguous delta excluded");
   l.counter(5038,40,1,"2026-10-18","UTC");check(l.total==8,"New day continues");
   l.counter(5,1,2,"2026-10-18","UTC");check(l.total==8,"Reboot baseline, keeps today count");
   l.counter(10,2,2,"2026-10-18","UTC");check(l.total==13,"Post reboot delta");
   l.counter(2,3,2,"2026-10-18","UTC");check(l.total==13,"Counter rollback baseline");
   l.rebaseline();l.counter(100,4,2,"2026-10-18","UTC");check(l.total==13,"Paused gap never imported");
   l.counter(110,5,2,"2026-10-18","Europe/Paris");check(l.total==0&&l.gap,"Timezone change conservative reset");
   l.steps(1,6,2,"2026-10-18","Europe/Paris");check(l.total==1,"Detector increments");
   l.steps(1,6,2,"2026-10-18","Europe/Paris");check(l.total==1,"Detector duplicate");
   l.steps(1,7,2,"2026-10-17","Europe/Paris");check(l.total==1,"Late previous day ignored");
   l.counter(-1,8,2,"2026-10-18","Europe/Paris");check(l.total==1,"Invalid count ignored");
   l.roll("2026-10-17","Europe/Paris");l.rebaseline();l.counter(150,10,2,"2026-10-17","Europe/Paris");l.counter(153,11,2,"2026-10-17","Europe/Paris");check(l.total==3,"Explicit backward clock reset recovers with fresh baseline");
   check(trace(0,0,30,false)==0,"Stationary");check(trace(1,.1,30,false)==0,"Small oscillations");
   for(double hz:new double[]{1,1.5,2,2.8}){
     int n=trace(hz,2,30,false);int expected=(int)(hz*30);
     check(Math.abs(n-expected)<=2,"Synthetic cadence "+hz+": "+n+"/"+expected);
     check(trace(hz,2,30,true)==n,"Rotation magnitude invariance "+hz);
     System.out.println("Synthetic "+hz+" Hz: "+n+" / "+expected);
   }
   ExperimentalDetector d=new ExperimentalDetector();int n=0;
   for(int i=0;i<1000;i++){double m=i==200?25:9.81;n+=d.sample(i*40_000_000L,0,0,m);}check(n==0,"Isolated bump rejected");
   check(d.sample(5,Double.NaN,0,0)==0,"NaN rejected");
   check(d.sample(6,Double.POSITIVE_INFINITY,0,0)==0,"Infinity rejected");
   // Rhythmic shaking is mathematically indistinguishable in this simple magnitude detector.
   check(trace(2,2,30,false)>0,"Known shaking confound remains disclosed");
   System.out.println(assertions+" native-core checks passed. Synthetic signals are not physical accuracy validation.");
 }
}
