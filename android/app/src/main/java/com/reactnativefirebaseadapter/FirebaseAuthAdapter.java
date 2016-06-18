package com.reactnativefirebaseadapter;

import android.app.Activity;
import android.content.Intent;
import android.support.annotation.NonNull;

import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FacebookAuthProvider;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.auth.FirebaseAuth;

import java.util.ArrayList;
import java.util.List;

public class FirebaseAuthAdapter extends ReactContextBaseJavaModule {

    private FirebaseAuth mAuth;
    private CallbackManager mCallbackManager;

    public FirebaseAuthAdapter(ReactApplicationContext reactContext) {
        super(reactContext);
        mAuth = FirebaseAuth.getInstance();
    }

    @Override
    public String getName() {
        return "FirebaseAuth";
    }

    @ReactMethod
    public void getCurrentUser(final Promise promise) {
        FirebaseUser user = mAuth.getCurrentUser();

        WritableMap map = Arguments.createMap();
        if (user != null) {
            map = Arguments.createMap();
            map.putString("uid", user.getUid());
            map.putString("displayName", user.getDisplayName());
            map.putString("email", user.getEmail());
            if (user.getPhotoUrl() != null)
                map.putString("photoUrl", user.getPhotoUrl().toString());
        }

        promise.resolve(map);
    }

    @ReactMethod
    public void signInAnonymously(final Callback successCallback, final Callback errorCallback) {
        Activity currentActivity = getCurrentActivity();

        mAuth.signInAnonymously()
                .addOnCompleteListener(currentActivity, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (task.isSuccessful()) {
                            if (successCallback != null)
                                successCallback.invoke();
                        }
                        else if(errorCallback != null) {
                            errorCallback.invoke(task.getException().getMessage());
                        }
                    }
                });
    }

    @ReactMethod
    public void createUserWithEmailAndPassword(String email, String password, final Callback successCallback, final Callback errorCallback) {
        Activity currentActivity = getCurrentActivity();

        mAuth.createUserWithEmailAndPassword(email, password)
                .addOnCompleteListener(currentActivity, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (task.isSuccessful()) {
                            if (successCallback != null)
                                successCallback.invoke();
                        }
                        else if(errorCallback != null) {
                                errorCallback.invoke(task.getException().getMessage());
                            }
                    }
                });

    }

    @ReactMethod
    public void signInWithEmailAndPassword(String email, String password, final Callback successCallback, final Callback errorCallback) {
        Activity currentActivity = getCurrentActivity();

        mAuth.signInWithEmailAndPassword(email, password)
                .addOnCompleteListener(currentActivity, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (task.isSuccessful()) {
                            if (successCallback != null)
                                successCallback.invoke();
                        }
                        else if(errorCallback != null) {
                            errorCallback.invoke(task.getException().getMessage());
                        }
                    }
                });
    }

    @ReactMethod
    public void signInWithFacebook(ReadableArray permissions, final Callback successCallback, final Callback errorCallback) {
        try {

            if(!FacebookSdk.isInitialized())
                FacebookSdk.sdkInitialize(this.getReactApplicationContext());

            List<String> permissionsList = new ArrayList<String>();
            for (int i = 0; i < permissions.size(); i++) {
                permissionsList.add(permissions.getString(i));
            }

            LoginManager.getInstance().logInWithReadPermissions(this.getCurrentActivity(), permissionsList);


            mCallbackManager = CallbackManager.Factory.create();

            LoginManager.getInstance().registerCallback(mCallbackManager,
                    new FacebookCallback<LoginResult>() {
                        @Override
                        public void onSuccess(LoginResult loginResults) {
                            if(successCallback != null)
                                successCallback.invoke();
                        }

                        @Override
                        public void onCancel() {
                        }

                        @Override
                        public void onError(FacebookException error) {
                            if(errorCallback != null)
                                errorCallback.invoke(error.getMessage());
                        }
                    });
        }
        catch (Exception e){
            if(errorCallback != null)
                errorCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void signInWithCustomToken(String mCustomToken, final Callback successCallback, final Callback errorCallback) {
        Activity currentActivity = getCurrentActivity();

        mAuth.signInWithCustomToken(mCustomToken)
                .addOnCompleteListener(currentActivity, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (task.isSuccessful()) {
                            if (successCallback != null)
                                successCallback.invoke();
                        }
                        else if(errorCallback != null) {
                            errorCallback.invoke(task.getException().getMessage());
                        }
                    }
                });
    }

    @ReactMethod
    public void handleFacebookAccessToken(String token, final Callback successCallback, final Callback errorCallback) {
        Activity currentActivity = getCurrentActivity();

        AuthCredential credential = FacebookAuthProvider.getCredential(token);
        mAuth.signInWithCredential(credential)
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



    @ReactMethod
    public void signOut() {
        mAuth.signOut();
    }

}
