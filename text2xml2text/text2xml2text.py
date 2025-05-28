"""
This converts a text representation of people and their details into XML format and vice versa.
It handles various elements such as person, phone, address, and family, and includes error handling for malformed input.

Usage:
python text2xml2text.py --file input.txt

Supported Input Format (TextService):
- P|first name|last name           : Person entry
- T|cell phone|landline phone     : Phone numbers
- A|street|city|zip code          : Address information
- F|name|year of birth            : Family member entry

Conversion Direction:
- .txt → .xml : Converts to structured XML
- .xml → .txt : Converts back to original text format
"""

import argparse
import os 
from datetime import datetime 
from typing import List, Tuple

from xml.dom import minidom
import xml.etree.ElementTree as ET


def text_to_xml(text: str) -> Tuple[str, List[str]]:
    """
    Convert structured text data into XML format.

    Args:
        text (str): Raw input in text format.

    Returns:
        Tuple[str, List[str]]: Formatted XML string and a list of error messages (if any).
    """
    lines = text.strip().splitlines()
    root = ET.Element("people")  # Root XML element

    current_person = None
    current_family = None
    errors = []

    # Process each line in the input
    for idx, line in enumerate(lines, 1):
        parts = line.strip().split("|")
        
        if not parts or (len(parts) == 1 and parts[0] == ""):
            # Ignore empty rows
            continue

        if not parts or len(parts) < 2:
            if parts[0] == "":
                # Ignore empty rows
                continue
            else:
                # Log error for invalid lines
                errors.append(f"Line {idx} is invalid or empty: {line}")
                continue

        code = parts[0]

        try:
            if code == "P":
                # Start a new <person> entry
                current_person = ET.SubElement(root, "person")
                current_family = None
                ET.SubElement(current_person, "firstname").text = parts[1] if len(parts) > 1 else ""
                ET.SubElement(current_person, "lastname").text = parts[2] if len(parts) > 2 else ""

            elif code == "T":
                # Add a <phone> element to current <person> or <family>
                if current_family is not None:
                    target = current_family
                elif current_person is not None:
                    target = current_person
                else:
                    raise ValueError("T without P or F context")

                phone = ET.SubElement(target, "phone")
                ET.SubElement(phone, "mobile").text = parts[1] if len(parts) > 1 else ""
                ET.SubElement(phone, "landline").text = parts[2] if len(parts) > 2 else ""

            elif code == "A":
                # Add an <address> element to current <person> or <family>
                if current_family is not None:
                    target = current_family
                elif current_person is not None:
                    target = current_person
                else:
                    raise ValueError("A without P or F context")

                address = ET.SubElement(target, "address")
                ET.SubElement(address, "street").text = parts[1] if len(parts) > 1 else ""
                ET.SubElement(address, "city").text = parts[2] if len(parts) > 2 else ""
                ET.SubElement(address, "zip").text = parts[3] if len(parts) > 3 else ""

            elif code == "F":
                # Start a new <family> block inside current <person>
                if current_person is None:
                    raise ValueError("F without person context")

                current_family = ET.SubElement(current_person, "family")
                ET.SubElement(current_family, "name").text = parts[1] if len(parts) > 1 else ""
                ET.SubElement(current_family, "born").text = parts[2] if len(parts) > 2 else ""

            else:
                raise ValueError(f"Unknown prefix: {code}")

        except Exception as e:
            errors.append(f"Line {idx}: {line} → {str(e)}")

    # Convert the XML structure to a pretty-printed string
    xml_str = ET.tostring(root, encoding="unicode")
    pretty_xml = minidom.parseString(xml_str).toprettyxml(indent="  ")
    return pretty_xml.strip(), errors


def xml_to_text(xml: str) -> str:
    """
    Convert XML back into structured text format.

    Args:
        xml (str): Raw XML string.

    Returns:
        str: TextService-compliant text output.
    """
    root = ET.fromstring(xml)
    lines = []

    for person in root.findall("person"):
        firstname = person.findtext("firstname", default="").strip()
        lastname = person.findtext("lastname", default="").strip()
        lines.append(f"P|{firstname}|{lastname}")

        # Extract top-level phones
        for phone in person.findall("phone"):
            mobile = phone.findtext("mobile", default="")
            landline = phone.findtext("landline", default="")
            lines.append(f"T|{mobile}|{landline}")

        # Extract top-level addresses
        for address in person.findall("address"):
            street = address.findtext("street", default="")
            city = address.findtext("city", default="")
            zip_code = address.findtext("zip", default="")
            lines.append(f"A|{street}|{city}|{zip_code}")

        # Extract nested <family> entries
        for family in person.findall("family"):
            name = family.findtext("name", default="")
            born = family.findtext("born", default="")
            lines.append(f"F|{name}|{born}")

            for address in family.findall("address"):
                street = address.findtext("street", default="")
                city = address.findtext("city", default="")
                zip_code = address.findtext("zip", default="")
                lines.append(f"A|{street}|{city}|{zip_code}")

    return "\n".join(lines)


def save_to_file(data: str, filename: str) -> None:
    """
    Save output to file, using appropriate suffix.

    Args:
        data (str): Content to write.
        filename (str): Input filename to infer target filename.
    """
    base_filename = os.path.splitext(os.path.basename(filename))[0]
    suffix = os.path.splitext(os.path.basename(filename))[1].lower().split(".")[-1]

    if suffix not in ["txt", "xml"]:
        raise ValueError("Invalid suffix. Use 'txt' or 'xml'.")

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # Determine new suffix for output
    suffix = "xml" if suffix == "txt" else "txt"
    full_filename = f"{timestamp}_{base_filename}_converted.{suffix}"

    try:
        with open(full_filename, "w", encoding="utf-8") as file:
            file.write(data)
        print(f"File saved successfully: {full_filename}")
    except Exception as e:
        print(f"Error saving file: {e}")


if __name__ == "__main__":
    # Parse CLI arguments
    parser = argparse.ArgumentParser(description="Convert text to XML and back.")
    parser.add_argument("--file", help="Path to the input text or XML file")
    args = parser.parse_args()

    if not args.file:
        print("No input file provided. Please use --file to specify a file (e.g., --file input.txt).")
        exit(1)

    # Read input file content
    try:
        with open(args.file, "r", encoding="utf-8") as file:
            text_input = file.read()
    except FileNotFoundError:
        print(f"Error: File '{args.file}' not found.")
        exit(1)

    suffix = os.path.splitext(os.path.basename(args.file))[1].lower().split(".")[-1]
    error_list = None

    # Route conversion based on file suffix
    if suffix == "txt":
        result, error_list = text_to_xml(text_input)
        print("\n=== XML OUTPUT ===\n")
    elif suffix == "xml":
        result = xml_to_text(text_input)
        print("=== TEXT OUTPUT ===\n")

    # Output result and save
    print(result)
    save_to_file(result, args.file)

    # Print conversion errors if any
    if error_list:
        print("\n=== ERRORS ===\n")
        for error in error_list:
            print(error)
