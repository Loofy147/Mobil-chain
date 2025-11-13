package com.example.aeamc

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST

interface TelemetryService {
    @POST("telemetry")
    suspend fun sendTelemetry(@Body telemetryData: TelemetryData)
}

object NetworkClient {
    private const val BASE_URL = "http://10.0.2.2:3000/"

    val telemetryService: TelemetryService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(TelemetryService::class.java)
    }
}
