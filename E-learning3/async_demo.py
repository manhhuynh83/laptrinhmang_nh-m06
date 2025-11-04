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

