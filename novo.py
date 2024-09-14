import json, re

def getData(file_path):
    # Path to the JSON file
    file_content = ""

    # Read the file content
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            file_content += line

    # Parse the JSON content
    return json.loads(file_content)

# Log the array of strings
book = getData('books/it.js')
words = getData('itWords.js')

book_length = len(book)
words_length = len(words)

print(f"Length of book: {book_length}")
print(f"Length of words: {words_length}")

newWords = []
i = 0
for word in words:
    found = False
    i += 1
    if i % 100 == 0:
        print(f"Word {i}/{words_length}")
    for line in book:
        # print(f"Word: {word['word']}")
        # print(f"Line: {line}")
        if re.search(rf'\b{re.escape(word["word"])}\b', line, re.IGNORECASE):
            found = True
            word["phrase"] = line
            newWords.append(word)
            break
    if not found:
        print(f"Word not found: {word['word']}")

print(f"Length of newWords: {len(newWords)}")
def saveData(data):
    # Save the data to the file
    with open("novo.json", 'w', encoding='utf-8') as file:
        file.write(json.dumps(data))

saveData(newWords)