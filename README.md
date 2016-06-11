# react-native-firebase-adapter


These are the main concepts for creating the adapter for the firebase authentication module (made on Android):

1. Install Android SDK on the React Native android app (according to [Firebase documentations](https://firebase.google.com/support/guides/firebase-android#update_your_gradle_dependencies_numbered)).
2. Now you will need create a new Native Module for the React Native project (according to [Facebook's documentation](https://facebook.github.io/react-native/docs/native-modules-ios.html))
3. Create a new class that extends ReactContextBaseJavaModule (see attached FirebaseAuthAdapter.java) and set a name for it:
   
  ```java
      @Override
      public String getName() {
        return "FirebaseAuth";
      }
  ```

4. Introduce a new field which wraps the Firebase Android SDK Auth instance (FirebaseAuth) and initialize in constructor:

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
5. 
  

  







