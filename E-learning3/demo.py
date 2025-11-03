import time
import math
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor, as_completed
import asyncio
import os

def io_bound_task(duration, idx):
    time.sleep(duration)
    return f"IO {idx} done ({duration}s)"

async def aio_bound_task(duration, idx):
    await asyncio.sleep(duration)
    return f"AIO {idx} done ({duration}s)"

def is_prime(n):
    if n < 2:
        return False
    if n % 2 == 0:
        return n == 2
    r = int(math.sqrt(n))
    for i in range(3, r + 1, 2):
        if n % i == 0:
            return False
    return True

def cpu_bound_task(n):
    s = 0
    for i in range(2, n + 1):
        if is_prime(i):
            s += i
    return s

def measure(func, *args, repeat=1, **kwargs):
    t0 = time.perf_counter()
    result = None
    for _ in range(repeat):
        result = func(*args, **kwargs)
    t1 = time.perf_counter()
    return t1 - t0, result

def run_sync_io(tasks):
    results = []
    for d, idx in tasks:
        results.append(io_bound_task(d, idx))
    return results

def run_sync_cpu(params):
    results = []
    for n in params:
        results.append(cpu_bound_task(n))
    return results

def run_threadpool_io(tasks, max_workers=10):
    results = []
    with ThreadPoolExecutor(max_workers=max_workers) as ex:
        futures = [ex.submit(io_bound_task, d, idx) for d, idx in tasks]
        for fut in as_completed(futures):
            results.append(fut.result())
    return results

def run_processpool_cpu(params, max_workers=None):
    results = []
    with ProcessPoolExecutor(max_workers=max_workers) as ex:
        futures = [ex.submit(cpu_bound_task, n) for n in params]
        for fut in as_completed(futures):
            results.append(fut.result())
    return results

async def run_asyncio_io(tasks, concurrency_limit=100):
    sem = asyncio.Semaphore(concurrency_limit)
    async def sem_task(d, idx):
        async with sem:
            return await aio_bound_task(d, idx)
    coros = [sem_task(d, idx) for d, idx in tasks]
    results = await asyncio.gather(*coros)
    return results

def run_threadpool_cpu(params, max_workers=4):
    results = []
    with ThreadPoolExecutor(max_workers=max_workers) as ex:
        futures = [ex.submit(cpu_bound_task, n) for n in params]
        for fut in as_completed(futures):
            results.append(fut.result())
    return results

def os_cpu_count():
    try:
        return os.cpu_count() or 2
    except Exception:
        return 2

def scenario_io(num_tasks=10, task_duration=0.5):
    tasks = [(task_duration, i) for i in range(num_tasks)]
    print(f"\n--- IO-bound scenario: {num_tasks} tasks, each {task_duration}s ---")
    t_sync, _ = measure(run_sync_io, tasks)
    print(f"Sync total: {t_sync:.3f}s")
    t_thread, _ = measure(run_threadpool_io, tasks, max_workers=min(32, num_tasks))
    print(f"ThreadPool total: {t_thread:.3f}s")
    t_async, _ = measure(lambda: asyncio.run(run_asyncio_io(tasks, concurrency_limit=num_tasks)))
    print(f"asyncio total: {t_async:.3f}s")
    return {"sync": t_sync, "thread": t_thread, "asyncio": t_async}

def scenario_cpu(num_tasks=4, n=20000):
    params = [n for _ in range(num_tasks)]
    print(f"\n--- CPU-bound scenario: {num_tasks} tasks, each sum_primes({n}) ---")
    t_sync, _ = measure(run_sync_cpu, params)
    print(f"Sync total: {t_sync:.3f}s")
    t_threadcpu, _ = measure(run_threadpool_cpu, params, max_workers=min(8, num_tasks))
    print(f"ThreadPool (CPU) total: {t_threadcpu:.3f}s")
    t_process, _ = measure(run_processpool_cpu, params, max_workers=min(os_cpu_count(), num_tasks))
    print(f"ProcessPool total: {t_process:.3f}s")
    return {"sync": t_sync, "thread_cpu": t_threadcpu, "process": t_process}

if __name__ == '__main__':
    print("Demo lập trình bất đồng bộ - IO-bound vs CPU-bound\n")
    res_io = scenario_io(num_tasks=12, task_duration=0.6)
    res_cpu = scenario_cpu(num_tasks=os_cpu_count(), n=20000)
    print("\nTổng kết (giây):")
    print("IO scenario:", res_io)
    print("CPU scenario:", res_cpu)
    print("\nGợi ý: - ThreadPool nhanh hơn cho IO\n- ProcessPool nhanh hơn cho CPU\n- asyncio phù hợp cho nhiều tác vụ IO nhẹ.")
