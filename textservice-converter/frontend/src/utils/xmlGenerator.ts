import { Person, Address, Phone, FamilyMember, ParsedData } from '../types'

export class XmlGenerator {
  
  private static escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }
  
  private static generateAddress(address: Address, indent: string): string {
    return `${indent}<address>
${indent}  <street>${this.escapeXml(address.street)}</street>
${indent}  <city>${this.escapeXml(address.city)}</city>
${indent}  <zip>${this.escapeXml(address.zip)}</zip>
${indent}</address>`
  }
  
  private static generatePhone(phone: Phone, indent: string): string {
    return `${indent}<phone>
${indent}  <mobile>${this.escapeXml(phone.mobile)}</mobile>
${indent}  <landline>${this.escapeXml(phone.landline)}</landline>
${indent}</phone>`
  }
  
  private static generateFamily(family: FamilyMember, indent: string): string {
    let xml = `${indent}<family>
${indent}  <name>${this.escapeXml(family.name)}</name>
${indent}  <born>${this.escapeXml(family.born)}</born>`
    
    // Add addresses
    for (const address of family.addresses) {
      xml += '\n' + this.generateAddress(address, indent + '  ')
    }
    
    // Add phones
    for (const phone of family.phones) {
      xml += '\n' + this.generatePhone(phone, indent + '  ')
    }
    
    xml += `\n${indent}</family>`
    return xml
  }
  
  private static generatePerson(person: Person): string {
    let xml = `  <person>
    <firstname>${this.escapeXml(person.firstname)}</firstname>
    <lastname>${this.escapeXml(person.lastname)}</lastname>`
    
    // Add addresses
    for (const address of person.addresses) {
      xml += '\n' + this.generateAddress(address, '    ')
    }
    
    // Add phones
    for (const phone of person.phones) {
      xml += '\n' + this.generatePhone(phone, '    ')
    }
    
    // Add family members
    for (const family of person.family) {
      xml += '\n' + this.generateFamily(family, '    ')
    }
    
    xml += '\n  </person>'
    return xml
  }
  
  static generateXml(data: ParsedData): string {
    let xml = '<?xml version="1.0" ?>\n<people>'
    
    for (const person of data.people) {
      xml += '\n' + this.generatePerson(person)
    }
    
    xml += '\n</people>'
    return xml
  }
}