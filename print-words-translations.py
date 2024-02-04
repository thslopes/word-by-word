def compare_files_line_by_line(file1, file2):
  """Compares lines from two files and prints differences."""

  with open(file1, 'r') as f1, open(file2, 'r') as f2:
    i = 0
    for line1, line2 in zip(f1, f2):
      if line1.rstrip() != line2.rstrip():
        print("{")
        print(f'"word": "{line1.rstrip()}", "translation": "{line2.rstrip()}", "status": -1, "practiceDate": "2024-01-25T00:00:00.000Z", "index": {i},')
        print("},")
        i += 1

print("""
let itWords =
  [
""")


# Example usage:
file1 = "books/it.txt"  # Replace with the actual filenames
file2 = "books/it-t.txt"
compare_files_line_by_line(file1, file2)

print("""
  ];
""")
