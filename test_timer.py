# 测试Code Runner运行时间显示的Python脚本
import time

# 简单的循环操作
start_time = time.time()

# 执行一些操作
result = 0
for i in range(1000000):
    result += i

end_time = time.time()

print(f"计算结果: {result}")
print(f"代码执行时间: {end_time - start_time:.6f} 秒")

# 手动添加的计时信息，这样即使Code Runner的时间显示不工作，您也能看到运行时间