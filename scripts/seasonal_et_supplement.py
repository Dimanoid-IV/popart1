# UTF-8 Estonian HTML fragments appended before cross-links in seasonal ET articles.
# Goal: reach ~2000–2500 words total per article without duplicate padding.

ET_SUPPLEMENT: dict[str, str] = {}


def _p(*lines: str) -> str:
    return "".join(f"<p>{t}</p>" for t in lines)


def _h2(title: str, paras: list[str]) -> str:
    return f"<h2>{title}</h2>" + _p(*paras)


ET_SUPPLEMENT["joulukingitus-2026"] = (
    _h2(
        "Detsember Eestis: need päevad “kaovad” kalendrist enne, kui märkategi",
        [
            "Jõulukingitus 2026 ei sõltu ainult teie headest kavatsustest — ta sõltub ka sellest, mitu tööpäeva on järel enne jõululaupäeva. "
            "Kui teie plaanis on eelvaade, parandused, trükk, pakendamine ja tarne üle Eesti, ei ole ükski neist “null sekundiga” samm.",
            "Tallinnas võib kullerite tihedus olla suurem, aga see ei tähenda automaatselt seda, et kõik saab homme kätte — eriti siis, kui järjekord on pikk ja eelvaatele vastamine venib.",
            "Kui te kirjutate tellimuses tähtaja kuupäevana (mitte “enne jõule” üldiselt), saate ausama vastuse ja vähendate omavahelist arusaamatust.",
        ],
    )
    + _h2(
        "Tellimuse marsruut: foto → eelvaade → kinnitus → trükk → pakend → tarne",
        [
            "Premium-tunne tekib siis, kui protsess on ette aimatav. Teie foto on lähtepunkt, aga tegelik kingitus sünnib alles siis, kui kompositsioon on paigas ja teie olete eelvaate kinnitanud.",
            "Trükk ja pakendamine võtavad oma aja — need ei ole dekoratiivsed sõnad, vaid reaalsed tööetapid. Tarne üle Eesti lisab veel ühe muutuja: piirkond, ilm, kättesaamise aken.",
            "Kui te jätate endale puhvri vähemalt paar tööpäeva enne seda päeva, mil king peab kindlasti olema käes, vähendate oluliselt “kulleriga võistlemise” stressi.",
        ],
    )
    + _h2(
        "Kolm klassikalist jõuluviga (ja kuidas neist mööda minna)",
        [
            "Esimene viga on liiga madala resolutsiooniga foto, mida “suurendatakse lootuses”. Teine viga on mõõt ilma seina kontekstita. Kolmas viga on tellimus ilma tähtajata — siis jääb kõik õhku.",
            "Kõik kolm on parandatavad enne makset: valige teravam foto, tehke mockup või valige universaalsem mõõt, kirjutage tellimuses tähtaeg ja linn.",
            "Kui te kingite mitmele inimesele korraga, tehke iga kingi jaoks mini-nimekiri: foto, mõõt, tarneaadress, tähtaeg. Segadus on jõuluhooajal kallim kui paar lisaminutit planeerimisel.",
        ],
    )
    + _h2(
        "Jõulukingitus vanavanematele: ligipääsetavus, ruum ja turvaline üleandmine",
        [
            "Vanemate inimeste koju kingitud portree peaks arvestama lihtsusega: kas pilt on kerge riputada, kas ta ei nõua keerulist paigaldust, kas pakk on liiga raske tõsta.",
            "Tallinnas ja väiksemates asulates võib kättesaamine olla erinev — mõnikord on pakiautomaat mugav, mõnikord on parem kuller, kes toob ukse taha. Oluline on valida variant, mis vähendab vigastuste riski.",
            "Kui te ei tea täpselt nende seina võimalusi, eelistage mõõtu, mis sobib ka lauale või riiulile — see annab kingisaajale rohkem valikuvabadust ilma sunnita.",
        ],
    )
    + _h2(
        "Jõululaud ja kingi avamine: kuidas hoida emotsiooni ilma piinliku “teatri” tundeta",
        [
            "Pereringis kingi avamine tähendab, et foto võib saada hetkeks tähelepanu keskmes. Kui valite liiga intiimse kaadri, võib kingisaaja tunda end ebamugavalt — isegi kui teie kavatsus oli soe.",
            "Jõulukingitus 2026 võidab sageli see, mis on ilus, aga ka külaliste ees lugupidav: loomulik naer, ühine hetk, kodu soojus ilma liigse “lavastuseta”.",
            "Kui te kahtlete, küsige vaikselt teiselt pereliikmelt või valige rahulikum taust — eelvaade aitab teil seda otsust teha enne trükki, kui tagasirutamine on kallis või võimatu.",
        ],
    )
    + _h2(
        "Varajane ost kui kingi “kvaliteedimärk”: miks see müüb paremini kui allahindlus",
        [
            "Eesti ostja on hooajal tundlik hinna suhtes, aga veelgi tundlikum on ta pettumuse suhtes. Varajane ost ei ole ainult logistika — see on signaal, et te võtsite kingi tõsiselt.",
            "Kui te tellite varakult, on teenusepoolel rohkem ruumi teha tööd korrektselt: vähem kiirust, vähem kompromisse. See on eriti oluline portree puhul, kus detailid määravad elutoas tulemuse.",
            "Kui te loete seda artiklit oktoobris või novembris, olete juba eelistamas detsembri paanikat — see on teie jõulukingitus 2026 salarelv.",
        ],
    )
    + _h2(
        "Kunstiline portree fotost: miks see on jõulukingi “kõrgema kontrolliga” ost",
        [
            "Jõulukingitus 2026 Eestis on sageli kiire ost, aga portree fotost on vastupidine: see nõuab teadlikku fotot, mõõtu ja eelvaadet. See ei ole miinus — see on kingi kvaliteedi garantii teile endale.",
            "Kui te ostate “valmis eseme”, võite saada täpselt selle, mis pildil. Kui te tellite personaalse tõlgenduse, on teie panus osa tulemusest — ja see teeb kingi ausamaks.",
            "Premium positsioneerimine tähendab, et te ei pea ostma “lootuses”: te kinnitate tulemuse enne trükki. See vähendab riski, et jõululaupäeval peate vabandama.",
        ],
    )
    + _h2(
        "Eesti jõulutarne: miks “Tallinn kiire” ei ole automaatika",
        [
            "Tallinn on tihe logistiline sõlm, aga tellimuste maht võib detsembris kasvada nii, et ka kiired linnad tunnevad ahela pinget. Seetõttu on tähtaeg kirjas olulisem kui postikood üksi.",
            "Maapiirkonnas võib kättesaamine sõltuda akendest ja ilmast — see ei ole takistus, kui te jätate puhvri ja valite turvalise kättesaamise koha.",
            "Kui te tahate kingi kätte konkreetsel päeval, kirjutage see tellimuses numbriga ja küsige kinnitus. See samm võtab minuti, aga säästab tunde.",
        ],
    )
    + _h2(
        "Tellimuse märkused, mis teevad tööst kiirema (ilma ülejuhtimiseta)",
        [
            "Hea märkus on konkreetne: “tähtaeg 22.12, Tallinn, kättesaamine pärast 17:00”. Halb märkus on “enne jõule palun”, sest see ei anna töökorralduses piisavat raami.",
            "Kui teil on mitu tellimust, nummerdige need või kasutage selgeid nimesid — jõuluhooajal segunevad tellimused kergesti.",
            "Kui te tahate eriti konservatiivset stiili, kirjutage see otse: “rahulik taust, vähe efekti”. Eelvaade ikkagi kinnitab lõpptulemuse.",
        ],
    )
    + _h2(
        "Jõulukingitus tööl vs kodus: kuidas valida foto, mis ei pane kedagi ebamugavasse",
        [
            "Kui king läheb kolleegile või juhile, eelistage professionaalsemat või neutraalsemat kaadrit — portree võib olla soe, aga mitte liiga kodune, kui te ei tea konteksti.",
            "Kui king on pereringis, saate olla emotsionaalsem, aga ikkagi tasakaalustatud: pereringis avatud king näeb rohkem inimesi kui ainult kingisaaja.",
            "Kui te kahtlete, valige foto, mis on ilus ka siis, kui kõrval on võõras inimene — see on praktiline, mitu ainult konservatiivne mõte.",
        ],
    )
    + _h2(
        "Pärast jõule: kuidas portree koju “juurdub” ilma sunnita",
        [
            "King ei lõppe üleandmisega — ta lõppeb siis, kui pilt leiab koha. Kui te annate kaasa lihtsa paigalduse mõtte või viite mõõdu juhendile, suurendate tõenäosust, et pilt läheb kohe seinale.",
            "Kui kingisaaja elab rendis või kolis sageli, valige mõõt, mis ei nõua “õiget elutuba”: universaalsem mõõt annab rohkem valikuid.",
            "Kui te tahate, et king meenutaks teid aastaid, valige ajatu kompositsioon — trendid vahetuvad, mälestused jäävad.",
        ],
    )
)

