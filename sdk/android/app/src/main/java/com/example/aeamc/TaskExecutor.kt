package com.example.aeamc

import kotlinx.coroutines.delay

data class Task(val id: String, val data: String)
data class TaskResult(val taskId: String, val resultData: String)

class TaskExecutor {
    suspend fun executeTask(task: Task): TaskResult {
        // Simulate work
        delay(1000)
        return TaskResult(task.id, "Result for ${task.data}")
    }
}
