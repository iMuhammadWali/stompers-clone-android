const {withAndroidManifest,withDangerousMod,AndroidConfig}=require('@expo/config-plugins');
const fs=require('node:fs/promises');const path=require('node:path');
const rationale='androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE';
module.exports=function withHealthPrivacy(config){
  config=withAndroidManifest(config,c=>{
    const app=AndroidConfig.Manifest.getMainApplicationOrThrow(c.modResults);
    const main=AndroidConfig.Manifest.getMainActivityOrThrow(c.modResults);
    main['intent-filter']=(main['intent-filter']||[]).filter(f=>!(f.action||[]).some(a=>a.$['android:name']===rationale));
    app.activity=app.activity||[];
    app.activity=app.activity.filter(a=>a.$['android:name']!=='.HealthPermissionsActivity');
    app.activity.push({$:{'android:name':'.HealthPermissionsActivity','android:exported':'true'},'intent-filter':[{action:[{$:{'android:name':rationale}}]}]});
    app['activity-alias']=(app['activity-alias']||[]).filter(a=>a.$['android:name']!=='ViewPermissionUsageActivity');
    app['activity-alias'].push({$:{'android:name':'ViewPermissionUsageActivity','android:exported':'true','android:targetActivity':'.HealthPermissionsActivity','android:permission':'android.permission.START_VIEW_PERMISSION_USAGE'},'intent-filter':[{action:[{$:{'android:name':'android.intent.action.VIEW_PERMISSION_USAGE'}}],category:[{$:{'android:name':'android.intent.category.HEALTH_PERMISSIONS'}}]}]});
    return c;
  });
  return withDangerousMod(config,['android',async c=>{
    const pkg=c.android.package;const directory=path.join(c.modRequest.platformProjectRoot,'app/src/main/java',...pkg.split('.'));
    await fs.mkdir(directory,{recursive:true});
    await fs.writeFile(path.join(directory,'HealthPermissionsActivity.kt'),`package ${pkg}
import android.app.Activity
import android.os.Bundle
import android.widget.ScrollView
import android.widget.TextView
class HealthPermissionsActivity : Activity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    val content = TextView(this).apply {
      text = "Your step data\\n\\nStride reads your step total for today from Health Connect to show your personal race and character.\\n\\nStride requests read-only Steps access. It does not write health data, read other health categories, or upload your step totals. Health data is kept on this device and is refreshed while the race screen is open.\\n\\nOptional phone tracking uses Physical activity permission and an ongoing notification. Phone counts start when you enable tracking. Experimental accelerometer estimates can be inaccurate and use more battery. Stop tracking from the app or its notification. Phone tracking does not require Health Connect.\\n\\nYour health app must share steps with Health Connect. You can remove Stride's access at any time in Health Connect settings."
      textSize = 18f
      setPadding(32, 48, 32, 48)
    }
    setContentView(ScrollView(this).apply { addView(content) })
  }
}
`);
    return c;
  }]);
};