ET_SUPPLEMENT["joulukingitus-naisele"] = (
    _h2(
        "Jõulukingitus naisele: interjöör kui peidus olev tegur",
        [
            "Naisele kingitud portree ei ole ainult “ilus pilt” — ta peab ka koju sobima. Minimalistlik tuba kannab sageli vaiksemat tausta ja rahulikumat kompositsiooni; soe, värviline kodu kannab rohkem iseloomu.",
            "Kui te ei tea täpselt tema maitset, on turvaline strateegia valida klassikaline kompositsioon ja lasta eelvaates kinnitada tausta intensiivsust.",
            "Tallinnas elavate inimeste kodud on väga erinevad — ära assumeerige, et “kõigile sobib üks ja sama valge sein”. Küsige endalt: mis värvid tal juba kodus domineerivad?",
        ],
    )
    + _h2(
        "Kui ta on “tal on kõik juba” tüüpi inimene",
        [
            "See fraas on sageli kaitsemehhanism, mitte tõde. Portree toimib siin hästi, sest ta ei dubleeri kappi ega sahtlit — ta seab esile mälestuse, mida ei saa poest “samast riiulist” osta.",
            "Jõulukingitus naisele 2026 võib olla eriti tugev, kui valite foto hetkest, mis ei vaja pikka selgitust: ühine reis, lapsed, koduõhtu naer või lihtsalt see, kui ta on iseendaga rahul.",
            "Kui te kardate, et king on liiga sentimentaalne, hoidke stiil vaoshoitud ja laske pildil rääkida — liiga palju sõnu kingikaardil võib teha vastupidise efekti.",
        ],
    )
    + _h2(
        "Kingipaki esteetika ja “esimene mulje” enne, kui pilt seinal on",
        [
            "Premium kingitus algab pakendist. Kui pakk on tugev ja sisemus on kaitstud, jääb emotsioon alles ka siis, kui kuller oli kiire.",
            "Kui te tellite tarne üle Eesti otse kingisaajale, mõelge sõnumile kullerile ja kättesaamise aknale — jõulud on täis graafikuid ja väsimust.",
            "Kui te toote kingi ise üle, planeerige 10 minutit vaikseks hetkedeks. See on väike asi, mis muudab mälestuse.",
        ],
    )
    + _h2(
        "Naisele jõulukingitus ja eelvaade: kuidas küsida parandusi ilma “õigustatud kriitikuta”",
        [
            "Eelvaade on teie õigus ja teie kingi kindlustus. Kui te tahate muuta tausta või taastusrõhku, öelge see konkreetselt: “soojem”, “vaiksem”, “vähem kontrasti”.",
            "Kui te ei vasta eelvaatele kohe, võib järjekord edasi lükkuda — hooajal on see kallis viivitus. Seetõttu on mõistlik määrata endale meeldetuletus telefonis.",
            "Kui te olete tellimuse juba maksnud, ärge jätke suhtlust “hilisemaks”: kiire kinnitus on kingi osa.",
        ],
    )
    + _h2(
        "Tallinn ja üle Eesti: kuidas valida tarne viis, mis ei riku jõuluõhtut",
        [
            "Kui king peab olema käes kindlal päeval, kirjutage see tellimuses numbriga. “Enne jõule” võib tähendada erinevaid asju erinevatele inimestele.",
            "Maapiirkonnas võib kättesaamine olla vähem painlik — see ei ole probleem, kui te jätate puhvri ja valite turvalise kättesaamise koha.",
            "Kui te kahtlete, küsige enne makset: see on tervislik küsimus, mitte umbusk.",
        ],
    )
    + _h2(
        "Jõulukingitus naisele ja “õige foto” stress: tehke otsus 20 minutiga",
        [
            "Kui te jätate foto valiku lõputult edasi, kannatab tellimus. Määrake endale 20 minutit: valige kaks kandidaati, võrrelge teravust ja emotsiooni, valige see, mis tekitab teis endas sooja tunde.",
            "Kui te kahe variandi vahel ei oska, küsige sõbralt, kes tunneb teda — see ei vähenda kingi väärtust, see vähendab riski.",
            "Kui te valite foto, mis on tehniliselt nõrgem, aga emotsionaalselt tugev, küsige enne makset ausalt, kas trükk kannab — see on parem kui “lootuses” tellimine.",
        ],
    )
    + _h2(
        "Naisele jõulukingitus ja interjööri värvikartell: kuidas mitte “võidelda” diivaniga",
        [
            "Kui diivan on soe beež ja sein on hall, ei pruugi väga külm sinine taust koju sobida. Te ei pea olema disainer — te peate lihtsalt märkama, mis toonid juba domineerivad.",
            "Kui te ei tea, tehke üks foto seina ja diivani taustast (diskreetselt) — see aitab valida tausta, mis ei riku ruumi.",
            "Eelvaade on koht, kus saate vaikselt korrigeerida, ilma et peaksite pärast tundma, et “pidanuks varem ütlema”.",
        ],
    )
    + _h2(
        "Kingitus naisele, kes hindab privaatsust: kuidas hoida portreed ilusaks, aga mitte eksponeerivaks",
        [
            "Portree võib olla väga isiklik. Kui te teate, et ta ei taha “üle kõigi näha” hetke, valige kaader, mis on soe, aga piisavalt üldine, et see sobiks ka külaliste ees.",
            "Kui te kingite jõuludel pereringis, mõelge avamise hetkele: mis foto tundub ilusana, mitte piinlikuna.",
            "Kui te kahtlete, valige naer või ühine tegevus — need on sageli turvalisemad kui väga intiimne kaader.",
        ],
    )
    + _h2(
        "Jõulukingitus naisele 2026 ja tarne üle Eesti: millal on mõistlik tellida otse tema aadressi",
        [
            "Kui te tahate üllatust, on otse tellimine keerulisem, aga mõnikord on see ainus viis. Siis on oluline, et kättesaamine oleks kindel: uksekood, telefon, turvaline koht.",
            "Kui te tahate ise üle anda, tellige endale või valige kättesaamine, mis ei riku pakki (niiskus, külm).",
            "Tallinnas on variante rohkem, aga Eesti on väike — ka väljaspool Tallinna saab hästi toimida, kui aadress on täpne.",
        ],
    )
    + _h2(
        "Naisele jõulukingitus ja kingikaart: kolm lauset, mis ei tee liiga",
        [
            "Esimene lause: õnnitlus. Teine: miks see foto. Kolmas: miks see on tema jaoks. Portree teeb emotsionaalse töö ära — tekst toetab, mitte ei konkureeri.",
            "Kui te kardate, et sõnad teevad liiga sentimentaalseks, hoidke need konkreetsed: “see hetk meenutas mulle, kui me…” on sageli parem kui abstraktne “sa oled eriline”.",
            "Kui king on ka ärilisem (nt kolleeg), hoidke toon professionaalselt soe.",
        ],
    )
    + _h2(
        "Kui te olete “õige kingi” otsingus ringi käinud juba nädalaid",
        [
            "Ringi käimine on tavaline, aga jõuluhooajal maksab iga nädal järjekorras. Kui te olete juba lugenud juhendeid, on järgmine samm tegevus: foto, mõõt, tähtaeg.",
            "Kui te kahtlete mõõdus, valige universaalsem ja küsige mockupi mõte <a href='/et/blog/seinapilt-tellimine'>seinapilt tellimine</a> artiklist.",
            "Kui te olete valmis, alustage <a href='https://www.popart.ee'>PopArt.ee</a> tellimusest — varajane tegevus on jõulukingitus naisele parim lisakingitus.",
        ],
    )
    + _h2(
        "Miks portree on jõulukingitus, mis ei dubleeri tema ehteid, kreeme ega kodumasinaid",
        [
            "Paljud naised saavad hooajal kingitusi, mis kipuvad olema sarnased kategooriad. Portree on teine žanr: see on mälestus, mis elab seinal, mitte kapis.",
            "Kui te tahate kingi, mis jääb meelde, on “nähtav mälestus” tugev valik — eriti kui foto on teie ühine lugu.",
            "Kui te kardate duplikaati, valige foto, mis on ainult teie perel olemas — siis ei saa keegi teist “sama osta”.",
        ],
    )
)

