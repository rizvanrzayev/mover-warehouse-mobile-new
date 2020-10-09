package az.mover.warehouse.android;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import static com.facebook.react.devsupport.JSCHeapCapture.TAG;

public class ScanBroadcastReceiver extends BroadcastReceiver {
    ReactContext reactContext;

    public ScanBroadcastReceiver(ReactContext reactContext) {
        this.reactContext = reactContext;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        String code = "";
        if (intent.getAction() == "com.sunmi.scanner.ACTION_DATA_CODE_RECEIVED") {
            code = intent.getStringExtra("data");
        } else {
            code = intent.getExtras().getString("code");
        }
        WritableMap params = Arguments.createMap();
        params.putString("code", code);
        sendEvent("Scan", params);
    }

    private void sendEvent(String eventName, WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
