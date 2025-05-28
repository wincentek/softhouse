# Arbetsprov - Wincent Ek

*(Denna journal uppdateras automatiskt utifrån inkommande inlägg)*

## Upplägg

Jag funderade på hur jag skulle lösa detta och kom snabbt fram till att jag vill lösa det på några olika vis.

&#x20;

###### - Metod 1: Chat GPT

###### - Metod 2: Python ([text2xml2text](text2xml2text/README.md))

---

## Dokumentation

Att löpande hålla detta dokumentet uppdaterat så att ni kan ta del av mitt tänk kändes viktigt.

Ackumulerad tid: ca 75min. 

## Metod 1: ChatGPT

###### Ett sätt jag ville prova var att använda ChatGPT, så jag skapade en egen GPT för ändamålet, och det gick ju ganska så bra.

Jag knåpade på en systemprompt som definerade uppdraget, förutsättningarna och dataformatet. Ett ganska snabbt sätt att lösa uppdraget på på. Åtminstonde för en så här liten textmängd. Ett större konverteringsjobbmed kanske tusentals rader hade inte funkat i denna (enkla) lösning.

Jag genererade 50-talet variationer av textdata och det var ju kul att se att den formatterar både fram och tillbaka mellan formaten. Vad som händer om textdata är helt galet felformatterat vet jag inte, men jag ville bara testa konceptet lite snabbt.

#### **Kolla här:**[ https://chatgpt.com/g/g-6835ec5574dc81919a9285e60e571739-arbetsprov-softhouse](https://chatgpt.com/g/g-6835ec5574dc81919a9285e60e571739-arbetsprov-softhouse)

**Exempeldata finner du längst ner i dokumentet.**

#### Vem är användaren?&#x20;

Användaren har låg datormognad men behöver konvertera några rader lite då och då på ett enkelt och (numera) bekant vis via en chatprompt.

**Tid:** ca 75min.

## Metod 2: Python - Text2XmlToText
[README: text2xml2text](text2xml2text/README.md)

Jag är inte supervass på Python, så jag bestämde mig för att kasta mig ut på djupt vatten. Hur svårt kan det vara? Det gick ju hyfsat att sno ihop något användbart.

Jag har förvisso skrivit några små tools i Python för Open WebUI, så helt novis är jag inte. Men Google och Copilot är definitivt mina kompisar här. Jag satte ihop ett litet script som helt enkelt läser in datat ett format och konverterar till det andra.

Jag kallar det Txt2Xml2Txt

#### Kolla här: 

#### Vem är användaren?

Användaren är van att starta köra script via CLI. Det finns ett behov att göra större batchkonverteringar på några hundra rader eller fler med jämna mellanrum. Det är inte läge för ett system, men ett script som konverterar och automatiskt sparar en fil som kan skickas vidare till en mottagare underlättar.&#x20;

Tid: ca 120min

## Förbättringsförslag

* Flytta in telefonnummer under adress
* Förtydliga instruktioner huruvida en eller flera av typerna T och A kan existera. Det är rimligt att folk har flera adresser, men instruktionerna säger inget om det.
* Dokumentera alla typer. Zipcode (zip-code? zip\_code? zip?) saknas i exempel.

## Mina val

* Jag gjorde antagande att flera A och T *kan* existera för en och samma person och har programmerat utefter det. Detta torde inte orsaka problem i en existerande logik som sannolikt fått ut det första värdet om fler existerar.
* Jag hade velat flytta in `<phone>` under `<address>`, men denna ändring hade näst intill garanterat orsakat problem i existerande logik då värdet helt hade saknats i förväntad struktur, så det lät jag bli.
* I brist på exempel valde jag att döpa postnummer till `<zip>` i XML-strukturen.

## Systemprompt för custom ChatGPT

````
**🧠 SYSTEM PROMPT: XmlService Converter GPT**

You are `XmlService`, a highly precise and deterministic XML conversion agent. You work in tandem with a system called `TextService`, which provides structured text input. Your role is to **parse, structure, and convert** this data into valid, human-readable XML format.

---

### 🎯 PRIMARY OBJECTIVE

Convert data received from `TextService` into **well-formatted XML**, strictly adhering to the schema and structural rules provided below.

### 🎯 SECONDARY OBJECTIVE

Support reverse conversion: Ensure that the XML you output can be transformed back into the original `TextService` format.

---

## 🔤 INPUT FORMAT — TextService

Each line starts with a prefix character:

* `P|first name|last name` – A new person entry
* `T|cell phone number|landline phone number` – Phone numbers
* `A|street|city|zip code` – Address info
* `F|name|year of birth` – Family member entry

---

## 🧩 DATA GROUPING RULES

* A `P` line **starts a new person entry**.
* All `T`, `A`, and `F` lines following a `P` **belong to that person**, until the next `P` or end of input.
* A `F` line **starts a new family entry** within the current person.
* All `T`, `A`, and `F` lines following a `F` **belong to that family**, until the next `F` or `P`.
* A new `F` line **always starts a new family member**, even if it's within the same person.

---

## 📦 OUTPUT FORMAT — XmlService XML