ET_SUPPLEMENT["joulukingitus-mehele"] = (
    _h2(
        "Jõulukingitus mehele: kuidas vältida “suvalise kinke” tunnet ilma draamata",
        [
            "Meestele suunatud kingid satuvad tihti funktsionaalsuse lõksu: midagi, mis “läheb korda”, aga ei jäta mälestust. Portree toob isiklikkuse sisse ilma, et peaksite arvama lõhna, suurust või hobi varustust.",
            "Jõulukingitus mehele 2026 võidab sageli rahulik stiil: tugev kompositsioon, selge fookus, taust, mis ei karju üle pildi.",
            "Kui tema kodu või kontor on väga neutraalne, on see hea uudis — neutraalne taust töötab portreega sageli kõige stabiilsemalt.",
        ],
    )
    + _h2(
        "Foto valik: perekond, töö või ühine mälestus — mis on kõige turvalisem?",
        [
            "Kui te kahtlete, valige mälestus, mis ei vaja konteksti: naer, ühine tegevus, lapsed, koduõhtu hetk. Need fotod “loevad end ise” ka siis, kui teie kingikaart on lühike.",
            "Kui te tahate väljendada austust (nt isa rolli), valige foto, kus suhe on näha, aga stiil jääb rahulikuks — eelvaade aitab hoida tooni õigel tasemel.",
            "Sportlik hetk võib olla super, aga kontrollige, kas see sobib seina peale aastateks — jõulukingitus peaks sageli vananema ilusalt, mitte trendina.",
        ],
    )
    + _h2(
        "Mõõt ja “mehe tuba”: kuidas mitte tellida liiga suurt",
        [
            "Kui te ei tea seina mõõtu, ärge kompenseerige muret suurusega. Liiga suur pilt võib tunda end koormavana, eriti kui ruum on kompaktne.",
            "Mockup telefonis (pilt seinal) aitab palju — kui teil pole aega, küsige universaalsemat mõõtu, mis sobib ka lauale.",
            "Lisajuhendina vaadake <a href='/et/blog/seinapilt-tellimine'>seinapilt tellimine</a> artiklit enne lõplikku valikut.",
        ],
    )
    + _h2(
        "Jõulud ja üleandmine: kui te ei ole “iseenda kingisaaja” tüüpi huumorimees",
        [
            "Kui te kingite mehele, kes ei taha tähelepanu keskmes olla, planeerige üleandmine vaiksemalt: vähem publikut, rohkem konkreetsust.",
            "Kui te ei saa kohale minna, tehke pakk tugevaks ja kirjutage selge juhis — jõulud on kulleritele koormav, aga hea pakend kaitseb emotsiooni.",
            "Tallinnas võib isiklik üleandmine olla lihtsam, aga Eesti on väike: ka kaugemal on lahendused olemas, kui aadress on õige.",
        ],
    )
    + _h2(
        "Tarne üle Eesti ja tähtaeg: aus plaan > õnnelik lootus",
        [
            "Kui te märkite tellimuses tähtaeg ja linn, saate vastuse, mis põhineb reaalsel graafikul, mitte soovil.",
            "Kui te loete seda detsembris, küsige otse: mis on veel jõutav. See küsimus säästab teid pettumusest ja säästab teenust ebarealistlikest lubadustest.",
            "Varajane tellimus on jõulukingitus mehele sageli parim “lisakingitus”, sest see näitab, et te ei jätnud kõike viimasele nädalale.",
        ],
    )
    + _h2(
        "Jõulukingitus mehele ja “praktiline mees”: kuidas portree ei tundu “ebapraktiline”",
        [
            "Praktiline kingitus on sageli see, mida saab kasutada. Portree on praktiline teises mõttes: ta on nähtav meeldetuletus mälestusest ja ei kao sahtlisse.",
            "Kui te kardate, et ta ütleb “mul pole kuhu panna”, valige universaalsem mõõt ja andke kaasa mõte lauale või kontorisse — see vähendab hõõrdumist.",
            "Kui te ei tea seina, on mockup või <a href='/et/blog/seinapilt-tellimine'>seinapilt tellimine</a> juhend parem kui suurusmäng.",
        ],
    )
    + _h2(
        "Kui ta on hobi-inimene: kas spordifoto või pere foto on parem jõulukingiks?",
        [
            "Hobi-foto võib olla äge, aga see võib ka kiiresti vananeda stiilitajuga. Pere mälestus või rahulik portree kannab sageli kauem ja sobib laiemalt interjööris.",
            "Kui te valite hobi, tehke seda teadlikult: “see on tema lugu” peab olema selge ka siis, kui teine pereliige näeb pilti.",
            "Eelvaade aitab hinnata, kas tulemus jääb liiga “mänguliseks” või saab elegantseks.",
        ],
    )
    + _h2(
        "Jõulukingitus mehele ja kingikaart: lühidus võidab",
        [
            "Kolm lauset piisab. Pikad monoloogid võivad teha kingi raskemaks kui portree ise.",
            "Kui te tahate austust, kirjutage konkreetselt, miks see foto: “see päev oli meile pöördepunkt” töötab paremini kui üldised komplimendid.",
            "Kui king on pereringis, hoidke sõnum soe, aga mitte intiimne — sõltuvalt publikust.",
        ],
    )
    + _h2(
        "Kontor vs kodu: kuhu pilt lõpuks läheb (ja miks see mõjutab mõõtu)",
        [
            "Kui pilt läheb kontorisse, võib ta vajada rahulikumat tausta ja vähem “kodusooja” dramaturgiat. Kui pilt läheb koju, saate olla soojem.",
            "Kui te ei tea, kuhu pilt läheb, valige neutraalsem kompositsioon — see on turvaline premium-valik.",
            "Tallinnas on palju kodu-kontori segasid ruume; neutraalne stiil kannab sageli mõlemat.",
        ],
    )
    + _h2(
        "Kui te olete viimase minuti ostja: mis on veel päästetav?",
        [
            "Märgige tellimuses tähtaeg ja küsige ausalt, mis on jõutav. Võimalik, et mõõt tuleb valida väiksem või graafik konservatiivsem.",
            "Kiirus ei tohiks tähendada eelvaate vahelejätmist — see on see koht, kus tekivad jõulupettumused.",
            "Kui vastus on “ei mahu”, on parem ausalt plaan B kui halb trükk.",
        ],
    )
    + _h2(
        "Miks portree on jõulukingitus mehele, mis ei vaja “õiget suurust kapis”",
        [
            "Paljud meeste kingid nõuavad suurust või ühilduvust. Portree nõuab mõõtu seina või pinna suhtes — seda saab kontrollida mockupiga.",
            "Kui te ei tea mõõtu, valige universaalsem ja laske eelvaatel kinnitada kompositsiooni tasakaal.",
            "Kui te tahate premium-tulemust, on varajane tellimus endiselt parim relv — isegi kui teie otsus tundub “lihtne”.",
        ],
    )
    + _h2(
        "Jõulukingitus mehele 2026: varajane ost kui kingi osa, mitte ainult logistika",
        [
            "Varajane ost näitab, et te võtsite otsuse tõsiselt. See annab teenusele aega teha töö korrektselt — ja teile aega kinnitada tulemus rahulikult.",
            "Kui te loete seda novembris, olete juba võitmas detsembri järjekorra vastu.",
            "Kui te loete seda detsembris, alustage kohe: iga päev loeb järjekorras. Alustage tellimus <a href='https://www.popart.ee'>PopArt.ee</a> kaudu ja märkige tähtaeg.",
        ],
    )
)

