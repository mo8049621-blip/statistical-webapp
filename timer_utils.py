import time
from functools import wraps

# 方法1：装饰器形式 - 用于计时整个函数
def timer(func):
    """函数执行时间计时装饰器"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"函数 '{func.__name__}' 执行时间: {end_time - start_time:.6f} 秒")
        return result
    return wrapper

# 方法2：上下文管理器形式 - 用于计时代码块
class Timer:
    """代码块执行时间计时上下文管理器"""
    def __init__(self, description="代码块"):
        self.description = description
        self.start_time = None
        self.end_time = None
        
    def __enter__(self):
        self.start_time = time.time()
        return self
        
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.end_time = time.time()
        print(f"{self.description} 执行时间: {self.end_time - self.start_time:.6f} 秒")
        
# 方法3：简单的函数形式 - 手动计时
def start_timer():
    """开始计时"""
    return time.time()


def stop_timer(start_time, description="代码"):
    """结束计时并显示结果"""
    end_time = time.time()
    print(f"{description} 执行时间: {end_time - start_time:.6f} 秒")
    return end_time - start_time


# 使用示例（可以注释掉实际使用时）
if __name__ == "__main__":
    # 示例1：使用装饰器
    @timer
    def example_function(n):
        result = 0
        for i in range(n):
            result += i
        return result
    
    example_function(1000000)
    
    # 示例2：使用上下文管理器
    with Timer("循环计算"):
        result = 0
        for i in range(1000000):
            result += i
        print(f"计算结果: {result}")
    
    # 示例3：使用手动计时
    start = start_timer()
    result = 0
    for i in range(1000000):
        result += i
    stop_timer(start, "手动计时循环")