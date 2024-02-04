import collections

def count_line_repetitions(filename):
  """Counts line repetitions in a file, sorts them by count, and prints them."""

  with open(filename, 'r') as file:
    lines = file.readlines()

  line_counts = collections.Counter(lines)

  for line, count in sorted(line_counts.items(), key=lambda item: item[1], reverse=True):
    print(f"{line.rstrip()}: {count}")

# Example usage:
filename = "./books/it.html"  # Replace with the actual filename
count_line_repetitions(filename)
