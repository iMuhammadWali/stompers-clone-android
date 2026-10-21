package expo.modules.stridesteps

import android.content.Context
import android.provider.Settings
import org.json.JSONObject
import java.time.Instant
import java.time.ZoneId

internal object StepStore {
  private const val PREF = "stride-phone-steps-v1"
  @Volatile var running = false
  @Volatile var failure: String? = null
  private fun prefs(c: Context) = c.getSharedPreferences(PREF, Context.MODE_PRIVATE)
  fun boot(c: Context): Long = Settings.Global.getInt(c.contentResolver, Settings.Global.BOOT_COUNT, -1).toLong()
  fun day(time: Long): String = Instant.ofEpochMilli(time).atZone(ZoneId.of("Asia/Karachi")).toLocalDate().toString()
  @Synchronized fun load(c: Context): StepLedger {
    val saved=prefs(c).getString("ledger",null) ?: return StepLedger()
    val j=JSONObject(saved)
    check(j.has("day") && j.has("total") && j.getLong("total")>=0 && j.optLong("raw",-1)>=-1) {"Saved phone steps are invalid"}
    return StepLedger().apply {
      day=j.optString("day"); zone=j.optString("zone"); total=j.optLong("total"); raw=j.optLong("raw",-1)
      event=j.optLong("event",-1); boot=j.optLong("boot",-1); gap=j.optBoolean("gap"); unallocated=j.optLong("unallocated")
    }
  }
  @Synchronized fun save(c: Context, l: StepLedger) {
    val j=JSONObject().put("day",l.day).put("zone",l.zone).put("total",l.total).put("raw",l.raw)
      .put("event",l.event).put("boot",l.boot).put("gap",l.gap).put("unallocated",l.unallocated)
    check(prefs(c).edit().putString("ledger",j.toString()).commit()) { "Could not save step count" }
  }
  @Synchronized fun update(c: Context, action: (StepLedger)->Unit) { val l=load(c); action(l); save(c,l) }
  fun source(c: Context) = prefs(c).getString("source","health") ?: "health"
  fun source(c: Context, value: String) { check(prefs(c).edit().putString("source",value).commit()) }
  fun mode(c: Context) = prefs(c).getString("mode","counter") ?: "counter"
  fun mode(c: Context, value: String) { check(prefs(c).edit().putString("mode",value).commit()) }
  fun enabled(c: Context) = prefs(c).getBoolean("enabled",false)
  fun enabled(c: Context, value: Boolean) { check(prefs(c).edit().putBoolean("enabled",value).commit()) }
  fun snapshot(c: Context): Map<String, Any?> {
    val l=load(c); val now=System.currentTimeMillis(); val today=day(now)
    return mapOf("source" to source(c), "mode" to mode(c), "running" to running, "enabled" to enabled(c),
      "steps" to if(l.day==today && l.zone==ZoneId.of("Asia/Karachi").id) l.total else 0L,
      "day" to today, "gap" to (l.gap || l.day!=today), "unallocated" to l.unallocated, "error" to failure)
  }
}
