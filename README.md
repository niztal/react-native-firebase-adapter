You can run this react-native application (made for Android)

by running react-native run android.

Make sure that you have a device usb connected (you won't be able to use the android emulator since google-play-services does not support it).

The application contains proof of concepts for:

1. Firebase Anonymous authentication
2. Firebase sign-up via email/password credentials
3. Firebase sign-in via email/password credentials
4. Firebase sign-in via Facebook authentication
5. Save message to DB


# react-native-firebase-adapter


These were my main concepts for creating the adapter for the firebase authentication module (**on Android**):

## Native Module

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

7. Register this ReactPackage on the Android's MainActivity getPackages method:
   

   ```java
   
   @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
                new FirebaseAuthAdapterReactPackage()
        );
    }
   ```
  
Basically, that's it for the native module, now let's see the ReactNative component side..  


## ReactNative component
On the JS side we need to import the registered component by using the NativeModules component of react-native.
   ```javascript
   const {FirebaseAuth} = NativeModules;
   ```
   now you can use its functions, for example signInAnonymously:
   ```javascript
   signIn() {
        FirebaseAuth.signInAnonymously(this.onSuccess.bind(this), this.onFailure.bind(this));
    }
   ```

Pay attention that you may provide some success/failure callbacks.


## FirebaseAuth API:

1. getCurrentUser(final Promise promise) - This native method, gets a promise and only when resolved the JS component will get the user's details (currently supports : userid, name, email, photoURL).
   
   ```javascript
   async function measureLayout() {
      try {
         var {
            uid,
            displayName,
            email,
            photoUrl,
         } = await FirebaseAuth.getCurrentUser();
      }
      catch(e){
         console.log(e);
      }
   ```

2. signInAnonymously(final Callback successCallback, final Callback errorCallback) - This native methods signs in the the current user anonymously. It gets two callbacks, one for success and other for failure:
   ```javascript
   signIn() {
        FirebaseAuth.signInAnonymously(this.onSuccess.bind(this), this.onFailure.bind(this));
    }
    
    onSuccess() {
        Alert.alert("Pay attention that you will be a guest!")
        this.props.navigator.push({
            id: 'message',
        });
    }
    
    onFailure() {
        ToastAndroid.show('Login failed!');
    }
   ```

3. createUserWithEmailAndPassword(String email, String password, final Callback successCallback, final Callback errorCallback) - This native method signs up a new user with given credentials email/password, it also gets two callbacks, one for success and other for failure:
   ```javascript
   signUp(){
        const {email} = this.state;
        const {password} = this.state;
        
        if(email && password) {
            
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(re.test(email)){
                FirebaseAuth.createUserWithEmailAndPassword(email, password, this.onSuccess.bind(this), this.onFailure.bind(this));
            }
            else{
                ToastAndroid.show('Invalid email!', ToastAndroid.SHORT);
            }
        }
        else{
            ToastAndroid.show('Please enter email and password', ToastAndroid.SHORT);
        }
    }
    
    onSuccess() {
        this.props.navigator.push({
            id: 'message',
        });
    }
    
    onFailure(message) {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    }
   ```
   
4. signInWithEmailAndPassword(String email, String password, final Callback successCallback, final Callback errorCallback) - This native method signs in a user with the given credentials email/password, it also gets two callbacks, one for success and other for failure:
   ```javascript
   signIn() {
        const {email} = this.state;
        const {password} = this.state;
        
        if(email && password)
            FirebaseAuth.signInWithEmailAndPassword(email, password, this.onSuccess.bind(this), this.onFailure.bind(this));
        else
            ToastAndroid.show('Please enter email and password', ToastAndroid.SHORT);
    }
    
    onSuccess() {
  
        this.props.navigator.push({
            id: 'message',
        });
    }
    
    onFailure(message) {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    }
   ```
5. handleFacebookAccessToken(String token, final Callback successCallback, final Callback errorCallback) - This native method registers a facebook authenticated user to firebase by getting its token and two callbacks, one for success and other for failure:
It uses another module called react-native-react-native-fbsdk (instructions for installation on this [link's documentations](https://github.com/facebook/react-native-fbsdk)

   ```javascript```
   const FBSDK = require('react-native-fbsdk');
   const {
      LoginButton,
       AccessToken
   } = FBSDK;
   const {FirebaseAuth} = NativeModules;

   export class FacebookLogin extends Component {
       
       
       constructor(props) {
           super(props);
       }
       
       handleLogin(error, result){
           if(error)
               ToastAndroid.show('Login failed!');
           else{
               
               AccessToken.getCurrentAccessToken().then(
                     (data) => {
                       FirebaseAuth.handleFacebookAccessToken(data.accessToken.toString(), this.onSuccess.bind(this), this.onFailure.bind(this));
                     }
                   );
               
           }
       }
       
       onSuccess() {
           this.props.navigator.push({
               id: 'message',
           });
       }
       
       onFailure(message) {
           ToastAndroid.show(message, ToastAndroid.SHORT);
       }
       
       render() {
           return ( 
               
               <View style={styles.fb}>
                   <LoginButton
                       publishPermissions={["publish_actions"]}
                       onLoginFinished={(error, result) => this.handleLogin(error, result)}
                       onLogoutFinished={() => this.signout()}/>
               </View>
           ); 
       }
   }

   ```

6. signOut() - This native method signs out the current user from firebase system.


## Firebase Authentication TODO:

1. Support other OAuth providers API (e.g. Twitter, Google, GitHub).
2. Support custom authentications
3. Link Multiple Auth Providers
4. Update a user's profile
5. Send a password reset email
6. Delete a user
7. Re-authenticate a user

##Firebase DB

I've build another adapter for the firebase DB, right now includes basic operations such as write data and call JS function on change of a value:

1. public void setValue(String ref, ReadableMap value, final Callback successCallback, final Callback errorCallback) - sets a new value to the given ref, gets an object (Pay attention: you must move an object to this method - see how in next JS example):

   ```javascript```
   const {FirebaseDB} = NativeModules;
   submit() {
        FirebaseDB.setValue('messages', {
            message:this.state.message
        }, this.onSuccess.bind(this), this.onFailure.bind(this));
    }
   ```
   
2. public void on(String ref, final String event) - this native method takes care to sync the JS module by getting an event an invoke it once the data value changed.

   ```javascript```
   componentWillMount() {
        DeviceEventEmitter.addListener('onDataChange', this.onDataChange.bind(this));
        FirebaseDB.on('messages', 'onDataChange');
    }
    
    onDataChange(updatedData) {
        ToastAndroid.show('message updated..', ToastAndroid.SHORT);
        this.setState({submittedMessage: updatedData.message});
    }
   ```
3. You may open the simple html page I've made ($/web/index.html), submit new message and see the change reflected on the native app.


### My comments
As a web developer who knows React.js pretty well, working with React Native for developing native apps on both Android/iOS is the best options for me and for many other developers all over the world.

Knowing that the new firebase (ver 3.0 ^) is not working with React-Native made me and many others disapponted, especially after the Firebase team [announced](https://firebase.googleblog.com/2015/05/firebase-now-works-with-react-native_40.html) it publicly after the last Google I/O (2016). 

So, I told myself, "well hey.. Firebase Android SDK works in 100% with ReactNative and ReactNative is native, so why can't I make a simple adapter for it???"

Well, first it sounds easy, but it wasn't, actually after working on this for days I can tell honestly it's a workaround, and I think the firebase team should make for us the React-Native community a JS working SDK ( I believe solving the initializeSDK issue with the document/browser/window issue will be better than making these adapters, I believe that if the old firebase JS SDK worked, the new one will work too).

I really hope this problem will get solved, or someone will make this adapters better!