ET_SUPPLEMENT["emadepaeva-kingitus"] = (
    _h2(
        "Emadepäeva kingitus Eestis: miks mai kuu on tellimuste tihe",
        [
            "Emadepäeva kingitus ei ela ainult ühel pühapäeval — ta elab kogu mai kuu emotsioonis. Paljud inimesed tellivad korraga, mistõttu järjekord võib pikeneda isegi siis, kui ilm veel jahe on.",
            "Kui te planeerite portreega emotsiooni, jätke ruumi eelvaatele: emadepäeva kingitus on sageli tundlik tellimus ja detailid loevad.",
            "Tallinnas tellides ärge unustage, et tarne üle Eesti võib olla kiire, aga trüki-eelvaate ahel võib olla sama pikk kui mujalgi — need on erinevad asjad.",
        ],
    )
    + _h2(
        "Milline foto “kõnetab” ema südant ilma ülepaisutuseta",
        [
            "Parimad fotod on sageli need, kus ema on iseendaga loomulik: lastega mängus, köögis koos, ühises naerus või lihtsalt vaikses hetkes.",
            "Vältige liiga ranget poosi — need võivad trükis tunda end pingestatult. Loomulik valgus ja teravus teevad imet.",
            "Kui teil on mitu head fotot, valige see, mis ei vaja selgitust. Kingikaart võib olla lühike, kui pilt räägib iseenda eest.",
        ],
    )
    + _h2(
        "Emadepäev ja kingi kontekst: perering vs üksinda üleandmine",
        [
            "Kui king avatakse peres, valige foto, mis on ilus ka siis, kui kõrval on tädi või lapsed. See on praktiline kaalutlus, mitu ainult konservatiivsus.",
            "Kui te annate kingi kahekesi, võib olla rohkem ruumi intiimsemaks mälestuseks — aga portree puhul tasub ikka mõelda seina kontekstile.",
            "Kui te kingite vanaemale, mõelge ligipääsetavusele: kas king on kerge, kas ta leiab koha ilma suure remontta.",
        ],
    )
    + _h2(
        "Tähtaeg ja tellimus: mitu nädalat enne emadepäeva on mõistlik puhver?",
        [
            "Hea reegel on planeerida nii, nagu teil oleks vaja vähemalt paar nädalat enne tähtpäeva valmis pilt käes. Siis jääb ruumi eelvaate parandustele ja ootamatutele tööpäevadele.",
            "Kui te tellite väga hilja, märkige tellimuses tähtaeg ja küsige ausalt, mis on veel jõutav — parem on väiksem mõõt õigel ajal kui suur hilinemine.",
            "Tarne üle Eesti tähendab, et te ei pea ise sõitma — aga see ei tähenda automaatset “homme valmis”.",
        ],
    )
    + _h2(
        "Emadepäeva kingitus kui premium otsus: protsess, mitte ainult tulemus",
        [
            "Premium on eelvaade, turvaline tellimus ja viimistletud trükk. Kui need on paigas, tunneb ema seda kohe, kui ta paki avab.",
            "Kui te tahate lisaks portreele väikese praktilise elemendi (raamimise mõte või paigaldus), kirjutage see tellimuses selgelt, et segadust ei tekiks.",
            "Kui te otsite üldisemaid kingimõtteid, vaadake ka <a href='/et/blog/personaalne-kingitus'>personaalne kingitus</a> juhendit.",
        ],
    )
    + _h2(
        "Emadepäeva kingitus ja “õige emotsioon”: kuidas mitte minna üle piiri",
        [
            "Emadepäeva kingitus kipub olema sentimentaalne — see on ilus, aga liiga suur draama võib teha kingi raskemaks kui soovisite.",
            "Portree annab emotsiooni visuaalselt; teie sõnad võivad olla lühikesed. See kombinatsioon töötab sageli kõige paremini.",
            "Kui te kahtlete, valige loomulik naer või vaikne õnn — need on universaalsemad kui väga intiimne kaader.",
        ],
    )
    + _h2(
        "Ema rollid: kas king on emale, vanaemale või “emale emana”",
        [
            "Kui te kingite vanaemale, mõelge füüsilisele mugavusele ja sellele, kas foto on liiga “nooruslik” võrdluses tema praeguse enesetundega — mitte et see peaks olema probleem, aga tundlikkus aitab.",
            "Kui te kingite ämma või partneri emale, hoidke toon lugupidav: rahulik stiil ja selge kompositsioon.",
            "Kui te kingite oma emale, võite olla emotsionaalsem, aga ikkagi mõelge, kas foto sobib pereringis avamiseks.",
        ],
    )
    + _h2(
        "Mai kuu tellimuste tipud ja Eestis tööpäevad: miks “paar päeva” ei ole alati piisav",
        [
            "Eesti tööpäevad ei pikene emadepäeva pärast — tellimuste maht võib siiski kasvada, sest paljud inimesed tellivad sama tähtpäeva jaoks.",
            "Kui te jätate ruumi eelvaatele, vähendate riski, et parandus ei mahu graafikusse.",
            "Kui teil on tähtaeg, kirjutage see tellimuses numbriga; “enne emadepäeva” võib tähendada erinevaid asju.",
        ],
    )
    + _h2(
        "Emadepäeva kingitus ja tarne üle Eesti: kuidas valida kättesaamine, mis ei riku õnne hetke",
        [
            "Kui te ei saa ise üle anda, valige turvaline kättesaamise koht ja tugev pakk. Portree on king, kus pakendi kvaliteet on osa teenusest.",
            "Tallinnas võib kullerite graafik olla tihe — kirjutage kontakt ja uksekood selgelt.",
            "Kui te tellite maale, jätke puhver: kättesaamise aknad võivad olla kitsamad.",
        ],
    )
    + _h2(
        "Kuidas kombineerida portreed väikese praktilise lisaga ilma “komplekti” tundeta",
        [
            "Väike lisa võib olla raamimise juhis või paigalduse mõte — see ei vähenda portree väärtust, vaid muudab kingi kasutamise lihtsamaks.",
            "Kui te ei tea, kas lisa on vajalik, jätke see välja — parem on lihtne ja korras olev portree kui segane komplekt.",
            "Kui te tahate tugevamat kunstilist joont, vaadake ka <a href='/et/blog/kunstiline-portree'>kunstiline portree</a> juhendit.",
        ],
    )
    + _h2(
        "Emadepäeva kingitus 2026: varajane ost kui kingi kvaliteedi osa",
        [
            "Kui te tellite aprillis või mai alguses, on teil rohkem ruumi mõõtu ja tausta arutada ilma paanikata.",
            "Kui te tellite mai keskel, märkige tellimuses tähtaeg ja küsige ausalt, mis on veel jõutav.",
            "Kui te olete valmis, alustage <a href='https://www.popart.ee'>PopArt.ee</a> tellimusest — varajane tegevus on emale parim sõnum ilma sõnadeta.",
        ],
    )
)

