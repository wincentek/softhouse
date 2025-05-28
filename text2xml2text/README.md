# text2xml2text

A simple CLI tool that converts between a structured text format and XML, and vice versa.

## 🛠️ Usage

```
python text2xml2text.py --file your_input_file.txt
```

- Accepts either `.txt` or `.xml` as input.
- Auto-detects input type and converts accordingly.

## 📄 Input Formats

### Text Format (`.txt`)

Each line starts with a prefix:

- `P|first name|last name` – New person
- `T|mobile|landline` – Phone
- `A|street|city|zip` – Address
- `F|name|born` – Family member

### XML Format (`.xml`)

Structured XML using `<person>`, `<phone>`, `<address>`, and `<family>` elements.

## 💾 Output & Saved Files

- Output is printed to the terminal.

Output Files:
- Files are saved in the same folder as the input.
- The converted files are saved with a timestamp prefix in the format `YYYYMMDD_HHMMSS`.
- For example, if the input file is `example.txt`, the converted XML file will be named `20250527_153045_example_converted.xml`.
- Similarly, if the input file is `example.xml`, the converted text file will be named `20250527_153045_example_converted.txt`.
"""