package expo.modules.stridesteps

import android.content.Intent
import android.hardware.Sensor
import android.hardware.SensorManager
import android.os.Build
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class StrideStepsModule: Module() {
  private fun context()=requireNotNull(appContext.reactContext){"App context unavailable"}
  override fun definition() = ModuleDefinition {
    Name("StrideSteps")
    AsyncFunction("snapshot") { StepStore.snapshot(context()) }
    AsyncFunction("capabilities") {
      val m=requireNotNull(context().getSystemService(SensorManager::class.java)) {"Motion sensors unavailable"}
      mapOf("counter" to (m.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)!=null),"detector" to (m.getDefaultSensor(Sensor.TYPE_STEP_DETECTOR)!=null),"estimate" to (m.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)!=null))
    }
    AsyncFunction("start") { estimate: Boolean ->
      val c=context();val m=requireNotNull(c.getSystemService(SensorManager::class.java)) {"Motion sensors unavailable"}
      val mode=when {
        m.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)!=null->"counter"
        m.getDefaultSensor(Sensor.TYPE_STEP_DETECTOR)!=null->"detector"
        estimate && m.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)!=null->"estimate"
        else->throw IllegalStateException("No hardware step sensor. Experimental estimation requires explicit opt-in.")
      }
      if(!StepStore.running) {
        StepStore.update(c){it.rebaseline();it.gap=true};StepStore.mode(c,mode);StepStore.enabled(c,true);StepStore.failure=null
        try {
          val intent=Intent(c,StepService::class.java)
          if(Build.VERSION.SDK_INT>=26) c.startForegroundService(intent) else c.startService(intent)
        } catch(e: Exception) {StepStore.enabled(c,false);throw e}
      }
      StepStore.source(c,"phone")
      StepStore.snapshot(c)
    }
    AsyncFunction("stop") {
      val c=context();StepStore.enabled(c,false);c.stopService(Intent(c,StepService::class.java));StepStore.snapshot(c)
    }
    AsyncFunction("useHealth") {
      val c=context();StepStore.enabled(c,false);c.stopService(Intent(c,StepService::class.java));StepStore.source(c,"health")
    }
  }
}
