package expo.modules.stridesteps

import android.Manifest
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build

/** Restores only tracking the user left enabled. Force-stop is intentionally respected. */
class ResumeReceiver: BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    if(intent.action!=Intent.ACTION_BOOT_COMPLETED && intent.action!=Intent.ACTION_MY_PACKAGE_REPLACED) return
    val pending=goAsync()
    Thread {
      try {
        if(StepStore.enabled(context) && StepStore.source(context)=="phone" &&
          (Build.VERSION.SDK_INT<29 || context.checkSelfPermission(Manifest.permission.ACTIVITY_RECOGNITION)==PackageManager.PERMISSION_GRANTED)) {
          context.startForegroundService(Intent(context,StepService::class.java))
        }
      } catch(e: Exception) { StepStore.failure=e.message ?: "Open Stride to resume tracking" }
      finally { pending.finish() }
    }.start()
  }
}
