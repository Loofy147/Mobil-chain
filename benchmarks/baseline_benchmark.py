import multiprocessing
import time
import random

# --- Task Simulation ---

def simulate_image_classification(image_data):
    """Simulates the computation for an image classification task."""
    # Simulate processing time (e.g., 50-150ms)
    time.sleep(random.uniform(0.05, 0.15))
    # Simulate generating a result
    return {"class": random.choice(["cat", "dog", "car"]), "confidence": random.random()}

# --- Worker Simulation ---

def worker(task_queue, result_queue):
    """A worker process that continuously takes tasks and processes them."""
    while True:
        task = task_queue.get()
        if task is None:  # Sentinel value to stop the worker
            break
        result = simulate_image_classification(task)
        result_queue.put(result)

# --- Main Benchmark ---

def run_benchmark(num_workers, num_tasks):
    """Runs the benchmark with a given number of workers and tasks."""
    print(f"--- Running Benchmark ---")
    print(f"Workers: {num_workers}, Tasks: {num_tasks}\n")

    task_queue = multiprocessing.Queue()
    result_queue = multiprocessing.Queue()

    # Create and start worker processes
    processes = []
    for _ in range(num_workers):
        p = multiprocessing.Process(target=worker, args=(task_queue, result_queue))
        processes.append(p)
        p.start()

    # --- Performance Metrics ---
    start_time = time.time()

    # Add tasks to the queue
    for i in range(num_tasks):
        task_queue.put(f"image_data_{i}")

    # Stop workers by sending sentinel values
    for _ in range(num_workers):
        task_queue.put(None)

    # Wait for all processes to complete
    for p in processes:
        p.join()

    end_time = time.time()
    total_time = end_time - start_time

    # --- Results ---
    throughput = num_tasks / total_time

    # --- Simulated Energy Consumption ---
    # (Assuming a constant power draw per worker)
    power_per_worker = 2.5  # Watts (example value)
    total_energy_wh = (power_per_worker * num_workers * total_time) / 3600

    print("--- Benchmark Results ---")
    print(f"Total Time: {total_time:.2f} seconds")
    print(f"Throughput: {throughput:.2f} tasks/sec")
    print(f"Simulated Energy: {total_energy_wh:.4f} Wh")
    print("-" * 25)

if __name__ == "__main__":
    # --- Configuration ---
    NUM_WORKERS = multiprocessing.cpu_count()  # Use all available CPU cores
    NUM_TASKS = 1000

    run_benchmark(NUM_WORKERS, NUM_TASKS)