ET_SUPPLEMENT["isadepaeva-kingitus"] = (
    _h2(
        "Isadepäeva kingitus: “vähem sõnu, rohkem tegu” võib tähendada ka portreed",
        [
            "Isadepäeva kingitus ei pea olema järjekordne vidin. Portree on tegu, mis jääb koju nähtavale kohale — ilma pikkade selgitusteta.",
            "Kui isa on reserveeritud, töötab sageli paremini rahulik stiil ja selge kompositsioon kui ülepaisutatud efektid.",
            "Tallinn ja teised linnad pole siin erinevad põhimõttelt: edu võti on foto kvaliteet ja eelvaatega kinnitatud tulemus.",
        ],
    )
    + _h2(
        "Foto valik isale: lapsed, töö või ühine hobi — kuidas mitte eksida",
        [
            "Kui te tahate rõhutada isa rolli, valige foto, kus suhe on näha: ühine mäng, õpetamine, naer või lihtsalt koos olemine.",
            "Kui te tahate austust ilma sentimentaalsuseta, valige tugev portreehetk, kus emotsioon on kontrollitud.",
            "Kui te kahtlete, küsige teiselt pereliikmelt — see ei vähenda kingi väärtust, see vähendab riski.",
        ],
    )
    + _h2(
        "Isadepäev ja tarne üle Eesti: kui te ei saa ise üle anda",
        [
            "Tellides otse õigesse aadressi, vähendate vahepealseid samme. Kui see pole võimalik, valige turvaline kättesaamise koht ja tugev pakk.",
            "Kirjutage tellimuses tähtaeg ja kontakt, et kuller ei peaks “arutlema”, kuhu pakk jätta.",
            "Kui te planeerite ette, ei pea te isadepäeva hommikul kulleriga pinget tegema.",
        ],
    )
    + _h2(
        "Ettevõtte kontekst: kas portree on sobiv kingitus isale töö juures?",
        [
            "See sõltub kultuurist ja fotost. Professionaalne ühisfoto või meeskonna mälestus võib olla turvalisem kui väga isiklik kaader.",
            "Kui te ei tea, valige konservatiivsem kompositsioon ja rahulik taust — eelvaade annab teile kontrolli.",
            "Kui king on eraisikule, saate olla vabam — aga ikka mõelge sellele, kuhu pilt koju läheb.",
        ],
    )
    + _h2(
        "Isadepäeva kingitus 2026 ja varajane ost: miks see on “mõistlik plaan”",
        [
            "Isadepäeva kingitus tasub tellida nagu väike projekt: foto kogumine, mõõt, eelvaade, trükk, tarne. Kui üks lüli venib, venib kogu ahel.",
            "Kui te loete seda artiklit varakult, olete juba võitnud: teil on aega parandusteks ilma paanikata.",
            "Kui te loete hilja, märkige tellimuses tähtaeg ja küsige ausalt, mis on veel jõutav.",
        ],
    )
    + _h2(
        "Isadepäeva kingitus ja “vähe sõnu” kultuur: kuidas portree ütleb rohkem kui pikk kõne",
        [
            "Paljud isad ei taha kingi juures suurt show’d. Portree töötab siin hästi, sest ta on vaikne kingitus, mis on samas tugev: ta on nähtav ja püsiv.",
            "Kui te tahate lisada sõna, hoidke see konkreetne: miks see foto, mis see hetk tähendas teile.",
            "Kui te kahtlete toonis, valige rahulik taust ja klassikaline kompositsioon — eelvaade kinnitab lõpptulemuse.",
        ],
    )
    + _h2(
        "Isale kingitus ja mõõt: kuidas mitte tellida “ülearu muljet”",
        [
            "Suur pilt ei tähenda automaatselt suurt emotsiooni. Kui ruum on kompaktne või sein on juba täis, võib liiga suur mõõt tekitada koormuse.",
            "Mockup aitab; kui te ei tea seina, valige universaalsem mõõt.",
            "Lisaks vaadake <a href='/et/blog/pilt-louendil'>pilt lõuendil</a> juhendit, kui te kaalute lõuendit.",
        ],
    )
    + _h2(
        "Isadepäev ja lapsed: foto, mis räägib rollist ilma sõnadeleta",
        [
            "Ühine mäng, õpetamine või lihtsalt koos naermine — need kaadrid töötavad sageli paremini kui sundposeeritud “õnnelik perekond”.",
            "Kui lapsed on väikesed, kontrollige teravust: liikumine teeb fotod kiiresti pehmeks.",
            "Kui te tahate rõhutada isa iseseisvat rolli, valige kaader, kus suhe on näha, aga stiil jääb rahulikuks.",
        ],
    )
    + _h2(
        "Isadepäeva kingitus Eestis ja tarne üle Eesti: millal on mõistlik tellida otse isale",
        [
            "Kui te tahate üllatust, peab kättesaamine olema kindel: telefon, uksekood, turvaline koht. Üllatus ei tohi tähendada kaotatud pakki.",
            "Kui te toote ise üle, planeerige rahulik aken — kiirustades üleandmine vähendab emotsiooni.",
            "Tallinnas on logistika tihe, aga Eesti on väike — õige aadress lahendab palju.",
        ],
    )
    + _h2(
        "Isadepäeva kingitus 2026 ja varajane ost: miks see on talle ka signaal",
        [
            "Varajane ost näitab, et te ei jätnud kingi juhuslikule nädalavahetusele. See on küpsusmärk — eriti täiskasvanud lastelt.",
            "Kui te tellite varakult, on teil rohkem aega eelvaateks ja parandusteks.",
            "Kui te olete valmis, alustage <a href='https://www.popart.ee'>PopArt.ee</a> tellimusest ja märkige tähtaeg selgelt.",
        ],
    )
    + _h2(
        "Kui isa on tehniline inimene: kuidas rääkida eelvaatest ilma “kontrollifriigiks” jäämata",
        [
            "Eelvaade ei ole kahtlemine — see on kvaliteedikontroll. Kui te seda nii sõnastate, on paljudel meestel kergem sellega nõustuda.",
            "Kui te tahate, et ta tunneks end kaasatud, küsige tema arvamust kahe tausta vahel — aga hoidke valikud piiratud, et otsustus ei veniks.",
            "Kui te ei tea, kas ta tahab seina peale portreed, küsige vaikselt teiselt pereliikmelt — see säästab teid ebamugavast olukorrast.",
        ],
    )
)

