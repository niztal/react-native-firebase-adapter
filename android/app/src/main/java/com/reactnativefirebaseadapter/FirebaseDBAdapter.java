package com.reactnativefirebaseadapter;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.PromiseImpl;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

import com.facebook.react.bridge.ReadableNativeMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by nitzan.tal2 on 16/06/2016.
 */
public class FirebaseDBAdapter extends ReactContextBaseJavaModule {

    private DatabaseReference mDatabase;
    private ReactApplicationContext reactContext;

    public FirebaseDBAdapter(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        mDatabase = FirebaseDatabase.getInstance().getReference();
    }

    @Override
    public String getName() {
        return "FirebaseDB";
    }

    @ReactMethod
    public void setValue(String ref, ReadableMap value, final Callback successCallback, final Callback errorCallback) {
        try {
            DatabaseReference dbRef = mDatabase.child(ref);

            dbRef.setValue(((ReadableNativeMap)value).toHashMap());

            successCallback.invoke();
        }
        catch (Exception e){
            errorCallback.invoke(e.getMessage());
        }

    }

    @ReactMethod
    public void on(String ref, String event, final Promise promise) {
        try {
            DatabaseReference dbRef = mDatabase.child(ref);

            ValueEventListener eventListener = new ValueEventListener() {
                @Override
                public void onDataChange(DataSnapshot dataSnapshot) {
                    if(dataSnapshot.getValue() != null) {
                        promise.resolve(convertToWriteableMap((Map<String, Object>) dataSnapshot.getValue()));
//                        successCallback.invoke(convertToWriteableMap((Map<String, Object>) dataSnapshot.getValue()));
                    }
                }

                @Override
                public void onCancelled(DatabaseError databaseError) {
                    promise.reject("" + databaseError.getCode(), databaseError.getMessage());
                }
            };

            dbRef.addValueEventListener(eventListener);
        }
        catch (Exception e){
            promise.reject(e);
        }
    }

    private WritableMap convertToWriteableMap(Map<String, Object> map) {
        WritableMap writableMap = Arguments.createMap();

        for(Map.Entry<String, Object> mapEntry : map.entrySet()){
            String key = mapEntry.getKey();
            Object value = mapEntry.getValue();

            if(value.getClass().isArray()){
                writableMap.putArray(key, convertToWriteableArray((Object[]) value));
            }
            else {
                switch (value.getClass().getSimpleName()) {
                    case "Boolean":
                        writableMap.putBoolean(key, (Boolean) value);
                        break;
                    case "Double":
                        writableMap.putDouble(key, (Double) value);
                        break;
                    case "Integer":
                        writableMap.putInt(key, (Integer) value);
                        break;
                    case "String":
                        writableMap.putString(key, (String) value);
                        break;
                    case "Map":
                        writableMap.putMap(key, convertToWriteableMap((Map<String, Object>) value));
                        break;
                    default:
                        throw new IllegalArgumentException("Could not convert object with key: " + key + ".");
                }
            }
        }
        return writableMap;
    }

    private WritableArray convertToWriteableArray(Object[] value) {
        WritableArray writeAbleArray = Arguments.createArray();

        for(Object o : value){
            switch (o.getClass().getSimpleName()){
                case "Boolean":
                    writeAbleArray.pushBoolean((Boolean) o);
                    break;
                case "Double":
                    writeAbleArray.pushDouble((Double) o);
                    break;
                case "Integer":
                    writeAbleArray.pushDouble((Integer) o);
                    break;
                case "String":
                    writeAbleArray.pushString((String) o);
                    break;
                case "Map":
                    writeAbleArray.pushMap(convertToWriteableMap((Map<String, Object>) o));
                    break;
                default:
                    throw new IllegalArgumentException("Could not convert object with value: " + o + ".");
            }
        }

        return writeAbleArray;
    }

    private static Map<String, Object> convertMap(ReadableMap readableMap) {
        Map<String, Object> object = new HashMap<String, Object>();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            switch (readableMap.getType(key)) {
                case Null:
                    object.put(key, null);
                    break;
                case Boolean:
                    object.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    object.put(key, readableMap.getDouble(key));
                    break;
                case String:
                    object.put(key, readableMap.getString(key));
                    break;
                case Map:
                    object.put(key, convertMap(readableMap.getMap(key)));
                    break;
                case Array:
                    object.put(key, convertArray(readableMap.getArray(key)));
                    break;
            }
        }
        return object;
    }

    private static List<Object> convertArray(ReadableArray readableArray) {
        List<Object> list = new ArrayList<Object>();
        for (int i = 0; i < readableArray.size(); i++) {
            switch (readableArray.getType(i)) {
                case Null:
                    break;
                case Boolean:
                    list.add(readableArray.getBoolean(i));
                    break;
                case Number:
                    list.add(readableArray.getDouble(i));
                    break;
                case String:
                    list.add(readableArray.getString(i));
                    break;
                case Map:
                    list.add(convertMap(readableArray.getMap(i)));
                    break;
                case Array:
                    list.add(convertArray(readableArray.getArray(i)));
                    break;
            }
        }
        return list;
    }
}
