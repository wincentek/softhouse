import { Person, Address, Phone, FamilyMember, ParsedData } from '../types'

export class JsonGenerator {
  
  private static cleanObject(obj: any): any {
    if (Array.isArray(obj)) {
      const cleaned = obj.map(item => this.cleanObject(item)).filter(item => item !== null)
      return cleaned.length > 0 ? cleaned : undefined
    }
    
    if (obj && typeof obj === 'object') {
      const cleaned: any = {}
      for (const [key, value] of Object.entries(obj)) {
        const cleanedValue = this.cleanObject(value)
        if (cleanedValue !== null && cleanedValue !== undefined && cleanedValue !== '') {
          cleaned[key] = cleanedValue
        }
      }
      return Object.keys(cleaned).length > 0 ? cleaned : null
    }
    
    return obj === '' ? null : obj
  }
  
  private static processAddress(address: Address): any {
    return this.cleanObject({
      street: address.street,
      city: address.city,
      zip: address.zip
    })
  }
  
  private static processPhone(phone: Phone): any {
    return this.cleanObject({
      mobile: phone.mobile,
      landline: phone.landline
    })
  }
  
  private static processFamilyMember(family: FamilyMember): any {
    const processed: any = {
      name: family.name,
      born: family.born
    }
    
    if (family.addresses.length > 0) {
      const addresses = family.addresses.map(addr => this.processAddress(addr)).filter(addr => addr)
      if (addresses.length > 0) {
        processed.address = addresses
      }
    }
    
    if (family.phones.length > 0) {
      const phones = family.phones.map(phone => this.processPhone(phone)).filter(phone => phone)
      if (phones.length > 0) {
        processed.phone = phones
      }
    }
    
    return this.cleanObject(processed)
  }
  
  private static processPerson(person: Person): any {
    const processed: any = {
      firstname: person.firstname,
      lastname: person.lastname
    }
    
    if (person.addresses.length > 0) {
      const addresses = person.addresses.map(addr => this.processAddress(addr)).filter(addr => addr)
      if (addresses.length > 0) {
        processed.address = addresses
      }
    }
    
    if (person.phones.length > 0) {
      const phones = person.phones.map(phone => this.processPhone(phone)).filter(phone => phone)
      if (phones.length > 0) {
        processed.phone = phones
      }
    }
    
    if (person.family.length > 0) {
      const family = person.family.map(fam => this.processFamilyMember(fam)).filter(fam => fam)
      if (family.length > 0) {
        processed.family = family
      }
    }
    
    return this.cleanObject(processed)
  }
  
  static generateJson(data: ParsedData): string {
    const processed = {
      people: data.people.map(person => this.processPerson(person)).filter(person => person)
    }
    
    return JSON.stringify(processed, null, 2)
  }
  
  static generateCompactJson(data: ParsedData): string {
    const processed = {
      people: data.people.map(person => this.processPerson(person)).filter(person => person)
    }
    
    return JSON.stringify(processed)
  }
}