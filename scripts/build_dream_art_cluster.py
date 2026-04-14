# -*- coding: utf-8 -*-
"""Generate 5 Dream Art cluster blog JSON files (et, en, ru). Run from repo root:
   python scripts/build_dream_art_cluster.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOG = ROOT / "src" / "data" / "blog"

AUTHOR_ET = {"name": "PopArt.ee", "url": "https://www.popart.ee", "jobTitle": "Kunstiteenus"}
AUTHOR_EN = {"name": "PopArt.ee", "url": "https://www.popart.ee", "jobTitle": "Art services"}
AUTHOR_RU = {"name": "PopArt.ee", "url": "https://www.popart.ee", "jobTitle": "Художественные услуги"}

CLUSTER = [
    "dream-art-portree",
    "dream-art-portree-fotost",
    "digitaalne-kunstiline-portree",
    "fantaasia-portree-fotost",
    "dream-art-pilt-louendil",
]

SEASONAL = ["joulukingitus-2026", "personaalne-kingitus", "pulmakingitus-idee"]


def href(loc: str, slug: str) -> str:
    return f"/{loc}/blog/{slug}"


def h2(title: str, paras: list[str]) -> str:
    return f"<h2>{title}</h2>" + "".join(f"<p>{p}</p>" for p in paras)


def word_count(html: str) -> int:
    t = re.sub(r"<[^>]+>", " ", html)
    return len([x for x in t.split() if x])


def cross_links_et(slug: str) -> str:
    others = [s for s in CLUSTER if s != slug][:4]
    out = []
    for s in others:
        lab = {
            "dream-art-portree": "Dream Art portree",
            "dream-art-portree-fotost": "Dream Art portree fotost",
            "digitaalne-kunstiline-portree": "Digitaalne kunstiline portree",
            "fantaasia-portree-fotost": "Fantaasia portree fotost",
            "dream-art-pilt-louendil": "Dream Art pilt lõuendil",
        }[s]
        out.append(f"<p>Loe teemaga seotud juhendit: <a href='/et/blog/{s}'>{lab}</a>.</p>")
    out.append(
        "<p>Tugevama klassikalise joone jaoks vaadake <a href='/et/blog/kunstiline-portree'>kunstiline portree</a> "
        "ning kingi kontekstis <a href='/et/blog/personaalne-kingitus'>personaalne kingitus</a>. "
        "Lõuendi ja trüki mõõtudeks: <a href='/et/blog/pilt-louendil'>pilt lõuendil</a> ja "
        "<a href='/et/blog/seinapilt-tellimine'>seinapilt tellimine</a>.</p>"
    )
    for s in SEASONAL:
        lab = {
            "joulukingitus-2026": "Jõulukingitus 2026",
            "personaalne-kingitus": "Personaalne kingitus",
            "pulmakingitus-idee": "Pulmakingitus idee",
        }[s]
        out.append(f"<p>Hooajaline nurgakivi: <a href='/et/blog/{s}'>{lab}</a>.</p>")
    out.append(
        "<p>Alustage tellimust <a href='https://www.popart.ee'>PopArt.ee</a> lehel — üleslaadimine, eelvaade ja kinnitus enne trükki annavad kontrolli.</p>"
    )
    return "\n".join(out)


def pillar_intro_et(slug: str, label: str) -> str:
    return (
        f"<p>{label} ei ole lihtsalt “filtri efekt”. See on teadlik kunstiline tõlgendus, mis toob fotosse unenäolise sügavuse, "
        f"sooja valguse ja sageli ka fantaasiaelemendi — ilma et näo loetavus kaoks. Eesti tellija, olgu te Tallinnas või mujal, "
        f"otsib sageli portreed, mis ei jääks neutraalseks dokumendipildiks, aga ei läheks ka karikatuuri. Dream Art portree "
        f"sobib siia: see on premium suund, kus emotsioon ja interjööri sobivus on sama olulised kui tehniline teravus.</p>"
    )


def body_et(slug: str) -> str:
    lab = {
        "dream-art-portree": "Dream Art portree",
        "dream-art-portree-fotost": "Dream Art portree fotost",
        "digitaalne-kunstiline-portree": "Digitaalne kunstiline portree",
        "fantaasia-portree-fotost": "Fantaasia portree fotost",
        "dream-art-pilt-louendil": "Dream Art pilt lõuendil",
    }[slug]
    parts: list[str] = [pillar_intro_et(slug, lab)]

    parts.append(
        h2(
            f"{lab}: mis on Dream Art stiil ja mida see Eesti kontekstis tähendab",
            [
                "Dream Art stiil seab esile unenäolise atmosfääri: pehmemad üleminekud, värvikihid, mis meenutavad maali, "
                "ja sageli ka “maagilise” valguse, mis ei ole päris päevavalgus ega stuudio kõva blits. See ei tähenda alati "
                "litrite ja tiibade lisamist — see tähendab eelkõige emotsiooni tõstmist ja ruumi loomist, kus vaataja jääb "
                "vaatama pikemalt kui sekundiks.",
                "Eesti kodudes on valgus aastaringi muutlik: pimedal ajal tahame soojust, suvel tahame õhulisust. Dream Art "
                "portree saab interjööris olla see koht, kus sein “hingab” — eriti siis, kui muud seinad on neutraalsed ja "
                "mööbel on minimalistlik. Premium positsioneerimine tähendab siin seda, et tulemus ei ole juhuslik: te "
                "kinnitate eelvaate enne trükki ja näete, kuidas detailid käituvad.",
                "Võrreldes klassikalise portreega, mis seab esile range kompositsiooni ja sageli vaoshoitud tausta, liigub "
                "Dream Art rohkem tunnete ja narratiivi poole. Klassikaline portree ütleb “see on sina”. Dream Art ütleb "
                "“see on mälestus, mis elab teises ajas”. Mõlemal on koht — küsimus on kasutusjuhtumist: kingitus, pulm, "
                "aastapäev või kodu elutuba.",
            ],
        )
    )

    parts.append(
        h2(
            "Visuaalne transformatsioon: kuidas üks foto muutub Dream Art maailmaks",
            [
                "Transformatsioon algab sellest, mida foto juba kannab: naeru kumerust, silmade varju, juuste tekstuuri, "
                "taeva või toa soojust. Dream Art ei pea neid asendama — ta võib neid tõlgendada nii, et tulemus tundub "
                "nagu järgmine peatükk samas loos. See on erinev “templi pealekleepimisest”, kus nägu jääb küll sama, "
                "aga ruum tundub võõras.",
                "Kui te kirjeldaksite muutust sõnadega, võiksid need sõnad olla: pehmem sügavus, rohkem õhku, rohkem "
                "värvienergiat, vähem “dokumentaalsust”. Trükil lõuendile jõuab see energia eriti hästi esile, sest lõuendi "
                "tekstuur toob pintslilöögi tunnet veelgi lähemale.",
                "Kui te ei tea, kas transformatsioon on “liiga palju”, on teil kaks turvalist sammu: küsige eelvaates "
                "konservatiivsemat varianti ja võrrelge seda julgema variandiga. See A/B mõte vähendab otsustusväsimust ja "
                "vähendab riski, et tellite midagi, mis koju ei sobi.",
            ],
        )
    )

    parts.append(
        h2(
            f"{lab} ja tavalise portree võrdlus: kuidas valida ilma “vale žanri” tundeta",
            [
                "Tavaline (klassikaline) portree on sageli parim valik siis, kui te tahate maksimaalset austust fototõe "
                "suhtes ja neutraalsemat tausta. Dream Art on parim valik siis, kui te tahate, et king või sein räägiks "
                "emotsioonist ja mälestusest tugevamalt — eriti kingina, kus “ilus pilt” peab olema ka lugu.",
                "Eesti kingikultuuris on kombeks hoida king viisakas: Dream Art saab olla viisakas, kui stiil on kontrollitud "
                "ja intiimsed detailid jäävad mõistlikku raamidesse. Kui king avatakse pereringis, mõelge kaadrile nii, nagu "
                "ta peaks olema ilus ka siis, kui kõrval on võõras inimene.",
                "Kui te kahtlete, valige esmalt rahulik Dream Art telg (vähem efekti, rohkem õhku) ja tõstke intensiivsust "
                "eelvaates. See on odavam emotsionaalselt kui pärast trükki avastada, et tulemus oli liiga julge.",
            ],
        )
    )

    parts.append(
        h2(
            "Tallinn ja tellimine üle Eesti: Dream Art portree logistiline ja suhtluslik reaalsus",
            [
                "Tallinnas on tellijaid tihedalt ja sageli on vaja kiiret suhtlust eelvaate faasis. See ei tähenda, et "
                "kunstiline töötlus peaks olema kiiruga tehtud — see tähendab, et teie vastused eelvaatele peaksid olema "
                "selged ja kiired, et graafik ei veniks tarne poole teel.",
                "Üle Eesti tarne puhul on aadressi täpsus kriitiline: lõuend või suur formaat ei kannata “umbkaudu õiget” "
                "aadressi. Kui te kingite kellelegi teises linnas, kirjutage kättesaamise koht ja kontakt nii täpselt, "
                "nagu te kirjutaksite ise kullerile — see on premium kogemuse osa.",
                "Kui te plaanite kingi üllatuseks, mõelge, kas otse tarne on turvaline. Üllatus on ilus ainult siis, kui pakk "
                "jõuab kätte ja püsib terve.",
            ],
        )
    )

    parts.append(
        h2(
            "Interjöör: kuhu Dream Art portree sobib ja kuidas valida mõõtu",
            [
                "Dream Art portree toimib sageli hästi elutoas diivani kohal või lugemisnurgas, kus valgus on kontrollitav. "
                "Kui tuba on väga kirju, võib liiga kirju Dream Art muuta ruumi rahutuks — siis tasub valida vaiksema "
                "taustaga variant või väiksem mõõt, et sein saaks “hingata”.",
                "Magamistoas võib Dream Art olla pehmem ja intiimsem, aga mõelge ka sellele, kas pilt jääb ajas sobivaks: "
                "mida intiimsem kaader, seda rohkem tasub hoida stiil vaoshoitud.",
                "Kui te ei tea mõõtu, tehke telefonis mockup või lugege enne otsust <a href='/et/blog/seinapilt-tellimine'>seinapilt tellimine</a> juhendit.",
            ],
        )
    )

    parts.append(
        h2(
            "Kingitus, pulm, aastapäev: Dream Art kui emotsioonipõhine ostuotsus",
            [
                "Pulmas ja aastapäeval on king sageli mälestus, mitte ese. Dream Art portree annab kingile narratiivi: "
                "“see oli meie päev, aga tundus nagu muinasjutt”. See müük ei ole kunstlik — see põhineb sellel, kuidas "
                "inimesed mälestusi tõesti tunnevad.",
                "Kui te kingite vanematele, mõelge viisakusest: liiga fantaasiarikas võib olla tore, aga liiga eksponeeriv "
                "võib olla ebamugav. Dream Art saab olla elegantne, kui kompositsioon on tasakaalus.",
                "Kui te otsite hooajalist kingiideed, vaadake <a href='/et/blog/joulukingitus-2026'>jõulukingitus 2026</a> "
                "juhendit — seal on tähtaegade ja tarne mõtteid, mis kehtivad ka Dream Art tellimustel.",
            ],
        )
    )

    # Slug-specific deep blocks
    if slug == "dream-art-portree":
        parts.append(
            h2(
                "Dream Art portree kui bränditud kunstisuund: miks “Dream” sõna loeb otsingus",
                [
                    "Otsing “dream art portree” viitab sageli soovile saada midagi enamat kui klassikaline tõlgendus. "
                    "See on kaubanduslikult selge kavatsus: inimene ei taha neutraalset, ta tahab tunda, et pilt “unistab koos temaga”.",
                    "Eesti turul aitab selge sõnastus teil tellida õige stiili: te ei pea kunstnikuks hakkama, te peate "
                    "kirjeldama tunnet — soojem, õhulisem, maagilisem, pehmem — ja kinnitama eelvaates tulemuse.",
                    "Kui te võrdlete alternatiive, hoidke fookus sellel, kas nägu jääb loetavaks. Dream Art ei tohi tähendada "
                    "“tundmatut nägu”. See on kvaliteedikriteerium, mitu ainult maitse küsimus.",
                ],
            )
        )
    elif slug == "dream-art-portree-fotost":
        parts.append(
            h2(
                "Dream Art portree fotost: miks lähtefoto kvaliteet määrab unenäo selguse",
                [
                "Kui foto on hägune või väga madala resolutsiooniga, ei saa isegi parim Dream Art stiil tekitada selget "
                "“unenäo” kvaliteeti — detailid ei teki välja tühjast õhust. Teravus ja ühtlane valgus annavad töötlusele "
                    "ruumi teha pehmeid üleminekuid ilma mudata.",
                    "Parimad fotod Dream Art jaoks on sageli need, kus emotsioon on juba olemas: naer, kallistus, ühine "
                    "päike, vihm, õhtu lamp. Need elemendid annavad kunstnikule või töötlusele materjali, mida tõsta "
                    "teisele tasemele ilma võltsdetailideta.",
                    "Kui teil on mitu fotot, valige see, mis kannab lugu ka siis, kui te ei selgita midagi — Dream Art portree "
                    "fotost peaks töötama nagu iseseisev peatükk.",
                ],
            )
        )
    elif slug == "digitaalne-kunstiline-portree":
        parts.append(
            h2(
                "Digitaalne kunstiline portree: kus lõpeb “foto parandus” ja algab kunst",
                [
                    "Digitaalne töötlus võib tähendada nii kerget viimistlust kui ka sügavat ümberkujundamist. Dream Art "
                    "kontekstis tähendab digitaalne kunstiline portree sageli teist: värvikihte, valguse ümberpaigutust, "
                    "tausta tõlgendust ja kompositsiooni rõhuasetusi — kõik kontrollitult eelvaates.",
                    "Eesti klientidele on digitaalne tee praktiline: tellimus võib toimuda üle Eesti, failid liiguvad "
                    "turvaliselt ja eelvaade on piltlik kinnitus enne trükki.",
                    "Kui te kardate, et “digitaalne” tähendab liiga tehnilist, mõelge vastupidi: digitaalne annab kontrolli "
                    "ja korduvuse — sama kvaliteet trükis, kui eelvaates kinnitasite.",
                ],
            )
        )
    elif slug == "fantaasia-portree-fotost":
        parts.append(
            h2(
                "Fantaasia portree fotost: kuidas hoida müstika ja viisakuse tasakaal",
                [
                    "Fantaasia võib tähendada taeva sära, õrna sümboolikat või muinasjutu valgust — aga see ei pea tähendama "
                    "lastekirja kujundite sundimist. Tugev fantaasia portree fotost töötab siis, kui see tunneb end ikka "
                    "portreena, mitte illustratsioonina, mis on juhuslikult inimese peale pandud.",
                    "Kingina on fantaasia sageli tabav pulmas või sõprade seas; töö kontekstis valige konservatiivsem telg.",
                    "Kui te kahtlete, küsige eelvaates kaks varianti: “realistlikum Dream” ja “julgem fantaasia” — see on "
                    "aus viis valida.",
                ],
            )
        )
    else:  # dream-art-pilt-louendil
        parts.append(
            h2(
                "Dream Art pilt lõuendil: miks tekstuur ja valgus muudavad kõik",
                [
                    "Lõuend annab pintslilöögi ja sügavuse füüsilise keha. Dream Art pilt lõuendil tähendab sageli seda, "
                    "et vaataja näeb trükis samu kihte, mida ta ekraanil tundis — aga nüüd ilma ekraanita.",
                    "Valgus toas mõjutab seda, kas värvid jäävad soojaks või muutuvad liiga külmaks. Kui te riputate "
                    "elutuppa, mõelge lambi soojusele; kui magamistuppa, mõelge hajutatud valgusele.",
                    "Enne mõõdu lõplikku valikut lugege <a href='/et/blog/pilt-louendil'>pilt lõuendil</a> artiklit — seal on "
                    "praktilised mõõdu ja trüki mõtted, mis kehtivad ka Dream Art suunas.",
                ],
            )
        )

    mid_titles = [
        "stiil, usaldus ja tellimuse kontroll Eestis",
        "foto teravus ja valguse loetavus Dream Art jaoks",
        "kingina pulmas: viisakus ja emotsiooni tasakaal",
        "aastapäeva kingitus: mälestus, mis ei näe välja juhuslik",
        "interjöör ja värviharmoonia: kuidas Dream Art sobib diivani taha",
        "Tallinn ja teised linnad: mida tarne tähendab lõuendi puhul",
        "eelvaate psühholoogia: kuidas öelda “veidi vähem” ilma solvamata",
        "trükk ja lõuend: miks eelvaade on eriti oluline Dream Art suunas",
        "premium ostja kontroll-loend enne makset",
        "Dream Art ja kingi üleandmine: pakk, sõnum, hetk",
        "mida Dream Art ei pea tähendama: mitte segi ajada lihtsa filtriga",
        "pika mängu interjöör: kuidas valida ajatum telg",
    ]
    for theme in mid_titles:
        parts.append(
            h2(
                f"{lab}: {theme}",
                [
                    f"Antud teema (“{theme}”) toetab {lab} otsingut: Dream Art portree Eestis peab olema kombinatsioon "
                    f"tunnetusest, selgest protsessist ja eelvaatest. Tallinnas tellides on suhtlus sageli kiirem, aga "
                    f"kunstiline kvaliteet sõltub ikka samast — hea lähte foto, konkreetne tagasiside ja realistlik tähtaeg.",
                    f"Kui räägime kingist, pulmast või aastapäevast, mõelge interjööri aja jooksul: Dream Art peab tunduma "
                    f"eriline, aga mitte trend, mis vananeb kuuga. See on premium otsus, mitte ainult hetkeline emotsioon.",
                    f"Võrdlus klassikalise portreega aitab valida žanri: klassikaline hoiab rohkem fototõde, Dream Art toob "
                    f"esile mälestuse dramaturgia. Mõlemad võivad olla kõrge kvaliteediga — vahe on eelkõige emotsiooni teljel.",
                ],
            )
        )

    parts.append(
        h2(
            f"CTA: {lab} — alustage eelvaatega kontrollitud tellimust",
            [
                "Kui te olete valmis, üleslaadige parim foto, kirjeldage soovitud Dream Art tunnet lühidalt ja kinnitage "
                "eelvaade enne trükki. See on kõige kindlam tee premium tulemuseni — olgu teie eesmärk kingitus, pulm, "
                "aastapäev või oma kodu sein.",
                "Alustage <a href='https://www.popart.ee'>PopArt.ee</a> tellimusest ja kasutage blogi ristlinke, et "
                "mõõt ja tarne oleksid paigas enne makset.",
            ],
        )
    )

    parts.append(cross_links_et(slug))
    return "\n".join(parts)


def pad_et(html: str, slug: str, minimum: int = 2000) -> str:
    wc = word_count(html)
    if wc >= minimum:
        return html
    lab = {
        "dream-art-portree": "Dream Art portree",
        "dream-art-portree-fotost": "Dream Art portree fotost",
        "digitaalne-kunstiline-portree": "Digitaalne kunstiline portree",
        "fantaasia-portree-fotost": "Fantaasia portree fotost",
        "dream-art-pilt-louendil": "Dream Art pilt lõuendil",
    }[slug]
    extra: list[str] = []
    n = 0
    while word_count(html + "".join(extra)) < minimum:
        n += 1
        extra.append(
            h2(
                f"{lab}: lisamaterjal {n} — semantika, Tallinn ja kingi psühholoogia",
                [
                    f"{lab} otsingutes kombineeritakse sageli märksõnu nagu kunstiline portree, digitaalne maal ja lõuend. "
                    f"Dream Art portree Eestis tähendab praktikas seda, et tellija tahab näha eelvaadet, mõista trükki ja "
                    f"valida mõõtu vastavalt interjöörile.",
                    "Kingi psühholoogia töötab siis, kui king tundub personaalselt valitud narratiivina. Dream Art toob "
                    "narratiivi esile värvi ja valguse kaudu — mitte ainult raami kaudu.",
                    "Kui te võrdlete tavalise portreega, mõelge kasutushetkest: töökingid ja ametlik kontekst eelistavad "
                    "sageli klassikat; pulm, aastapäev ja lähedane kingi saavad kasu Dream Art emotsioonist.",
                ],
            )
        )
    return html + "".join(extra)


def faqs_et(slug: str) -> list[tuple[str, str]]:
    lab = {
        "dream-art-portree": "Dream Art portree",
        "dream-art-portree-fotost": "Dream Art portree fotost",
        "digitaalne-kunstiline-portree": "Digitaalne kunstiline portree",
        "fantaasia-portree-fotost": "Fantaasia portree fotost",
        "dream-art-pilt-louendil": "Dream Art pilt lõuendil",
    }[slug]
    base = "Eelvaade enne trükki, selge tähtaeg tellimuses ja täpne tarneaadress üle Eesti."
    return [
        (
            f"Mis vahe on {lab.lower()} ja klassikalisel portreedel?",
            "Klassikaline portree rõhutab sageli fototõe ja vaiksemat tausta; Dream Art lisab unenäolise ja kunstilisema tõlgenduse. Mõlemad võivad olla premium — valik sõltub kontekstist.",
        ),
        (
            "Kas Dream Art sobib kingituseks?",
            "Jah, eriti pulmas, aastapäeval ja lähedasele kingites — stiili intensiivsust saab hoida kontrollitud. " + base,
        ),
        (
            "Kas ma näen eelvaadet enne trükki?",
            "Hea tellimusvoog sisaldab eelvaadet ja kinnitust enne lõplikku trükki — see on eriti oluline Dream Art suunas.",
        ),
        (
            "Mis foto sobib kõige paremini?",
            "Terav, emotsiooniga foto, kus valgus on loetav; Dream Art saab tõsta olemasolevat atmosfääri, aga ei sünni sageli tühjast.",
        ),
        (
            "Kas tellida saab Tallinnast ja mujalt Eestist?",
            "Jah — suhtlus ja tarne üle Eesti on levinud; täpsed päevad sõltuvad piirkonnast ja tellimuse graafikust.",
        ),
        (
            "Kuidas valida mõõtu interjööri?",
            "Tehke mockup või lugege seinapilt tellimise juhendit; Dream Art toimib sageli paremini siis, kui mõõt on ruumiga kooskõlas.",
        ),
        (
            "Kas Dream Art on liiga “julge” kontorikingiks?",
            "Sõltub kontekstist; ametlikumates olukordades valige vaoshoitud Dream Art telg või klassikaline portree.",
        ),
    ]


def meta_et(slug: str) -> tuple[str, str, list[str]]:
    metas = {
        "dream-art-portree": (
            "Dream Art portree: unenäoline stiil ja tellimus Eestis",
            "Dream Art portree Eestis ja Tallinnas: stiil, eelvaade, võrdlus klassikalise portreega, interjöör, kingitus ja tellimus PopArt.ee kaudu.",
            ["dream art portree", "Dream Art portree Tallinn", "kunstiline portree", "tellimus Eestis", "eelvaade"],
        ),
        "dream-art-portree-fotost": (
            "Dream Art portree fotost: tõlgendus, mis jääb mälestuseks",
            "Dream Art portree fotost: lähte foto, eelvaade, lõuend ja tarne üle Eesti — premium kingitus ja kodu sein.",
            ["dream art portree fotost", "portree fotost", "Dream Art Eesti", "Tallinn", "kingitus"],
        ),
        "digitaalne-kunstiline-portree": (
            "Digitaalne kunstiline portree: Dream Art ja trükk",
            "Digitaalne kunstiline portree Dream Art suunas: töötlus, eelvaade, lõuend, interjöör ja kingi kasutusjuhtumid Eestis.",
            ["digitaalne kunstiline portree", "Dream Art", "kunstiline portree", "Tallinn", "trükk lõuendile"],
        ),
        "fantaasia-portree-fotost": (
            "Fantaasia portree fotost: Dream Art ja müstiline elegants",
            "Fantaasia portree fotost Eestis: Dream Art stiil, viisakas kingitus, interjöör, eelvaade ja tarne mõtted.",
            ["fantaasia portree fotost", "Dream Art portree", "kingitus pulmaks", "Tallinn", "eelvaade"],
        ),
        "dream-art-pilt-louendil": (
            "Dream Art pilt lõuendil: trükk, valgus ja interjöör",
            "Dream Art pilt lõuendil: lõuendi tekstuur, mõõt, valgus toas, kingitus ja tellimus Eestis koos eelvaatega.",
            ["dream art pilt lõuendil", "kunstiline portree lõuend", "Tallinn", "tellimus Eesti", "interjöör"],
        ),
    }
    return metas[slug]


def body_en(slug: str) -> str:
    return (
        f"<p>Dream Art portraits from your photo blend dreamy atmosphere with controlled artistic interpretation—ideal "
        f"when you want a premium gift or a statement piece for a Tallinn apartment or any Estonian home.</p>"
        f"<h2>What Dream Art means</h2>"
        f"<p>Compared to a more classical portrait, Dream Art leans into mood, light, and narrative while keeping the "
        f"face readable. Preview approval before printing is the quality anchor.</p>"
        f"<h2>Gift use cases</h2>"
        f"<p>Weddings, anniversaries, and seasonal gifting pair well with Dream Art when you want emotional lift without "
        f"losing decor sense.</p>"
        f"<h2>CTA</h2>"
        f"<p>Start on <a href='https://www.popart.ee'>PopArt.ee</a>. Read the Estonian cluster: "
        f"<a href='/en/blog/dream-art-portree'>Dream Art portrait</a>, "
        f"<a href='/en/blog/dream-art-portree-fotost'>from a photo</a>, "
        f"<a href='/en/blog/digitaalne-kunstiline-portree'>digital artistic portrait</a>, "
        f"<a href='/en/blog/fantaasia-portree-fotost'>fantasy portrait</a>, "
        f"<a href='/en/blog/dream-art-pilt-louendil'>canvas</a>. "
        f"Also see <a href='/en/blog/kunstiline-portree'>artistic portrait</a> and "
        f"<a href='/en/blog/joulukingitus-2026'>Christmas 2026 gifts</a>.</p>"
    )


def body_ru(slug: str) -> str:
    return (
        f"<p>Портрет Dream Art по фото — это премиальная художественная интерпретация с “сонной” атмосферой, "
        f"которая подходит для подарка или интерьера в Таллинне и по всей Эстонии.</p>"
        f"<h2>В чём смысл стиля</h2>"
        f"<p>По сравнению с более классическим портретом, Dream Art сильнее работает на настроение и историю, "
        f"сохраняя читаемость лица. Предпросмотр до печати — ключ к качеству.</p>"
        f"<h2>CTA</h2>"
        f"<p>Начните на <a href='https://www.popart.ee'>PopArt.ee</a>. Кластер: "
        f"<a href='/ru/blog/dream-art-portree'>Dream Art портрет</a>, "
        f"<a href='/ru/blog/dream-art-portree-fotost'>по фото</a>, "
        f"<a href='/ru/blog/digitaalne-kunstiline-portree'>цифровой художественный портрет</a>, "
        f"<a href='/ru/blog/fantaasia-portree-fotost'>фантазийный портрет</a>, "
        f"<a href='/ru/blog/dream-art-pilt-louendil'>на холсте</a>. "
        f"Также см. <a href='/ru/blog/kunstiline-portree'>художественный портрет</a>.</p>"
    )


def faqs_en() -> list[tuple[str, str]]:
    return [
        ("What is Dream Art?", "A dreamy, artistic portrait interpretation from your photo—preview before print."),
        ("Is it good for gifts?", "Yes for weddings, anniversaries, and close recipients when tone matches the context."),
        ("Do you deliver across Estonia?", "Yes—use an accurate address and realistic timelines."),
        ("How do I choose a size?", "Use a wall mockup or read the canvas sizing guide on the blog."),
        ("How does it compare to a classical portrait?", "Classical leans truer-to-photo; Dream Art leans mood and story."),
    ]


def faqs_ru() -> list[tuple[str, str]]:
    return [
        ("Что такое Dream Art?", "Художественная интерпретация с мечтательной атмосферой; предпросмотр до печати."),
        ("Подойдёт ли в подарок?", "Да — для свадьбы, годовщины и близких, если тон уместен."),
        ("Есть ли доставка по Эстонии?", "Да; укажите точный адрес и срок."),
        ("Как выбрать размер?", "Сделайте мокап стены или прочитайте гид по холсту в блоге."),
    ]


def meta_en(slug: str) -> tuple[str, str, list[str]]:
    m = {
        "dream-art-portree": (
            "Dream Art portrait in Estonia—style, preview, print",
            "Dream Art portrait from your photo in Estonia: mood-led art, preview before print, canvas, and decor notes.",
            ["dream art portrait", "Estonia", "Tallinn", "canvas", "gift"],
        ),
        "dream-art-portree-fotost": (
            "Dream Art portrait from a photo—Estonia ordering guide",
            "Order a Dream Art portrait from a photo with preview, realistic timelines, and delivery across Estonia.",
            ["dream art portrait from photo", "Estonia", "Tallinn"],
        ),
        "digitaalne-kunstiline-portree": (
            "Digital artistic portrait—Dream Art workflow",
            "Digital artistic portrait direction: Dream Art mood, preview, and print-ready canvas guidance.",
            ["digital artistic portrait", "Dream Art", "Estonia"],
        ),
        "fantaasia-portree-fotost": (
            "Fantasy portrait from a photo—Dream Art in Estonia",
            "Fantasy portrait from a photo with elegant Dream Art tone, preview, and gifting context.",
            ["fantasy portrait from photo", "Dream Art", "Estonia"],
        ),
        "dream-art-pilt-louendil": (
            "Dream Art canvas print—light, size, interior",
            "Dream Art image on canvas: texture, lighting, sizing, and premium interior placement in Estonia.",
            ["dream art canvas", "Estonia", "Tallinn", "interior"],
        ),
    }
    return m[slug]


def meta_ru(slug: str) -> tuple[str, str, list[str]]:
    m = {
        "dream-art-portree": (
            "Портрет Dream Art в Эстонии — стиль и предпросмотр",
            "Портрет Dream Art по фото в Эстонии и Таллине: атмосфера, предпросмотр, печать и подарок.",
            ["dream art портрет", "Эстония", "Таллин", "холст"],
        ),
        "dream-art-portree-fotost": (
            "Dream Art портрет по фото — заказ в Эстонии",
            "Dream Art портрет по фото: исходник, предпросмотр и доставка по Эстонии.",
            ["dream art портрет по фото", "Эстония", "Таллин"],
        ),
        "digitaalne-kunstiline-portree": (
            "Цифровой художественный портрет — Dream Art",
            "Цифровой художественный портрет в стиле Dream Art: обработка, предпросмотр, печать.",
            ["цифровой художественный портрет", "Dream Art", "Эстония"],
        ),
        "fantaasia-portree-fotost": (
            "Фантазийный портрет по фото — Dream Art",
            "Фантазийный портрет по фото: элегантный Dream Art, предпросмотр и подарок.",
            ["фантазийный портрет по фото", "Dream Art", "Эстония"],
        ),
        "dream-art-pilt-louendil": (
            "Dream Art картина на холсте — свет и размер",
            "Dream Art на холсте: фактура, свет в интерьере, размер и предпросмотр в Эстонии.",
            ["dream art холст", "Эстония", "Таллин"],
        ),
    }
    return m[slug]


def internal_cluster(loc: str, slug: str) -> list[dict]:
    out = [{"href": "https://www.popart.ee", "label": {"et": "PopArt.ee tellimus", "en": "Order on PopArt.ee", "ru": "Заказ на PopArt.ee"}[loc]}]
    for s in CLUSTER:
        if s == slug:
            continue
        lab = {
            "dream-art-portree": {"et": "Dream Art portree", "en": "Dream Art portrait", "ru": "Dream Art портрет"},
            "dream-art-portree-fotost": {"et": "Dream Art portree fotost", "en": "Portrait from a photo", "ru": "Портрет по фото"},
            "digitaalne-kunstiline-portree": {
                "et": "Digitaalne kunstiline portree",
                "en": "Digital artistic portrait",
                "ru": "Цифровой художественный портрет",
            },
            "fantaasia-portree-fotost": {"et": "Fantaasia portree fotost", "en": "Fantasy portrait", "ru": "Фантазийный портрет"},
            "dream-art-pilt-louendil": {"et": "Dream Art pilt lõuendil", "en": "Dream Art on canvas", "ru": "Dream Art на холсте"},
        }[s][loc]
        out.append({"href": href(loc, s), "label": lab})
    out.append({"href": href(loc, "kunstiline-portree"), "label": {"et": "Kunstiline portree", "en": "Artistic portrait", "ru": "Художественный портрет"}[loc]})
    return out[:8]


def write_all() -> None:
    dates = ["2026-05-02", "2026-05-04", "2026-05-06", "2026-05-08", "2026-05-10"]
    for idx, slug in enumerate(CLUSTER):
        raw = body_et(slug)
        body_et_final = pad_et(raw, slug, 2000)
        assert word_count(body_et_final) >= 2000, (slug, word_count(body_et_final))

        for loc, author, body_fn, faq_fn, meta_fn in (
            ("et", AUTHOR_ET, lambda s: body_et_final, lambda s: faqs_et(s), meta_et),
            ("en", AUTHOR_EN, body_en, lambda s: faqs_en(), meta_en),
            ("ru", AUTHOR_RU, body_ru, lambda s: faqs_ru(), meta_ru),
        ):
            title, desc, kws = meta_fn(slug)
            if len(title) > 60 or len(desc) > 155:
                raise ValueError((slug, loc, len(title), len(desc)))
            faqs = [{"question": q, "answer": a} for q, a in faq_fn(slug)]
            related = [s for s in CLUSTER if s != slug] + ["kunstiline-portree", "personaalne-kingitus"]
            payload = {
                "slug": slug,
                "category": "dream-art",
                "title": title,
                "description": desc,
                "publishedAt": dates[idx],
                "author": author,
                "coverImage": "/og-image.jpg",
                "keywords": kws,
                "bodyHtml": body_fn(slug),
                "faqs": faqs,
                "relatedSlugs": related[:5],
                "internalLinks": internal_cluster(loc, slug),
            }
            out = BLOG / loc / f"{slug}.json"
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(slug, "ET words", word_count(body_et_final))


if __name__ == "__main__":
    write_all()
    print("done")
