# Arbetsprov - Wincent Ek

*(Denna journal uppdateras automatiskt utifrån inkommande inlägg)*

## Upplägg

Jag funderade på hur jag skulle lösa detta och kom snabbt fram till att jag vill lösa det på några olika vis.

* Metod 1: Chat GPT ([chatgpt](chatgpt/README.md))
* Metod 2: Python ([text2xml2text](text2xml2text/README.md))

---

## Dokumentation

Att löpande hålla detta dokumentet uppdaterat så att ni kan ta del av mitt tänk kändes viktigt.

Ackumulerad tid: ca 75min. 

## Metod 1: ChatGPT - Custom GPT

Ett sätt jag ville prova var att ge en användare möjlighet att använda ChatGPT, så jag skapade en egen custom GPT för ändamålet.

Jag knåpade på en systemprompt som definerade uppdraget, förutsättningarna och dataformatet. Ett ganska snabbt sätt att lösa uppdraget på på. Åtminstonde för en så här liten textmängd. Ett större konverteringsjobb med kanske tusentals rader hade inte funkat med denna lösningen.

Jag genererade 50-talet variationer av textdata och det var ju kul att se att den formatterar både fram och tillbaka mellan formaten. 

Vad som händer om textdata är helt galet felformatterat? Vad händer om det ena eller det andra? Det vet jag inte heller, men jag ville testa konceptet lite snabbt, och som koncept för en lite lösning funkade det bra.

### **Vem är användaren?**

Användaren har låg datormognad men behöver konvertera några rader lite då och då på ett enkelt vis.

### **Resultat**

[Öppna Wincents custom GPT](https://chatgpt.com/g/g-6835ec5574dc81919a9285e60e571739-arbetsprov-softhouse)

[Klicka här](chatgpt/README.md) för se systemprompten och kopiera exempeldata. 

**Tid:** ca 75min.

## Metod 2: Python - Text2Xml2Text

Jag ämnar att avsevärt förbättra mina Pythonkunskaper, så jag passade på att göra en lösning i Python också. 

Jag har förvisso skrivit några små tools i Python för Open WebUI, så helt novis är jag inte. Men Copilot, Claude och Google är definitivt mina kompisar här. Jag satte ihop ett litet script som helt enkelt läser in datat i det ena format och konverterar till det andra. Funkar åt båda hållen, som namnet *Txt2Xml2Txt* förhoppningsvis hintar om.

### Vem är användaren?

Användaren är van att starta script via CLI. Användaren har behov att göra större batchkonverteringar på några hundra rader eller fler med jämna mellanrum. Det är inte läge för ett system, men ett script som konverterar och automatiskt sparar en fil som kan skickas vidare till en mottagare underlättar vardagen.

### **Resultat**

[Instruktioner: text2xml2text](text2xml2text/README.md)

Tid: ca 120min

## Förbättringsförslag uppdragsbeskrivning

* Flytta in telefonnummer under adress
* Förtydliga instruktioner huruvida en eller flera av typerna T och A kan existera. Det är rimligt att folk har flera adresser och telefonnummer, men instruktionerna säger inget om det.
* Dokumentera alla typer. Zipcode (zip-code? zip_code? zip?) saknas i exempel.

## Egna val

* Jag gjorde antagande att flera A och T *kan* existera för en och samma person och har programmerat utefter det. Detta torde inte orsaka problem i en existerande logik som sannolikt fått ut det första värdet om fler existerar.
* Jag hade velat flytta in `<phone>` under `<address>`, men denna ändring hade näst intill garanterat orsakat problem i existerande logik då värdet helt hade saknats i förväntad struktur, så det lät jag bli.
* I brist på exempel valde jag att döpa postnummer till `<zip>` i XML-strukturen.
