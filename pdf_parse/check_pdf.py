from unstructured.partition.pdf import partition_pdf
import re
import os

def extract_question_number(text: str) -> int:
    """Extract question number from text."""
    match = re.search(r'Q(\d+)', text)
    return int(match.group(1)) if match else 0

def main():
    pdf_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'MYSQL OCP 8.0 题库.pdf')
    elements = partition_pdf(pdf_path)
    
    # Collect all question numbers
    question_numbers = []
    for element in elements:
        text = element.text.strip()
        if text.startswith('Q'):
            num = extract_question_number(text)
            if num > 0:
                question_numbers.append(num)
    
    # Sort and check continuity
    question_numbers.sort()
    print(f"Found {len(question_numbers)} questions")
    print(f"Question number range: {min(question_numbers)} to {max(question_numbers)}")
    
    # Check for gaps
    all_numbers = set(range(min(question_numbers), max(question_numbers) + 1))
    missing_numbers = sorted(all_numbers - set(question_numbers))
    if missing_numbers:
        print(f"Missing question numbers: {missing_numbers}")
    
    # Print all question numbers for verification
    print("\nAll question numbers:")
    for i in range(0, len(question_numbers), 10):
        chunk = question_numbers[i:i+10]
        print(f"{i+1:3d}-{i+len(chunk):3d}: {chunk}")

if __name__ == '__main__':
    main() 