ET_SUPPLEMENT["sonbrapaeva-kingitus-paarile"] = (
    _h2(
        "Sõbrapäeva kingitus paarile: soojus ilma surveeta",
        [
            "Sõbrapäeva kingitus paarile peaks olema rõõmus, aga mitte sunnitud romantiline. Portree ühisest fotost annab kingile loo: “see olete teie”, mitte üldine ese.",
            "Kui te ei tea nende kodu stiili, eelistage klassikalist kompositsiooni ja rahulikku tausta — see kannab interjööris kauem kui trend.",
            "Tallinnas võib paar elada väikses korteris või suures majas — mõõt on seetõttu olulisem kui “efektne number”.",
        ],
    )
    + _h2(
        "Piirid ja viisakus: millal portree on hea idee ja millal mitte",
        [
            "Kui teie suhe paariga on lähedane, on portree sageli tabav. Kui suhe on pigem ametlik, valige foto ja stiil, mis jäävad lugupidavaks.",
            "Vältige liiga intiimset kaadrit, kui te ei ole kindel nende mugavustasemes — sõbrapäeva kingitus paarile ei tohiks tekitada ebamugavust.",
            "Kui te kahtlete, küsige vaikselt ühelt poolt teadmata teist — see on parem kui riskantne üllatus.",
        ],
    )
    + _h2(
        "Veebruari tipunädal ja tellimused: miks varajasus on kingi osa",
        [
            "Sõbrapäeva lähenedes kasvab nõudlus — eriti kingitustel, mis vajavad eelvaadet ja trükki. Kui te jätate kõik veebruari keskele, võite järjekorraga võistelda.",
            "Kui te tellite jaanuaris, on teil rohkem ruumi mõõtu ja tausta arutada ilma paanikata.",
            "Kui te tellite veebruari lõpus, märkige tellimuses tähtaeg ja küsige ausalt, mis on veel jõutav.",
        ],
    )
    + _h2(
        "Tarne üle Eesti ja ühine kingitus kahele inimesele",
        [
            "Kui pakk läheb ühte aadressi, on kõik lihtne. Kui te peate jagama logistikat, kirjutage tellimuses selgelt, kuhu pakk peab minema ja millal.",
            "Kui paar elab eri linnades, mõelge, kuhu pilt “elas” kõige loomulikumalt — või küsige neilt vaikselt.",
            "Tugev pakend on sõbrapäeva kingitus paarile eriti oluline, sest kullerid on hooajal kiired ja pakkide maht suur.",
        ],
    )
    + _h2(
        "Kingikaart ja sõnum: kuidas hoida tooni kerge",
        [
            "Kolm lauset piisab: õnnitlus, miks see foto, miks see neile sobib. Portree teeb visuaalse töö ära — tekst toetab.",
            "Kui te tahate huumorit, hoidke see sõbralik — sõbrapäeva kingitus paarile ei pea olema stand-up, ta peab olema soe.",
            "Kui te otsite rohkem üldisi kinginõuandeid, vaadake <a href='/et/blog/personaalne-kingitus'>personaalne kingitus</a> artiklit.",
        ],
    )
    + _h2(
        "Sõbrapäeva kingitus paarile ja “õige foto”: kuidas valida kaader, mis ei pane kedagi piinlikkusse",
        [
            "Parim foto on sageli loomulik naer või ühine hetk, mis ei vaja pikka selgitust. Vältige kaadrit, mis nõuaks konteksti, mida külalised ei tea.",
            "Kui te kahtlete kahe foto vahel, valige teravam — trükk näitab pehmust halastamatus valguses.",
            "Eelvaade on eriti oluline paarile kingitades, sest te peate arvestama kahe inimese tundega korraga.",
        ],
    )
    + _h2(
        "Kui paar on minimalistlik vs maksimalistlik: kuidas mitte eksida stiiliga",
        [
            "Minimalistlik kodu kannab sageli vaiksemat tausta; maksimalistlik ruum kannab rohkem iseloomu. Kui te ei tea, valige klassikaline kompositsioon.",
            "Tallinnas on mõlemat — ärge assumeerige ühte stiili.",
            "Kui teil on võimalus, tehke üks diskreetne foto nende interjöörist (küsi luba) — see aitab tausta valida.",
        ],
    )
    + _h2(
        "Sõbrapäeva kingitus paarile ja kingi üleandmine: väike pidu vs vaikne hetk",
        [
            "Kui te annate kingi sõpruskonnas, mõelge, kas paar tahab tähelepanu keskmes olla. Kui mitte, andke üle vaiksemalt või enne peo algust.",
            "Kui te annate üle peol, hoidke sõnum lühike — pikk kõne võib teha kingi ebamugavaks.",
            "Kui te ei saa kohale minna, tehke pakk tugevaks ja kirjutage kullerile selge juhis.",
        ],
    )
    + _h2(
        "Veebruar Eestis: ilm, pimedus ja tarne — miks pakend on kingi osa",
        [
            "Veebruar võib olla niiske ja pime — pakend, mis kaitseb niiskuse ja löökide eest, on premium detail, mitte luksus.",
            "Kui te tellite tarne üle Eesti, jätke puhver, et vältida “viimase päeva” õnne mängu.",
            "Kui te tahate kindlat päeva, kirjutage see tellimuses numbriga.",
        ],
    )
    + _h2(
        "Sõbrapäeva kingitus paarile 2026: varajane ost kui sõprusakt",
        [
            "Varajane ost näitab, et te mõtlesite nende ajale, mitte ainult oma kalendrile. See on eriti oluline veebruari tipus.",
            "Kui te tellite jaanuaris, on teil rohkem ruumi eelvaateks ja mõõtu arutamiseks.",
            "Kui te olete valmis, alustage <a href='https://www.popart.ee'>PopArt.ee</a> tellimusest ja märkige tähtaeg.",
        ],
    )
    + _h2(
        "Kui te kardate, et king on liiga “suur žest”: kuidas hoida portreed sõbralikult romantilisena",
        [
            "Portree võib olla suur žest, aga stiil saab seda maandada: rahulik taust, klassikaline kompositsioon, lühike sõnum.",
            "Kui teie suhe paariga on pigem sõbralik, valige foto, mis rõhutab sõprust ja ühist mälestust, mitte ainult romantikat.",
            "Kui te kahtlete, küsige ühelt partnerilt vaikselt — see on parem kui riskantne üllatus.",
        ],
    )
    + _h2(
        "Kuidas vältida olukorda, kus king “konkureerib” teiste sõbrapäeva kingitega",
        [
            "Kui te teate, et sõpruskond kingib palju, mõelge mälestusele, mis on ainult neile: teie ühine foto või teie ühine reis.",
            "Portree on selles mõttes tugev, sest ta on raskesti dubleeritav, kui foto on teie oma.",
            "Kui te tahate lisaks väikese lisa, tehke see praktiline (raamimine), mitte uus “asi kapis”.",
        ],
    )
)

