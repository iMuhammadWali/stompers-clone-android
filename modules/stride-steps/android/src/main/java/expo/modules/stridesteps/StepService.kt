package expo.modules.stridesteps

import android.Manifest
import android.app.*
import android.content.*
import android.content.pm.PackageManager
import android.content.pm.ServiceInfo
import android.hardware.*
import android.os.*
import java.time.ZoneId

class StepService: Service(), SensorEventListener {
  private lateinit var manager: SensorManager
  private var worker: HandlerThread? = null
  private var wake: PowerManager.WakeLock? = null
  private val detector=ExperimentalDetector()
  private var kind=Sensor.TYPE_STEP_COUNTER
  private var lastClockOffset=0L
  private var detectorDay=""
  override fun onBind(intent: Intent?) = null
  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    if(intent?.action=="STOP") { StepStore.enabled(this,false); stopSelf(); return START_NOT_STICKY }
    if(!StepStore.enabled(this)) { stopSelf(); return START_NOT_STICKY }
    try {
      if(Build.VERSION.SDK_INT>=29 && checkSelfPermission(Manifest.permission.ACTIVITY_RECOGNITION)!=PackageManager.PERMISSION_GRANTED)
        throw SecurityException("Physical activity permission is required")
      val notifications=requireNotNull(getSystemService(NotificationManager::class.java)) {"Notifications unavailable"}
      notifications.createNotificationChannel(NotificationChannel("stride-steps","Step tracking",NotificationManager.IMPORTANCE_LOW))
      val launch=packageManager.getLaunchIntentForPackage(packageName)!!
      val open=PendingIntent.getActivity(this,0,launch,PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
      val stop=PendingIntent.getService(this,1,Intent(this,StepService::class.java).setAction("STOP"),PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
      val estimate=StepStore.mode(this)=="estimate"
      val notification=Notification.Builder(this,"stride-steps").setSmallIcon(android.R.drawable.ic_menu_compass)
        .setContentTitle(if(estimate) "Stride · experimental step estimate" else "Stride · phone step tracking")
        .setContentText("Counting while carried. Tap to open; Stop ends tracking.").setContentIntent(open)
        .setOngoing(true).addAction(Notification.Action.Builder(null,"Stop",stop).build()).build()
      if(Build.VERSION.SDK_INT>=34) startForeground(741,notification,ServiceInfo.FOREGROUND_SERVICE_TYPE_HEALTH) else startForeground(741,notification)
      if(StepStore.running) return START_STICKY
      manager=requireNotNull(getSystemService(SensorManager::class.java)) {"Motion sensors unavailable"}
      kind=when(StepStore.mode(this)) { "counter"->Sensor.TYPE_STEP_COUNTER; "detector"->Sensor.TYPE_STEP_DETECTOR; else->Sensor.TYPE_ACCELEROMETER }
      val sensor=(manager.getDefaultSensor(kind,true) ?: manager.getDefaultSensor(kind)) ?: throw IllegalStateException("Selected sensor is unavailable")
      worker=HandlerThread("stride-step-sensor").also{it.start()}
      lastClockOffset=System.currentTimeMillis()-SystemClock.elapsedRealtime()
      if(estimate || (kind==Sensor.TYPE_STEP_DETECTOR && !sensor.isWakeUpSensor)) {
        wake=(getSystemService(POWER_SERVICE) as PowerManager).newWakeLock(PowerManager.PARTIAL_WAKE_LOCK,"Stride:Steps").apply {setReferenceCounted(false);acquire()}
      }
      check(manager.registerListener(this,sensor,if(estimate) 40_000 else SensorManager.SENSOR_DELAY_NORMAL,0,Handler(worker!!.looper))) {"Could not register step sensor"}
      StepStore.failure=null; StepStore.running=true
      return START_STICKY
    } catch(e: Exception) { StepStore.failure=e.message ?: "Tracking could not start"; stopSelf(); return START_NOT_STICKY }
  }
  override fun onSensorChanged(e: SensorEvent) {
    try {
      if(Build.VERSION.SDK_INT>=29 && checkSelfPermission(Manifest.permission.ACTIVITY_RECOGNITION)!=PackageManager.PERMISSION_GRANTED) throw SecurityException("Physical activity permission was removed")
      val offset=System.currentTimeMillis()-SystemClock.elapsedRealtime()
      if(kotlin.math.abs(offset-lastClockOffset)>60_000) {
        StepStore.update(this){it.rebaseline();it.gap=true}; detector.reset();lastClockOffset=offset
      }
      val eventMillis=e.timestamp/1_000_000
      if(eventMillis>SystemClock.elapsedRealtime()+1000) return
      val wall=eventMillis+offset
      val day=StepStore.day(wall); val zone=ZoneId.systemDefault().id;val boot=StepStore.boot(this)
      if(day!=StepStore.day(System.currentTimeMillis())) return
      if(kind==Sensor.TYPE_STEP_COUNTER) {
        val raw=e.values[0].toDouble()
        if(!raw.isFinite() || raw<0 || raw!=kotlin.math.floor(raw)) return
        StepStore.update(this){ l ->
          if(l.day.isNotEmpty() && day<l.day) {l.roll(day,zone);l.rebaseline();l.gap=true}
          l.counter(raw.toLong(),e.timestamp,boot,day,zone)
        }
      } else {
        if(kind==Sensor.TYPE_ACCELEROMETER && detectorDay!=day+zone) {detector.reset();detectorDay=day+zone}
        val count=if(kind==Sensor.TYPE_STEP_DETECTOR) {if(e.values[0]==1f) 1 else 0} else detector.sample(e.timestamp,e.values[0].toDouble(),e.values[1].toDouble(),e.values[2].toDouble())
        if(count>0) StepStore.update(this){
          if(it.day.isNotEmpty() && day<it.day) {it.roll(day,zone);it.rebaseline();it.gap=true}
          it.steps(count,e.timestamp,boot,day,zone)
        }
      }
    } catch(e: Exception) { StepStore.failure=e.message ?: "Step tracking stopped";stopSelf() }
  }
  override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
  override fun onDestroy() {
    if(::manager.isInitialized) manager.unregisterListener(this)
    worker?.quitSafely(); worker=null
    wake?.let{if(it.isHeld) it.release()};wake=null
    StepStore.running=false
    stopForeground(STOP_FOREGROUND_REMOVE)
    super.onDestroy()
  }
}
