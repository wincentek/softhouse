/**
 * TextServiceParser
 * 
 * This class provides utilities to parse structured text data into a hierarchical format.
 * The input text follows a specific format where each line starts with a type identifier:
 * 
 * - `P`: Represents a person. Contains first name and last name.
 * - `T`: Represents phone data. Contains mobile and optional landline numbers.
 * - `A`: Represents address data. Contains street, city, and zip code.
 * - `F`: Represents a family member. Contains name and birth year.
 * 
 * The parser processes the input line by line, building a structured representation of people,
 * their addresses, phones, and associated family members.
 * 
 * Example Input:
 * ```
 * P|John|Doe
 * A|123 Main St|Springfield|12345
 * T|555-1234|555-5678
 * F|Jane Doe|1980
 * A|456 Elm St|Shelbyville|67890
 * ```
 * 
 * Example Output:
 * {
 *   people: [
 *     {
 *       firstname: "John",
 *       lastname: "Doe",
 *       addresses: [{ street: "123 Main St", city: "Springfield", zip: "12345" }],
 *       phones: [{ mobile: "555-1234", landline: "555-5678" }],
 *       family: [
 *         {
 *           name: "Jane Doe",
 *           born: "1980",
 *           addresses: [{ street: "456 Elm St", city: "Shelbyville", zip: "67890" }],
 *           phones: []
 *         }
 *       ]
 *     }
 *   ]
 * }
 */

import { Person, Address, Phone, FamilyMember, ParsedData, ParsedLine, LineType } from '../types'

export class TextServiceParser {
  
  static parseLine(line: string): ParsedLine | null {
    const trimmed = line.trim()
    if (!trimmed || !trimmed.includes('|')) return null
    
    const [type, ...parts] = trimmed.split('|')
    
    if (!['P', 'T', 'A', 'F'].includes(type)) {
      console.warn(`Unknown line type: '${type}' in line: ${line}`)
      return null
    }
    
    return {
      type: type as LineType,
      data: parts
    }
  }
  
  static parseTextService(textData: string): ParsedData {
    const lines = textData.split('\n')
    const people: Person[] = []
    
    let currentPerson: Person | null = null
    let currentFamily: FamilyMember | null = null
    
    for (const line of lines) {
      const parsed = this.parseLine(line)
      if (!parsed) continue
      
      switch (parsed.type) {
        case 'P':
          // 'P' indicates the start of a new person.
          // Each person has a first name and last name, followed by optional addresses, phones, and family members.
          // If a previous person exists, it is added to the list of people before starting a new one.
          if (currentPerson) {
            people.push(currentPerson)
          }
          currentPerson = {
            firstname: parsed.data[0] || '',
            lastname: parsed.data[1] || '',
            addresses: [],
            phones: [],
            family: []
          }
          currentFamily = null
          break
          
        case 'T':
          // 'T' represents phone data, which includes a mobile number and an optional landline number.
          // Phone data can belong to either the current person or the current family member, depending on context.
          const phone: Phone = {
            mobile: parsed.data[0] || '',
            landline: parsed.data[1] || ''
          }
          
          if (currentFamily) {
            currentFamily.phones.push(phone)
          } else if (currentPerson) {
            currentPerson.phones.push(phone)
          }
          break
          
        case 'A':
          // 'A' represents address data, which includes a street, city, and zip code.
          // Address data can belong to either the current person or the current family member, depending on context.
          const address: Address = {
            street: parsed.data[0] || '',
            city: parsed.data[1] || '',
            zip: parsed.data[2] || ''
          }
          
          if (currentFamily) {
            currentFamily.addresses.push(address)
          } else if (currentPerson) {
            currentPerson.addresses.push(address)
          }
          break
          
        case 'F':
          // 'F' indicates a family member associated with the current person.
          // Each family member has a name and a birth year, and can also have their own addresses and phones.
          // The family member becomes the current context for subsequent phone or address data.
          if (currentPerson) {
            currentFamily = {
              name: parsed.data[0] || '',
              born: parsed.data[1] || '',
              addresses: [],
              phones: []
            }
            currentPerson.family.push(currentFamily)
          }
          break
      }
    }
    
    // Add the last person to the list of people if it exists.
    if (currentPerson) {
      people.push(currentPerson)
    }
    
    return { people }
  }
}