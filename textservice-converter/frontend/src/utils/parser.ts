import { Person, Address, Phone, FamilyMember, ParsedData, ParsedLine, LineType } from '../types'

export class TextServiceParser {
  
  static parseLine(line: string): ParsedLine | null {
    const trimmed = line.trim()
    if (!trimmed || !trimmed.includes('|')) return null
    
    const [type, ...parts] = trimmed.split('|')
    
    if (!['P', 'T', 'A', 'F'].includes(type)) return null
    
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
          // Start new person
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
          // Phone data
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
          // Address data
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
          // Family member
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
    
    // Add the last person
    if (currentPerson) {
      people.push(currentPerson)
    }
    
    return { people }
  }
}