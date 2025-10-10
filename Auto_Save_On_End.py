#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
智能对话结束检测器
自动检测"结束对话"关键词并保存
"""

import os
import json
import datetime
import time
from pathlib import Path

class AutoConversationSaver:
    def __init__(self):
        self.base_path = Path("C:/Users/wyx33/Desktop")
        self.log_file = self.base_path / "AI_Conversation_Log.md"
        self.data_file = self.base_path / "conversation_data.json"
        self.conversation_buffer = []
        
    def start_monitoring(self):
        """开始监控对话"""
        print("🤖 智能对话监控器已启动...")
        print("📝 请开始对话，当您说'结束对话'时，系统会自动保存")
        print("�� 提示：您也可以按 Ctrl+C 手动结束监控")
        
        try:
            while True:
                user_input = input("\n👤 您: ")
                
                if "结束对话" in user_input or "结束" in user_input:
                    print("🔄 检测到结束信号，正在自动保存...")
                    self.auto_save_conversation()
                    break
                else:
                    self.conversation_buffer.append(f"�� 您: {user_input}")
                    
        except KeyboardInterrupt:
            print("\n🔄 手动结束，正在自动保存...")
            self.auto_save_conversation()
    
    def auto_save_conversation(self):
        """自动保存对话"""
        if not self.conversation_buffer:
            print("❌ 没有对话内容需要保存")
            return
            
        # 构建完整对话
        full_conversation = "\n".join(self.conversation_buffer)
        
        # 保存到文件
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        
        # 更新Markdown文件
        self.update_markdown_log(full_conversation, timestamp)
        
        # 保存到JSON
        self.save_to_json(full_conversation, timestamp)
        
        print("✅ 对话已自动保存！")
        print("📁 请查看 AI_Conversation_Log.md 文件")
        
    def update_markdown_log(self, conversation, timestamp):
        """更新Markdown日志"""
        if not self.log_file.exists():
            self.create_initial_log()
        
        with open(self.log_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_entry = f"""
### {timestamp} - 自动保存对话
**对话内容**:
{conversation}

---
"""
        
        if "## �� 对话记录" in content:
            content = content.replace("## 📝 对话记录", f"## �� 对话记录{new_entry}")
        else:
            content += new_entry
        
        with open(self.log_file, 'w', encoding='utf-8') as f:
            f.write(content)
    
    def save_to_json(self, conversation, timestamp):
        """保存到JSON文件"""
        conversations = []
        
        if self.data_file.exists():
            with open(self.data_file, 'r', encoding='utf-8') as f:
                conversations = json.load(f)
        
        conversation_data = {
            "timestamp": timestamp,
            "conversation": conversation,
            "id": len(conversations) + 1
        }
        
        conversations.append(conversation_data)
        
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(conversations, f, ensure_ascii=False, indent=2)
    
    def create_initial_log(self):
        """创建初始日志"""
        initial_content = """# �� AI助手对话记录系统

## �� 对话统计
- **总对话次数**: 0
- **最后更新**: 2024-01-15
- **主要话题**: 待更新

## ��️ 话题索引
- [待建立](#待建立)

---

## 📝 对话记录

---

## 🔍 快速搜索
- 按日期: `Ctrl+F` 搜索日期
- 按话题: `Ctrl+F` 搜索标签
- 按关键词: `Ctrl+F` 搜索内容

---

*最后更新: 2024-01-15 | 系统版本: 6.0 (全自动版)*
"""
        with open(self.log_file, 'w', encoding='utf-8') as f:
            f.write(initial_content)

if __name__ == "__main__":
    saver = AutoConversationSaver()
    saver.start_monitoring()
    