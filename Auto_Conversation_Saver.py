#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
自动对话保存器
每次对话结束时自动运行
"""

import os
import json
import datetime
from pathlib import Path

def auto_save_conversation():
    """自动保存对话"""
    print("🤖 自动对话保存器启动...")
    
    # 获取用户输入
    question = input("请输入您的问题: ")
    answer = input("请输入AI的回答: ")
    
    # 自动总结
    key_points = extract_key_points(answer)
    tags = generate_tags(question, answer)
    follow_up = identify_follow_up(answer)
    
    # 保存到文件
    save_to_files(question, answer, key_points, tags, follow_up)
    
    print("✅ 对话已自动保存！")
    print("📁 请查看 AI_Conversation_Log.md 文件")

def extract_key_points(answer):
    """提取关键要点"""
    sentences = answer.split('。')
    key_phrases = []
    
    for sentence in sentences:
        if any(word in sentence for word in ['关键', '要点', '重要', '主要', '核心']):
            key_phrases.append(sentence.strip())
    
    if not key_phrases:
        key_phrases = [s.strip() for s in sentences[:3] if s.strip()]
    
    return key_phrases[:5]

def generate_tags(question, answer):
    """生成标签"""
    tags = []
    
    if '数据' in question or '分析' in question:
        tags.append('数据分析')
    if '系统' in question or '创建' in question:
        tags.append('系统建立')
    if '对话' in question or '记录' in question:
        tags.append('对话管理')
    if 'Python' in question or '脚本' in question:
        tags.append('编程')
    if '自动化' in question:
        tags.append('自动化')
    
    return list(set(tags))

def identify_follow_up(answer):
    """识别后续行动"""
    follow_up = []
    sentences = answer.split('。')
    
    for sentence in sentences:
        if any(word in sentence for word in ['需要', '应该', '建议', '可以', '下一步']):
            follow_up.append(sentence.strip())
    
    return follow_up[:3]

def save_to_files(question, answer, key_points, tags, follow_up):
    """保存到文件"""
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    
    # 保存到JSON
    data_file = Path("C:/Users/wyx33/Desktop/conversation_data.json")
    conversations = []
    
    if data_file.exists():
        with open(data_file, 'r', encoding='utf-8') as f:
            conversations = json.load(f)
    
    conversation = {
        "timestamp": timestamp,
        "question": question,
        "answer": answer,
        "key_points": key_points,
        "tags": tags,
        "follow_up": follow_up,
        "id": len(conversations) + 1
    }
    
    conversations.append(conversation)
    
    with open(data_file, 'w', encoding='utf-8') as f:
        json.dump(conversations, f, ensure_ascii=False, indent=2)
    
    # 更新Markdown
    log_file = Path("C:/Users/wyx33/Desktop/AI_Conversation_Log.md")
    
    if not log_file.exists():
        create_initial_log(log_file)
    
    with open(log_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_entry = f"""
### {timestamp} - {tags[0] if tags else '新对话'}
**问题**: {question}

**回答**: {answer[:200]}...

**关键要点**:
{chr(10).join(f"- {point}" for point in key_points)}

**后续行动**:
{chr(10).join(f"- {action}" for action in follow_up)}

**标签**: {' '.join(f'#{tag}' for tag in tags)}

---
"""
    
    if "## 对话记录" in content:
        content = content.replace("## 📝 对话记录", f"## 对话记录{new_entry}")
    else:
        content += new_entry
    
    with open(log_file, 'w', encoding='utf-8') as f:
        f.write(content)

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

*最后更新: 2024-01-15 | 系统版本: 3.0 (自动版)*
"""
    with open(log_file, 'w', encoding='utf-8') as f:
        f.write(initial_content)

if __name__ == "__main__":
    auto_save_conversation()