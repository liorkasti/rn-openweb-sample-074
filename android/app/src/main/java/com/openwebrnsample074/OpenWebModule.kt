package com.openwebrnsample074

import android.util.Log
import com.facebook.react.bridge.*
import spotIm.common.SpotCallback
import spotIm.common.SpotException
import spotIm.common.SpotIm

class OpenWebModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val TAG = "OpenWebModule"
        private const val NAME = "OpenWebSDK"
    }

    override fun getName(): String = NAME

    @ReactMethod
    fun initialize(spotId: String, promise: Promise) {
        Log.d(TAG, "Initializing OpenWeb SDK with spotId: $spotId")
        
        try {
            SpotIm.init(reactApplicationContext, spotId, object : SpotCallback<Unit> {
                override fun onSuccess(response: Unit) {
                    Log.d(TAG, "OpenWeb SDK initialized successfully")
                    promise.resolve(true)
                }

                override fun onFailure(exception: SpotException) {
                    Log.e(TAG, "OpenWeb SDK initialization failed: ${exception.message}")
                    promise.reject("INIT_ERROR", exception.message, exception)
                }
            })
        } catch (e: Exception) {
            Log.e(TAG, "OpenWeb SDK initialization error: ${e.message}")
            promise.reject("INIT_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun getConversationCounters(postId: String, promise: Promise) {
        Log.d(TAG, "Getting conversation counters for postId: $postId")
        
        try {
            SpotIm.getConversationCounters(postId, object : SpotCallback<spotIm.common.options.ConversationCounters> {
                override fun onSuccess(response: spotIm.common.options.ConversationCounters) {
                    val result = Arguments.createMap().apply {
                        putInt("commentsCount", response.commentsCount)
                        putInt("repliesCount", response.repliesCount)
                    }
                    Log.d(TAG, "Conversation counters: comments=${response.commentsCount}, replies=${response.repliesCount}")
                    promise.resolve(result)
                }

                override fun onFailure(exception: SpotException) {
                    Log.e(TAG, "Failed to get conversation counters: ${exception.message}")
                    promise.reject("COUNTERS_ERROR", exception.message, exception)
                }
            })
        } catch (e: Exception) {
            Log.e(TAG, "Error getting conversation counters: ${e.message}")
            promise.reject("COUNTERS_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Required for RN event emitter
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for RN event emitter
    }
}
