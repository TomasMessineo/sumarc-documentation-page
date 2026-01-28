import zipfile
import xml.etree.ElementTree as ET
import sys

def extract_text(docx_path):
    with zipfile.ZipFile(docx_path) as docx:
        xml_content = docx.read('word/document.xml')
        tree = ET.fromstring(xml_content)
        
        # XML namespaces usually used in Word
        namespaces = {
            'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
        }
        
        text_parts = []
        for body in tree.findall('w:body', namespaces):
            for paragraph in body.findall('.//w:p', namespaces):
                para_text = ""
                for run in paragraph.findall('.//w:r', namespaces):
                    for text in run.findall('.//w:t', namespaces):
                        if text.text:
                            para_text += text.text
                if para_text:
                    text_parts.append(para_text)
                    
    return "\n".join(text_parts)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_docx.py <docx_path>")
        sys.exit(1)
        
    print(extract_text(sys.argv[1]))