# Final pass: ensure each seasonal ET article clears ~2000 words in combined generator output.
ET_SUPPLEMENT["joulukingitus-2026"] += _h2(
    "Jõulukingitus 2026 ja “kingi garantii”: mida te tegelikult ostete",
    [
        "Te ei osta ainult lõuendit või trükki — te ostate protsessi, mis peab lõppema sellega, et kingisaaja tunneb: “see oli minust”. Selleks on vaja head fotot, selget tähtaega ja eelvaadet.",
        "Kui üks neist on nõrk, tekib jõuluhooajal stress. Kui kõik kolm on paigas, on king kaubanduslikult mõistlik: te teate, mida saate, ja kingisaaja saab emotsiooni ilma tehnilise pettumuseta.",
        "Kui te loete seda artiklit ja olete valmis, alustage <a href='https://www.popart.ee'>PopArt.ee</a> tellimusest kohe — järjekord ei oota.",
        "Kui te loete hiljem, märkige tähtaeg ja küsige ausalt, mis on veel jõutav; parem aus plaan kui jõululaupäeva paanika.",
    ],
) + _h2(
    "Jõulukingitus 2026 Eestis: kolm lauset, mis aitavad teenusel teid kiiremini õigesti mõista",
    [
        "Esimene lause: tähtaeg kuupäevana. Teine: tarneaadress ja kättesaamise aken. Kolmas: eelistused stiilis (nt “rahulik taust, loomulik naer”).",
        "Kui need on olemas, väheneb tagasiotsimiste hulk ja suureneb tõenäosus, et jõulukingitus jõuab õigeks ajaks õige kvaliteediga.",
        "Kui te vajate mõõduabi, vaadake enne tellimust <a href='/et/blog/seinapilt-tellimine'>seinapilt tellimine</a> artiklit — see säästab teid hiljem “kas see mahuks?” arutelust.",
    ],
)

ET_SUPPLEMENT["joulukingitus-naisele"] += _h2(
    "Jõulukingitus naisele 2026: viimane kontroll enne makset",
    [
        "Kontrollige: foto teravus, mõõt (või teadlikult universaalne valik), tähtaeg tellimuses, tarneaadress õigesti, eelvaate plaan meeles.",
        "Kui üks element puudub, tekib sageli tagasiäss: täiendavad küsimused, viivitus või kompromiss.",
        "Kui te olete valmis, alustage <a href='https://www.popart.ee'>PopArt.ee</a> tellimusest — varajane tegevus on jõulukingitus naisele parim lisasõnum.",
        "Kui te vajate mõõduabi, vaadake <a href='/et/blog/seinapilt-tellimine'>seinapilt tellimine</a> artiklit enne lõplikku kinnitust.",
    ],
)

ET_SUPPLEMENT["joulukingitus-mehele"] += _h2(
    "Jõulukingitus mehele: kaks stiili (klassikaline vs kaasaegne) ja kuidas valida",
    [
        "Klassikaline stiil töötab sageli kõige stabiilsemalt, sest see vananeb interjööris ilusamalt. Kaasaegsem kompositsioon võib olla äge, aga nõuab teadlikumat interjööri tundmist.",
        "Kui te ei tea, valige rahulik klassika ja laske eelvaates kinnitada intensiivsust.",
        "Kui te tahate tugevamat kunstilist joont, lugege enne otsust <a href='/et/blog/kunstiline-portree'>kunstiline portree</a> juhendit.",
        "Kui te olete valmis, alustage <a href='https://www.popart.ee'>PopArt.ee</a> tellimusest ja märkige tähtaeg — detsembri järjekord ei võistle teiega, ta lihtsalt kasvab.",
    ],
) + _h2(
    "Jõulukingitus mehele ja kingi “järelteenus”: kuidas aidata tal pildi seina saada",
    [
        "Kui te annate kaasa lihtsa paigalduse mõtte või viite mõõdu juhendile, suurendate tõenäosust, et pilt läheb kohe üles — mitte ei jää nurka seisma.",
        "Kui te ei tea seina, valige universaalsem mõõt ja öelge see ka kingikaardil lühidalt.",
        "Kui te tahate, et king oleks täielikult “valmis”, küsige pakendi ja tarne kohta enne makset — need detailid on jõulukingi premium osa.",
    ],
)

