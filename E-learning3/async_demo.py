import time
import argparse
import math
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor, as_completed
import asyncio
from functools import partial

# Các tác vụ mô phỏng 
def cpu_bound_task(n: int) -> int:
    """Tác vụ CPU-bound: tính số Fibonacci thứ n (dạng lặp để tiêu tốn CPU)."""
    if n <= 0:
        return 0
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

def io_bound_task(duration: float) -> float:
    """Tác vụ I/O-bound mô phỏng bằng sleep đồng bộ (blocking)."""
    time.sleep(duration)
    return duration

async def aio_io_bound_task(duration: float) -> float:
    """Tác vụ I/O-bound mô phỏng bằng asyncio.sleep (non-blocking)."""
    await asyncio.sleep(duration)
    return duration

# Tác vụ CPU nặng hơn: kiểm tra số nguyên tố
def is_prime(n: int) -> bool:
    if n < 2:
        return False
    if n % 2 == 0:
        return n == 2
    r = int(math.sqrt(n))
    for i in range(3, r+1, 2):
        if n % i == 0:
            return False
    return True

# Các phương pháp chạy khác nhau 
def run_sequential(cpu_jobs, cpu_param, io_jobs, io_duration):
    """Chạy tuần tự: các tác vụ được thực hiện lần lượt."""
    start = time.perf_counter()
    cpu_results = [cpu_bound_task(cpu_param) for _ in range(cpu_jobs)]
    io_results = [io_bound_task(io_duration) for _ in range(io_jobs)]
    elapsed = time.perf_counter() - start
    return elapsed, cpu_results, io_results

def run_threads(cpu_jobs, cpu_param, io_jobs, io_duration, max_workers=None):
    """Chạy song song bằng ThreadPoolExecutor — hiệu quả chủ yếu với tác vụ I/O."""
    start = time.perf_counter()
    with ThreadPoolExecutor(max_workers=max_workers) as ex:
        cpu_futs = [ex.submit(cpu_bound_task, cpu_param) for _ in range(cpu_jobs)]
        io_futs = [ex.submit(io_bound_task, io_duration) for _ in range(io_jobs)]
        for f in as_completed(cpu_futs + io_futs):
            _ = f.result()
    elapsed = time.perf_counter() - start
    return elapsed

def run_processes(cpu_jobs, cpu_param, io_jobs, io_duration, max_workers=None):
    """Chạy song song bằng ProcessPoolExecutor — phù hợp cho tác vụ CPU-bound."""
    start = time.perf_counter()
    with ProcessPoolExecutor(max_workers=max_workers) as ex:
        cpu_futs = [ex.submit(cpu_bound_task, cpu_param) for _ in range(cpu_jobs)]
        io_futs = [ex.submit(io_bound_task, io_duration) for _ in range(io_jobs)]
        for f in as_completed(cpu_futs + io_futs):
            _ = f.result()
    elapsed = time.perf_counter() - start
    return elapsed

async def run_asyncio_io_only(io_jobs, io_duration):
    """Chạy bất đồng bộ hoàn toàn bằng asyncio cho các tác vụ I/O."""
    start = time.perf_counter()
    coros = [aio_io_bound_task(io_duration) for _ in range(io_jobs)]
    results = await asyncio.gather(*coros)
    elapsed = time.perf_counter() - start
    return elapsed

async def run_mixed(cpu_jobs, cpu_param, io_jobs, io_duration, max_workers=None):
    """Kết hợp asyncio (cho I/O) và ProcessPoolExecutor (cho CPU) — mô phỏng môi trường thực tế."""
    start = time.perf_counter()
    loop = asyncio.get_running_loop()
    cpu_futs = [
        loop.run_in_executor(ProcessPoolExecutor(max_workers=max_workers), cpu_bound_task, cpu_param)
        for _ in range(cpu_jobs)
    ]
    io_coros = [aio_io_bound_task(io_duration) for _ in range(io_jobs)]
    results = await asyncio.gather(*(cpu_futs + io_coros))
    elapsed = time.perf_counter() - start
    return elapsed
