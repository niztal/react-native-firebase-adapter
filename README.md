# react-native-firebase-adapter


These were my main concepts for creating the adapter for the firebase authentication module (**on Android**):

1. Install Android SDK on the React Native android app (according to [Firebase documentations](https://firebase.google.com/support/guides/firebase-android#update_your_gradle_dependencies_numbered)).
2. Created a new Native Module for the React Native project (according to [Facebook's documentation](https://facebook.github.io/react-native/docs/native-modules-ios.html))
3. Created a new class that extends ReactContextBaseJavaModule (see attached FirebaseAuthAdapter.java) and set a name for it:
   
  ```java
      @Override
      public String getName() {
        return "FirebaseAuth";
      }
  ```

4. Introduced a new field which wraps the Firebase Android SDK Auth instance (FirebaseAuth) and initialize in constructor:

   ```java
   
      import com.google.firebase.auth.FirebaseAuth;
      
      public class FirebaseAuthAdapter extends ReactContextBaseJavaModule {

      private FirebaseAuth mAuth;

      public FirebaseAuthAdapter(ReactApplicationContext reactContext) {
         super(reactContext);
         mAuth = FirebaseAuth.getInstance();
       }
  ```
  
   
5. On this class you can see an example for wrapping a firebase auth method, for example signInAnonymously:

   ```java
   @ReactMethod
   public void signInAnonymously(final Callback successCallback, final Callback errorCallback) {
        Activity currentActivity = getCurrentActivity();

        mAuth.signInAnonymously()
                .addOnCompleteListener(currentActivity, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (task.isSuccessful())
                            successCallback.invoke();
                        else
                            errorCallback.invoke();
                    }
                });
    } 
   ```
   **Pay attention that it must get wrapped with the ReactMethod annotation, this will provide you the ability to call it via the ReactNative JS component**
   
6. So after finishing wrapping all of the auth methods of Firebase, I created a class which implements ReactPackage which will be used mainly to initiate a new adapter so we will be able to register it to our NativeModules (see later).


   ```java
   public class FirebaseAuthAdapterReactPackage implements ReactPackage {
      @Override
      public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
      List<NativeModule> modules = new ArrayList<>();

      modules.add(new FirebaseAuthAdapter(reactContext));

      return modules;
      }
   }
   ```

7. 
  

  