ET_SUPPLEMENT["emadepaeva-kingitus"] += _h2(
    "Emadepäeva kingitus: viimane meeldetuletus enne makset",
    [
        "Kontrollige: foto teravus, mõõt (või teadlikult universaalne valik), tähtaeg tellimuses, tarneaadress õigesti, eelvaate plaan meeles.",
        "Kui te jätate mai keskele, märkige tähtaeg ja küsige ausalt, mis on veel jõutav — parem aus plaan kui emadepäeva hommikune paanika.",
        "Kui te olete valmis, alustage <a href='https://www.popart.ee'>PopArt.ee</a> tellimusest ja kirjutage märkused selgelt — see on kingi kvaliteedi osa.",
    ],
) + _h2(
    "Emadepäeva kingitus ja fotode privaatsus: perering vs avalik üllatus",
    [
        "Kui king avatakse peres, valige kaader, mis on ilus ka siis, kui kõrval on tädi või lapsed. See ei vähenda emotsiooni — see kaitseb ema mugavust.",
        "Kui te annate kingi kahekesi, võite olla vabam, aga mõelge ikka sellele, kuhu pilt koju läheb.",
        "Kui te kahtlete, valige loomulik naer või ühine tegevus — need on sageli kõige turvalisemad.",
        "Kui te olete valmis, alustage <a href='https://www.popart.ee'>PopArt.ee</a> tellimusest ja märkige emadepäeva tähtaeg tellimuses selgelt.",
    ],
) + _h2(
    "Emadepäeva kingitus 2026: miks mai kuu on hea aeg tellida juba aprillis",
    [
        "Aprillis on tellimuste maht sageli rahulikum, mis annab rohkem ruumi eelvaatele ja parandustele.",
        "Kui te jätate mai keskele, võib järjekord olla pikem — mitte dramaatiliselt, aga piisavalt, et tähtaeg muutuks pingeks.",
        "Tarne üle Eesti töötab hästi, kui aadress on täpne ja kättesaamine on realistlik.",
    ],
)

ET_SUPPLEMENT["isadepaeva-kingitus"] += _h2(
    "Isadepäeva kingitus: viimane kontroll-loend enne tellimust",
    [
        "Kontrollige: foto teravus, mõõt (või universaalne valik), tähtaeg tellimuses, tarneaadress, eelvaate plaan.",
        "Kui te loete seda hilja, märkige tähtaeg ja küsige ausalt, mis on veel jõutav — see säästab nii teid kui ka teenust ebarealistlikest ootustest.",
        "Kui te olete valmis, alustage <a href='https://www.popart.ee'>PopArt.ee</a> tellimusest; varajane ost on isale sageli parim sõnum ilma pikkade sõnadeta.",
    ],
) + _h2(
    "Isadepäeva kingitus ja kingi üleandmine: kuidas hoida emotsiooni ilma “suure show’ta”",
    [
        "Paljud isad ei taha kingi juures tähelepanu tsentrit. Andke üle rahulikult, lühidalt ja konkreetselt: miks see foto.",
        "Kui te ei saa ise kohale minna, tehke pakk tugevaks ja kirjutage selge juhis — isadepäeva hommikud on sageli kiired.",
        "Kui te olete valmis, alustage <a href='https://www.popart.ee'>PopArt.ee</a> tellimusest ja märkige tähtaeg.",
    ],
) + _h2(
    "Isadepäeva kingitus 2026: mõõt, sein ja “isa töötuba”",
    [
        "Kui pilt läheb töötuppa, valige rahulik taust ja selge kompositsioon — liiga kodune dramaturgia võib tunduda ebakõlana.",
        "Kui pilt läheb koju, saate olla soojem — aga ikkagi mõelge ruumi mõõtudele.",
        "Mockup või universaalsem mõõt on parem kui liiga suur pilt, mis ei mahu kuhugi.",
        "Lisaks vaadake <a href='/et/blog/seinapilt-tellimine'>seinapilt tellimine</a> artiklit, kui te kaalute suuremat formaati.",
    ],
) + _h2(
    "Isadepäeva kingitus Eestis: varajane ost kui kingi kvaliteedi osa",
    [
        "Varajane ost annab teenusele aega teha töö korrektselt ja teile aega kinnitada eelvaade rahulikult.",
        "Kui te loete seda hilja, märkige tellimuses tähtaeg ja küsige ausalt, mis on veel jõutav.",
        "Tallinn ja ülejäänud Eesti on mõlemad head, kui tellimus on kirjutatud selgelt.",
        "Kui te kingite korraga mitmele isale (nt isa ja vanaisa), tehke iga tellimuse jaoks eraldi mini-nimekiri: foto, mõõt, tähtaeg ja tarneaadress — hooajal segunevad detailid kergesti. See võtab minuti, aga säästab tunde.",
        "Kui te nummerdate tellimused või annate neile selged nimed (nt “Isa A”, “Vanaisa B”), väheneb risk, et tarne märkused lähevad segi.",
    ],
)

ET_SUPPLEMENT["sonbrapaeva-kingitus-paarile"] += _h2(
    "Sõbrapäeva kingitus paarile: viimane meeldetuletus enne makset",
    [
        "Kontrollige: foto teravus, mõõt (või universaalne valik), tähtaeg tellimuses, tarneaadress, eelvaate plaan.",
        "Kui te jätate veebruari keskele, märkige tähtaeg ja küsige ausalt, mis on veel jõutav — veebruari tipus on järjekord reaalne risk.",
        "Kui te olete valmis, alustage <a href='https://www.popart.ee'>PopArt.ee</a> tellimusest ja hoidke sõnum sõbralikult soe.",
    ],
) + _h2(
    "Sõbrapäeva kingitus paarile ja “õige mõõt”: väike korter vs suur elutuba",
    [
        "Väikses korteris võib suur pilt tunda end koormavana. Suures elutoas võib väike pilt tunda end kadununa. Kui te ei tea, valige universaalsem mõõt.",
        "Mockup telefonis aitab kiiresti — kui teil pole aega, küsige nõu ja laske eelvaatel kinnitada kompositsiooni tasakaal.",
        "Kui te olete valmis, alustage <a href='https://www.popart.ee'>PopArt.ee</a> tellimusest ja märkige veebruari tähtaeg.",
    ],
) + _h2(
    "Sõbrapäeva kingitus paarile 2026: kuidas hoida kingi sõbralikult soojana",
    [
        "Sõprus ja romantika võivad koos eksisteerida, aga portree puhul tasub valida kaader, mis ei sunni paari rolli üle interpreteerima.",
        "Rahulik taust ja klassikaline kompositsioon annavad rohkem ruumi nende enda tõlgendusele.",
        "Kui te kahtlete, küsige ühelt partnerilt vaikselt — see on parem kui riskantne üllatus.",
        "Kui te tahate süvendada stiili, vaadake <a href='/et/blog/kunstiline-portree'>kunstiline portree</a> juhendit.",
    ],
) + _h2(
    "Tarne üle Eesti ja sõbrapäev: miks paki tugevus on emotsiooni osa",
    [
        "Kui pakk saabub vigastatult, kannatab emotsioon olenemata pildi kvaliteedist. Seetõttu on pakend premium detail.",
        "Kui te tellite kulleriga, kirjutage kontakt ja uksekood selgelt — veebruari tipus on logistika koormav.",
        "Kui te jätate puhvri, vähendate riski, et “üks päev hiljem” rikuks plaanitud üllatuse.",
    ],
)
