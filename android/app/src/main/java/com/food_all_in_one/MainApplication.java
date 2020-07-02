package com.food_all_in_one;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.gettipsi.stripe.StripeReactPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.geolocation.GeolocationPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.heanoria.library.reactnative.locationenabler.RNAndroidLocationEnablerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.rnfs.RNFSPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import android.util.Log;
import java.util.Arrays;
import java.util.List;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
//import com.facebook.appevents.AppEventsLogger;
import android.content.pm.PackageInfo;
import android.content.pm.Signature;
import android.content.pm.PackageManager;
import android.util.Base64;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new FBSDKPackage(),
            new RNGoogleSigninPackage(),
            new ReactNativeOneSignalPackage(),
            new StripeReactPackage(),
            new AsyncStoragePackage(),
            new GeolocationPackage(),
            new RNFusedLocationPackage(),
            new RNAndroidLocationEnablerPackage(),
            new ReanimatedPackage(),
            new RNFSPackage(),
            new ImageResizerPackage(),
            new ImagePickerPackage(), new VectorIconsPackage(), new MapsPackage(),
          new RNGestureHandlerPackage());
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

//   @Override
//   public void onCreate() {
//     super.onCreate();
//     SoLoader.init(this, /* native exopackage */ false);
//   }
// }
  @Override
  public void onCreate() {
         super.onCreate();
     SoLoader.init(this, /* native exopackage */ false);
    // FacebookSdk.sdkInitialize(getApplicationContext());
//    AppEventsLogger.activateApp(this);
    try {
      PackageInfo info = getPackageManager().getPackageInfo(getPackageName(), PackageManager.GET_SIGNATURES);
      for (Signature signature : info.signatures) {
        MessageDigest md = MessageDigest.getInstance("SHA");
        md.update(signature.toByteArray());
        String hashKey = new String(Base64.encode(md.digest(), 0));
        Log.i("Keyhash", "printHashKey() Hash Key: " + hashKey);
      }
    } catch (NoSuchAlgorithmException e) {
      Log.e("Keyhash", "printHashKey()", e);
    } catch (Exception e) {
      Log.e("Keyhash", "printHashKey()", e);
    }
  }
}
