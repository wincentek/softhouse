import dotenv from 'dotenv';
import { connectDatabase, insertTextServiceData, getConnection } from './database';

dotenv.config();

// TextService data from the knowledge file
const textServiceData = `P|Victoria|Bernadotte
T|070-0101010|0459-123456
A|Haga Slott|Stockholm|101
F|Estelle|2012
A|Solliden|Öland|10002
F|Oscar|2016
T|0702-020202|02-202020
P|Joe|Biden
A|White House|Washington, D.C

P|Klara|Berg
A|Ängsgatan 5|Umeå|90322
T|070-1111111|090-111111
A|Dalagatan 12|Umeå|90330
T|070-2222222|090-222222
F|Hugo|2012
A|Björkvägen 3|Umeå|90335
A|Lönngatan 8|Umeå|90336

P|Anton|Lind
F|Mira|2010
T|072-3333333|08-333333
T|073-4444444|08-444444

P|Agnes|Sundström
A|Fjällvägen 4|Kiruna|98131
F|Melker|2015
A|Snövägen 6|Kiruna|98140
T|070-5555555|0980-111222

P|Felix|Öhman
T|070-6666666|031-111222
T|070-7777777|031-222333

P|Ida|Norén
A|Havsgränd 1|Visby|62145
A|Strandvägen 7|Visby|62150

P|Linus|Ekberg
F|Tyra|2017
T|076-8888888|08-888888
F|Leo|2020
T|076-9999999|08-999999

P|Elise|Gran
T|073-1112223|013-111222
A|Stenvägen 10|Linköping|58244
T|073-2223334|013-222333
A|Slottsgatan 4|Linköping|58245

P|David|Åsberg
F|Moa|2013
T|070-4445556|054-333444
A|Gröna Vägen 6|Karlstad|65230
F|Ebbe|2016
A|Solgatan 9|Karlstad|65231
A|Mossvägen 1|Karlstad|65232

P|Selma|Björk
F|Ella|2009
T|070-0001112|031-000111
T|070-0002223|031-000222
A|Nygatan 5|Göteborg|41101
A|Östra Hamngatan 1|Göteborg|41110

P|Arvid|Friberg
A|Villagatan 11|Kalmar|39238
A|Trädgårdsgatan 2|Kalmar|39239

P|Alma|Sjöberg
A|Storgatan 12|Göteborg|41122
T|073-1112233|08-223344
F|Liam|2015
A|Lillgatan 2|Göteborg|41125
F|Ella|2018

P|Noah|
T|070-5556677|
F|Olivia|2013
F|Lucas|2016

P|Freja|Lindqvist
A|Ringvägen 9|Uppsala|75233
T|076-8899777|018-445566
F|William|2014

P|Elias|Nyström
A|Älvvägen 14|Borås|50452
T||031-789456

P|Maja|Karlsson
T|070-6677889|040-332211
F|Thea|2011
A|Skolgatan 1|Malmö|21422
F|Arvid|2013

P|Oscar|Ek
T|072-3334445|08-665544
F|Astrid|2010
F|Vera|2012
F|Nils|2014

P|Ines|
A|Björkgatan 5|Luleå|97232

P|Viktor|Fransson
A|Södra Allén 3|Sundsvall|85232
T|073-9998887|
F|Wilma|2016

P|Ella|Jönsson
A|Villagatan 4|Lund|22362
T|076-1112222|046-554433
F|Felix|2019

P|Leo|Andersson
T||031-111000
F|Selma|2017
F|Axel|2019

P|Alva|Nilsson
P|Viggo|Larsson
P|Lilly|
P|Melvin|Eriksson
P|Tilde|Johansson
P|Nils|
P|Saga|Lindgren
P|Otto|Berg
P|Tuva|
P|Isak|Persson

P||Andersson
P|Emil|Johansson
P||Karlsson
P|Sofie|
P||Lundberg
P|Elin|Bergström
P|Mattias|
P||Nilsson
P|Anna|Svensson
P||Öberg`;

function parseIntoPersonBlocks(data: string): string[] {
  const lines = data.split('\n').filter(line => line.trim() !== '');
  const personBlocks: string[] = [];
  let currentBlock: string[] = [];
  
  for (const line of lines) {
    if (line.startsWith('P|')) {
      // Start new person block
      if (currentBlock.length > 0) {
        personBlocks.push(currentBlock.join('\n'));
      }
      currentBlock = [line];
    } else {
      // Add to current person block
      currentBlock.push(line);
    }
  }
  
  // Add the last block
  if (currentBlock.length > 0) {
    personBlocks.push(currentBlock.join('\n'));
  }
  
  return personBlocks;
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDatabase();
    
    // Clear existing data
    const conn = getConnection();
    await conn.execute('DELETE FROM textservice_data');
    console.log('🗑️  Cleared existing data');
    
    // Parse data into person blocks
    const personBlocks = parseIntoPersonBlocks(textServiceData);
    console.log(`📦 Found ${personBlocks.length} person blocks`);
    
    // Insert each person block
    for (const block of personBlocks) {
      await insertTextServiceData(block);
    }
    
    console.log(`✅ Successfully seeded ${personBlocks.length} records`);
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();