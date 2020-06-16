# Projinda Project 'Playit'
##### Skapare: David Schalin, Gabriel Christensson
##### Version 1.0
##### Datum: 2020-04-23

### Projektbeskrivning
<hr style="border-top: 1px dotted #eaecef;" />
'Playit' är en webapplikation som låter dig som användare bestämma dina egna regler i vissa utvalda spel.
Dessa spel kan exempelvis vara kort- och tärningsspel eller spel utan redskap.
Som användare kan du skapa ett konto och spara dem olika spelen så att du kan spela dem vid olika tillfällen.



### Installation
<hr style="border-top: 1px dotted #eaecef;" />

Följ nedan instruktioner för att kunna köra Playit lokalt på din dator.
 1. Klona repot till valfri plats på datorn
 2. Installera senaste versionen av Node.js (kan hittas här: https://nodejs.org/en/download/)
 3. Öppna din terminal och navigera till det klonade repot lokalt
 4. Kör kommandot `npm install`. Nödvändiga moduler (ramverk, Nodepaket etc.) kommer installeras automatiskt till ditt repo och läggs i mappen node_modules. Dessa måste installeras för att webapplikationen ska fungera. Vänta tills alla moduler har laddats ned.
 5. För att starta appen/servern lokalt kör du sedan kommandot `npm start` från samma plats (projektets root-mapp). När servern är startad kommer terminalen vara "pausad", alltså kan du inte skriva in några kommandon.
 6. Med servern startad kan du nu nå webapplikationen och Playit genom att besöka http://localhost:3000/ i din webbläsare.
 7. För att avsluta servern/appen kan du göra `control + c` i terminalen (ska funka för både Mac, Linux och Windows).


### Teknisk Beskrivning
<hr style="border-top: 1px dotted #eaecef;" />
Playit är en hemsida som använder sig av flera features som skiljer sig från ren html kod.

#### handlebars
Istället för html kod för varje sida så används handlebars. Vi skapade en fil som heter `layout.hbs` som håller
layouten som det är menat att alla sidor i playit ska ha. Sedan skapades olika .hbs filer till varje enskild sida
som höll den specifika designen för den sidan.

#### mongodb
För att spara information användes mongodb. En databas som vi kunde spara användare och det som tillhör användaren i.
Där sparas en user som ett "document" som har flera fält eller arrayer. Där sparas då fälten:
- username
- email
- password (krypterat)
- id
- games[  ]

I games sparas då alla spel som användaren har skapat som enskilda objekt med ett eget id och arrayer som 
innehåller regler och förberedelser samt fält för id och namn på spelet


#### js + libraries
javascript är det programmeringspråk som playit har skrivits i (om man inte räknar med html och css vilket vi inte gör).
Med JS skapades flera olika handles (metoder som användes för att redirecta från en sida till en annan samt hämta information från databasen).

##### Node.js
Används för att hosta servern och för att hjälpa backenden prata med frontenden.

##### Bcrypt
Används för att kryptera lösenorden till konton

##### Passport
Ett bibliotek för att hantera användare och interagera med dem.

##### Mongoose
Används för att interagera med databasen

##### Express
Används tillsammans med Node.js för att skapa de olika handles som används för att klicka runt på hemsidan.
