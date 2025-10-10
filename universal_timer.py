import time
import sys
import os

def run_with_time(file_path):
    """运行指定的Python文件并显示运行时间"""
    try:
        # 记录开始时间
        start_time = time.time()
        start_time_str = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(start_time))
        
        print(f"=== 开始运行: {file_path} ({start_time_str}) ===")
        
        # 保存原始的sys.argv
        original_argv = sys.argv
        
        try:
            # 设置新的sys.argv，第一个参数为文件路径
            sys.argv = [file_path] + sys.argv[2:]
            
            # 执行指定的Python文件
            with open(file_path, 'r', encoding='utf-8') as f:
                exec(f.read())
        finally:
            # 恢复原始的sys.argv
            sys.argv = original_argv
        
        # 记录结束时间
        end_time = time.time()
        end_time_str = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(end_time))
        
        # 计算运行时间
        execution_time = end_time - start_time
        
        print(f"=== 运行结束: {file_path} ({end_time_str}) ===")
        print(f"=== 运行时间: {execution_time:.6f} 秒 ({execution_time*1000:.2f} 毫秒) ===")
        
    except FileNotFoundError:
        print(f"错误: 找不到文件 '{file_path}'")
    except Exception as e:
        print(f"运行时错误: {str(e)}")

def main():
    if len(sys.argv) < 2:
        print("用法: python universal_timer.py your_file.py [additional_args]")
        print("
说明:
1. 此脚本可以在任何目录下运行Python文件并显示运行时间
2. 复制此脚本到您需要的任何目录，然后在命令行中执行上述命令
3. 您也可以将脚本所在目录添加到系统PATH中，以便在任何位置直接使用
        ")
        return
    
    file_path = sys.argv[1]
    run_with_time(file_path)

if __name__ == "__main__":
    main()