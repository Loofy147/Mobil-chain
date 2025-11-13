package com.example.aeamc

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST

import retrofit2.http.GET

interface ApiService {
    @POST("telemetry")
    suspend fun sendTelemetry(@Body telemetryData: TelemetryData)

    @GET("task")
    suspend fun getTask(): Task

    @POST("proof")
    suspend fun submitProof(@Body proof: ProofOfTask)
}

object NetworkClient {
    private const val BASE_URL = "http://10.0.2.2:3000/"

    val apiService: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}
