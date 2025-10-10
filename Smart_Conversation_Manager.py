#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
智能AI对话记录管理系统
自动总结对话内容，无需手动输入
"""

import os
import json
import datetime
from pathlib import Path

class SmartConversationManager:
    def __init__(self, base_path="C:/Users/wyx33/Desktop"):
        self.base_path = Path(base_path)
        self.log_file = self.base_path / "AI_Conversation_Log.md"
        self.data_file = self.base_path / "conversation_data.json"
        
    def auto_summarize(self, question, answer):
        """自动总结对话内容"""
        # 自动提取关键要点
        key_points = self.extract_key_points(answer)
        
        # 自动生成标签
        tags = self.generate_tags(question, answer)
        
        # 自动识别后续行动
        follow_up = self.identify_follow_up(answer)
        
        return {
            "key_points": key_points,
            "tags": tags,
            "follow_up": follow_up
        }
    
    def extract_key_points(self, answer):
        """从回答中提取关键要点"""
        key_phrases = []
        
        # 查找包含关键词的句子
        sentences = answer.split('。')
        for sentence in sentences:
            if any(word in sentence for word in ['关键', '要点', '重要', '主要', '核心', '总结', '自动']):
                key_phrases.append(sentence.strip())
        
        # 如果没有找到，则提取前3个完整句子
        if not key_phrases:
            key_phrases = [s.strip() for s in sentences[:3] if s.strip()]
        
        return key_phrases[:5]
    
    def generate_tags(self, question, answer):
        """自动生成标签"""
        tags = []
        
        # 基于问题内容生成标签
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
        if '总结' in question or '要点' in question:
            tags.append('内容总结')
        
        # 基于回答内容生成标签
        if '文件' in answer:
            tags.append('文件管理')
        if '搜索' in answer:
            tags.append('搜索功能')
        if '智能' in answer:
            tags.append('智能功能')
        
        # 去重并返回
        return list(set(tags))
    
    def identify_follow_up(self, answer):
        """识别后续行动"""
        follow_up = []
        
        # 查找包含行动词汇的句子
        sentences = answer.split('。')
        for sentence in sentences:
            if any(word in sentence for word in ['需要', '应该', '建议', '可以', '下一步', '创建', '运行']):
                follow_up.append(sentence.strip())
        
        return follow_up[:3]
    
    def add_conversation_smart(self, question, answer):
        """智能添加对话记录"""
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        
        # 自动总结
        summary = self.auto_summarize(question, answer)
        
        conversation = {
            "timestamp": timestamp,
            "question": question,
            "answer": answer,
            "key_points": summary["key_points"],
            "tags": summary["tags"],
            "follow_up": summary["follow_up"],
            "id": len(self.get_conversations()) + 1
        }
        
        # 保存到JSON文件
        conversations = self.get_conversations()
        conversations.append(conversation)
        self.save_conversations(conversations)
        
        # 更新Markdown文件
        self.update_markdown_log(conversation)
        
        print("✅ 对话记录已自动添加！")
        print(f"�� 自动提取了 {len(summary['key_points'])} 个关键要点")
        print(f"🏷️ 自动生成了 {len(summary['tags'])} 个标签")
        print(f"�� 识别了 {len(summary['follow_up'])} 个后续行动")
        
        return conversation
    
    def get_conversations(self):
        """获取所有对话记录"""
        if self.data_file.exists():
            with open(self.data_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []
    
    def save_conversations(self, conversations):
        """保存对话记录到JSON文件"""
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(conversations, f, ensure_ascii=False, indent=2)
    
    def update_markdown_log(self, conversation):
        """更新Markdown日志文件"""
        if not self.log_file.exists():
            self.create_initial_log()
        
        # 读取现有内容
        with open(self.log_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 添加新对话
        new_entry = f"""
### {conversation['timestamp']} - {conversation['tags'][0] if conversation['tags'] else '新对话'}
**问题**: {conversation['question']}

**回答**: {conversation['answer'][:200]}...

**关键要点**:
{chr(10).join(f"- {point}" for point in conversation['key_points'])}

**后续行动**:
{chr(10).join(f"- {action}" for action in conversation['follow_up'])}

**标签**: {' '.join(f'#{tag}' for tag in conversation['tags'])}

---
"""
        
        # 在对话记录部分插入新内容
        if "## �� 对话记录" in content:
            content = content.replace("## 📝 对话记录", f"## �� 对话记录{new_entry}")
        else:
            content += new_entry
        
        # 写回文件
        with open(self.log_file, 'w', encoding='utf-8') as f:
            f.write(content)
    
    def create_initial_log(self):
        """创建初始日志文件"""
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

*最后更新: 2024-01-15 | 系统版本: 2.0 (智能版)*
"""
        with open(self.log_file, 'w', encoding='utf-8') as f:
            f.write(initial_content)

# 使用示例
if __name__ == "__main__":
    manager = SmartConversationManager()
    
    # 只需要提供问题和回答，系统自动总结！
    manager.add_conversation_smart(
        question="Smart_Conversation_Manager.py你的脚本运行出了不少问题",
        answer="让我帮您修复脚本问题！问题找到了！您把Python代码复制到了PowerShell中运行！这就是问题所在..."
    )
    
    print("\n🎉 智能总结完成！")
    print("📁 请查看 AI_Conversation_Log.md 文件")