import os
import json
import logging
from typing import List, Dict, Any, Tuple, Optional
from unstructured.partition.pdf import partition_pdf
from unstructured.documents.elements import Text, Title, NarrativeText, ListItem
import re

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def is_question_start(text: str) -> bool:
    """判断是否是题目的开始"""
    return bool(re.match(r'^(?:Q)?(\d+)[.)]', text.strip()))

def is_option_line(text: str) -> bool:
    """判断是否是选项行"""
    return bool(re.match(r'^[A-F][.)]', text.strip()))

def extract_question_number(text: str) -> str:
    """从文本中提取题号"""
    match = re.match(r'^(?:Q)?(\d+)[.)]', text.strip())
    if match:
        return match.group(1)
    return "0"

def clean_question_text(text: str) -> str:
    """清理题干文本，去除多余点号和空格"""
    text = text.strip()
    # 去除开头的题号（Q1. 或 1. 或 1) 格式）
    text = re.sub(r'^(?:Q)?(\d+)[.)]\s*', '', text)
    # 去除开头的点号
    if text.startswith('.'):
        text = text[1:].strip()
    return text

def split_into_question_blocks(elements: List[str]) -> List[str]:
    """将文本元素分割成题目块"""
    blocks = []
    current_block = []
    current_number = None
    
    for element in elements:
        element = element.strip()
        if not element:
            continue
            
        # 如果遇到新题目的开始
        if is_question_start(element):
            number = extract_question_number(element)
            # 如果题号不同，开始新的块
            if number != current_number:
                if current_block:
                    blocks.append('\n'.join(current_block))
                current_block = [element]
                current_number = number
            # 如果题号相同，继续添加到当前块
            else:
                current_block.append(element)
        # 如果是选项或者普通文本，添加到当前块
        else:
            current_block.append(element)
    
    # 添加最后一个块
    if current_block:
        blocks.append('\n'.join(current_block))
    
    return blocks

def extract_answer(text: str) -> Tuple[str, Optional[str]]:
    """从文本中提取答案，返回 (清理后的文本, 答案)"""
    answer_match = re.search(r'Answer:([A-F]+)$', text.strip())
    if answer_match:
        answer = answer_match.group(1)
        text = text[:text.rindex('Answer:')].strip()
        return text, answer
    return text, None

def process_question_block(block: str) -> dict:
    """处理单个题目块，返回题号、题干和选项"""
    lines = block.split('\n')
    question_number = "0"
    question_text = []
    options = []
    current_option = None
    answer = None
    
    # 第一行一定是题号行
    first_line = lines[0].strip()
    question_number = extract_question_number(first_line)
    question_text.append(clean_question_text(first_line))
    
    # 处理剩余行
    for line in lines[1:]:
        line = line.strip()
        if not line:
            continue
            
        # 如果是选项行
        if is_option_line(line):
            if current_option:
                # 处理上一个选项的答案
                option_text, opt_answer = extract_answer(current_option["text"])
                current_option["text"] = option_text
                if opt_answer:
                    answer = opt_answer
                options.append(current_option)
            current_option = {
                "letter": line[0],
                "text": line[2:].strip()
            }
        # 如果是新题目的开始，忽略它（因为已经在第一行处理过了）
        elif is_question_start(line):
            continue
        # 如果是普通文本
        else:
            # 如果已经开始处理选项，那么这是选项的继续
            if current_option:
                current_option["text"] += " " + line
            # 否则这是题干的一部分
            else:
                question_text.append(line)
    
    # 处理最后一个选项
    if current_option:
        # 处理最后一个选项的答案
        option_text, opt_answer = extract_answer(current_option["text"])
        current_option["text"] = option_text
        if opt_answer:
            answer = opt_answer
        options.append(current_option)
    
    # 如果题干中也包含答案，提取出来
    stem_text, stem_answer = extract_answer(" ".join(question_text))
    if stem_answer:
        answer = stem_answer
    
    return {
        "number": question_number,
        "stem": stem_text,
        "options": options,
        "correct_answers": list(answer) if answer else []
    }

def parse_pdf_to_questions(pdf_path: str) -> List[Dict[str, Any]]:
    """Parse PDF file and convert to structured questions."""
    print(f"Starting to parse PDF file: {pdf_path}")
    
    # 使用 unstructured 读取 PDF
    elements = partition_pdf(pdf_path)
    
    # 提取所有文本元素
    text_elements = []
    for element in elements:
        if isinstance(element, Text):
            text_elements.append(str(element))
    
    print(f"Found {len(elements)} elements in PDF")
    
    # 将文本分割成题目块
    question_blocks = split_into_question_blocks(text_elements)
    
    # 处理每个题目块
    questions = []
    question_numbers = set()
    processed_numbers = set()  # 用于记录已处理的题号
    
    for block in question_blocks:
        question = process_question_block(block)
        if question["number"] != "0" and question["options"]:
            # 如果题号已经处理过，跳过这个题目
            if question["number"] in processed_numbers:
                continue
            questions.append(question)
            question_numbers.add(int(question["number"]))
            processed_numbers.add(question["number"])
    
    # 检查缺失的题号
    all_numbers = set(range(1, max(question_numbers) + 1))
    missing_numbers = sorted(list(all_numbers - question_numbers))
    if missing_numbers:
        print(f"Missing question numbers: {missing_numbers}")
    
    # 按题号排序
    questions.sort(key=lambda x: int(x["number"]))
    
    print(f"Successfully parsed {len(questions)} questions")
    return questions

def main():
    """Main function to run the parser."""
    questions = parse_pdf_to_questions("MySQL OCP 8.0 题库.pdf")
    
    # 保存到JSON文件
    output = {"questions": questions}
    with open("src/data/questions.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"Successfully saved {len(questions)} questions to src/data/questions.json")

if __name__ == "__main__":
    main() 