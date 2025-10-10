#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
简化对话保存器
一次性保存整个对话
"""

import datetime
from pathlib import Path

def simple_save():
    """简化保存"""
    print("�� 简化对话保存器")
    
    # 获取对话内容
    conversation = input("请粘贴整个对话内容: ")
    
    # 保存到文件
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    
    log_file = Path("C:/Users/wyx33/Desktop/AI_Conversation_Log.md")
    
    if not log_file.exists():
        create_initial_log(log_file)
    
    with open(log_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_entry = f"""
### {timestamp} - 完整对话
**对话内容**:
{conversation}

---
"""
    
    if "## 对话记录" in content:
        content = content.replace("## 📝 对话记录", f"## 对话记录{new_entry}")
    else:
        content += new_entry
    
    with open(log_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ 对话已保存！")

def create_initial_log(log_file):
    """创建初始日志"""
    initial_content = """# AI助手对话记录系统

## 对话统计
- **总对话次数**: 0
- **最后更新**: 2024-01-15
- **主要话题**: 待更新

##️ 话题索引
- [待建立](#待建立)

---

## 📝 对话记录

---

## 🔍 快速搜索
- 按日期: `Ctrl+F` 搜索日期
- 按话题: `Ctrl+F` 搜索标签
- 按关键词: `Ctrl+F` 搜索内容

---

*最后更新: 2024-01-15 | 系统版本: 5.0 (简化版)*
"""
    with open(log_file, 'w', encoding='utf-8') as f:
        f.write(initial_content)

if __name__ == "__main__":
    simple_save()