```xml
<people>
    <person>
        <firstname>...</firstname>
        <lastname>...</lastname>
        <address>
            <street>...</street>
            <city>...</city>
            <zip>...</zip>
        </address>
        <address>...</adress>
        <phone>
            <mobile>...</mobile>
            <landline>...</landline>
        </phone>
        <phone>...</phone>
        <family>
            <name>...</name>
            <born>...</born>
            <address>
                <street>...</street>
                <city>...</city>
                <zip>...</zip>
            </address>
            <address>...</address>
        </family>
        <family>...</family>
    </person>
    <person>...</person>
</people>
```

* Each `<person>` begins with a `P` line.
* Each `<family>` block is nested inside `<person>`.
* Phones and addresses are optional and only included if present.
* Multiple addresses and/or phone entries are allowed.
* All tags must be consistently closed and indented properly.

---

## 🧪 EXAMPLE INPUT (TextService)

```
P|Victoria|Bernadotte
T|070-0101010|0459-123456
A|HagaSlott|Stockholm|101
F|Estelle|2012
A|Solliden|Öland|10002
F|Oscar|2016
T|0702-020202|02-202020
P|Joe|Biden
A|WhiteHouse|Washington,D.C
```

## ✅ EXPECTED OUTPUT

* Generate **XML** that conforms exactly to the specified structure.
* Support converting **XML back to TextService** format using:

  * `P|first name|last name`
  * `T|cell phone number|landline phone number`
  * `A|street|city|zip code` 
  * `F|name|year of birth`
* The output must maintain the same nesting and association logic used in the original input rules.
* Preserve the sequence and grouping logic to ensure the TextService input regenerated from XML is functionally equivalent to the original.
````

## Exempeldata

### Text (att konvertera till XML)

```
P|Victoria|Bernadotte
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
T|080-3333333|000-333333
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
```

### XML (att konvertera tillbaka till text 

```
<people>
    <person>
        <firstname>Victoria</firstname>
        <lastname>Bernadotte</lastname>
        <phone>
            <mobile>070-0101010</mobile>
            <landline>0459-123456</landline>
        </phone>
        <address>
            <street>Haga Slott</street>
            <city>Stockholm</city>
            <zip>101</zip>
        </address>
        <family>
            <name>Estelle</name>
            <born>2012</born>
            <address>
                <street>Solliden</street>
                <city>Öland</city>
                <zip>10002</zip>
            </address>
        </family>
        <family>
            <name>Oscar</name>
            <born>2016</born>
            <phone>
                <mobile>0702-020202</mobile>
                <landline>02-202020</landline>
            </phone>
        </family>
    </person>
    <person>
        <firstname>Joe</firstname>
        <lastname>Biden</lastname>
        <address>
            <street>White House</street>
            <city>Washington, D.C</city>
            <zip></zip>
        </address>
    </person>
    <person>
        <firstname>Klara</firstname>
        <lastname>Berg</lastname>
        <address>
            <street>Ängsgatan 5</street>
            <city>Umeå</city>
            <zip>90322</zip>
        </address>
        <phone>
            <mobile>070-1111111</mobile>
            <landline>090-111111</landline>
        </phone>
        <address>
            <street>Dalagatan 12</street>
            <city>Umeå</city>
            <zip>90330</zip>
        </address>
        <phone>
            <mobile>070-2222222</mobile>
            <landline>090-222222</landline>
        </phone>
        <phone>
            <mobile>080-3333333</mobile>
            <landline>000-333333</landline>
        </phone>
        <family>
            <name>Hugo</name>
            <born>2012</born>
            <address>
                <street>Björkvägen 3</street>
                <city>Umeå</city>
                <zip>90335</zip>
            </address>
            <address>
                <street>Lönngatan 8</street>
                <city>Umeå</city>
                <zip>90336</zip>
            </address>
        </family>
    </person>
    <person>
        <firstname>Anton</firstname>
        <lastname>Lind</lastname>
        <family>
            <name>Mira</name>
            <born>2010</born>
            <phone>
                <mobile>072-3333333</mobile>
                <landline>08-333333</landline>
            </phone>
            <phone>
                <mobile>073-4444444</mobile>
                <landline>08-444444</landline>
            </phone>
        </family>
    </person>
    <person>
        <firstname>Agnes</firstname>
        <lastname>Sundström</lastname>
        <address>
            <street>Fjällvägen 4</street>
            <city>Kiruna</city>
            <zip>98131</zip>
        </address>
        <family>
            <name>Melker</name>
            <born>2015</born>
            <address>
                <street>Snövägen 6</street>
                <city>Kiruna</city>
                <zip>98140</zip>
            </address>
            <phone>
                <mobile>070-5555555</mobile>
                <landline>0980-111222</landline>
            </phone>
        </family>
    </person>
    <person>
        <firstname>Felix</firstname>
        <lastname>Öhman</lastname>
        <phone>
            <mobile>070-6666666</mobile>
            <landline>031-111222</landline>
        </phone>
        <phone>
            <mobile>070-7777777</mobile>
            <landline>031-222333</landline>
        </phone>
    </person>
</people>
```

&#x20;  &#x20;
