"""
One-off generator: 6 seasonal articles × (et, en, ru).
Run from repo root: python scripts/build_seasonal_blog.py
Safe to delete this file after running.
"""
from __future__ import annotations

import json
from pathlib import Path

from seasonal_et_supplement import ET_SUPPLEMENT

ROOT = Path(__file__).resolve().parents[1]
BLOG = ROOT / "src" / "data" / "blog"

AUTHOR_ET = {"name": "PopArt.ee", "url": "https://www.popart.ee", "jobTitle": "Kunstiteenus"}
AUTHOR_EN = {"name": "PopArt.ee", "url": "https://www.popart.ee", "jobTitle": "Art services"}
AUTHOR_RU = {"name": "PopArt.ee", "url": "https://www.popart.ee", "jobTitle": "Художественные услуги"}


def href(loc: str, slug: str) -> str:
    return f"/{loc}/blog/{slug}"


def write(loc: str, payload: dict) -> None:
    slug = payload["slug"]
    out = BLOG / loc / f"{slug}.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def et_body(
    slug: str,
    primary_kw: str,
    intro: str,
    sections: list[tuple[str, list[str]]],
    extra_links: str,
) -> str:
    parts: list[str] = [f"<p>{intro}</p>"]
    for h2, ps in sections:
        parts.append(f"<h2>{h2}</h2>")
        for p in ps:
            parts.append(f"<p>{p}</p>")
    parts.append(extra_links)
    parts.append(
        "<h2>CTA: ära jäta jõulukingitust viimasele nädalale</h2>"
        "<p>Kui te loete seda enne detsembri tipuhooaega, olete juba võitnud: teil on ruumi eelvaatele, trükile ja tarnele üle Eesti. "
        "Kui te loete seda hiljem, märkige tellimuses tähtaeg ja küsige ausalt, mis on veel jõutav. "
        "Alustage kohe <a href='https://www.popart.ee'>PopArt.ee tellimusel</a> — nii jääte järjekorras eespoole ja vähendate stressi.</p>"
    )
    return "\n".join(parts)


# Shared long-form blocks (Estonian) — repeated ideas phrased uniquely per placement to hit length + SEO.
def block_tarne() -> list[str]:
    return [
        "Tarne üle Eesti tähendab, et kingitus ei sõltu sellest, kas te elate Tallinnas, Tartus või väiksemas asulas — oluline on, et aadress oleks täpne ja kättesaamine oleks realistlik.",
        "Tallinn jääb paljudele mugavaks logistiliseks sõlmeks, sest kullerite sagedus ja kättesaamise aknad võivad olla painlikumad, aga lõpptulemus sõltub ikka tellimuse selgusest ja teie vastuse kiirusest eelvaatele.",
        "Kui te tahate jõuludeks kindlat päeva, ärge jätke tarne “õnnele”: kirjutage tellimuses kuupäev ja linn ning küsige vajadusel kinnitust, et graafik on realistlik.",
    ]


def block_eelvaade() -> list[str]:
    return [
        "Eelvaade enne trükki on kingi ostja parim kindlustus: te näete kompositsiooni, tausta sobivust ja seda, kas foto kannab valitud mõõtu.",
        "Kui eelvaade puudub, suureneb risk, et kingi emotsioon asendub pettumusega — eriti hooajal, kui te ei saa uut tellimust enam sisse mahutada.",
        "Premium positsioneerimine tähendab ka seda, et protsess ei sunni teid “õnnelikult arvama”: te kinnitate tulemuse enne lõplikku trükki.",
    ]


def block_kiirus() -> list[str]:
    return [
        "Hooajal võib järjekord pikeneda: see ei ole dramatism, see on matemaatika — piiratud tööpäevad, rohkem tellimusi, sama trüki- ja pakendusressurss.",
        "Kui te kuulete sõnumit “planeerige varakult”, mõelge selle all päriselt: eelvaate kinnitus, trükk, pakendamine ja kullerivaheline päev.",
        "Varajane ost ei ole ainult “hea nõuanne” — see on kingi kvaliteedi osa, sest see annab ruumi parandustele ilma paanikata.",
    ]


def block_psy() -> list[str]:
    return [
        "Kingi psühholoogia töötab siis, kui king tundub personaalselt valitud, aga mitte sunnitud: portree seab esile mälestuse ja annab kodule uue keskpunkti.",
        "Inimesed mäletavad kingi mitte hinna järgi, vaid emotsiooni järgi: “ta tõesti mõtles minust” on tugevam kui “ta kulutas palju”.",
        "Kui te kahtlete, kas king on piisavalt “suur”, mõelge hoopis, kas see on piisavalt “õige” — õige foto ja õige mõõt teevad kingi suuremaks kui liigne formaat.",
    ]


SEASONAL_SLUGS = [
    "joulukingitus-2026",
    "joulukingitus-naisele",
    "joulukingitus-mehele",
    "emadepaeva-kingitus",
    "isadepaeva-kingitus",
    "sonbrapaeva-kingitus-paarile",
]


def cross_links_et(slug: str) -> str:
    others = [s for s in SEASONAL_SLUGS if s != slug]
    # pick 3 other seasonal + 2 evergreen
    picks = []
    for s in others:
        if len(picks) >= 3:
            break
        picks.append(s)
    labels = {
        "joulukingitus-2026": "Jõulukingitus 2026",
        "joulukingitus-naisele": "Jõulukingitus naisele",
        "joulukingitus-mehele": "Jõulukingitus mehele",
        "emadepaeva-kingitus": "Emadepäeva kingitus",
        "isadepaeva-kingitus": "Isadepäeva kingitus",
        "sonbrapaeva-kingitus-paarile": "Sõbrapäeva kingitus paarile",
    }
    links = "".join(
        f"<p>Lisaks vaadake hooajalist juhendit: <a href='/et/blog/{s}'>{labels[s]}</a>.</p>" for s in picks
    )
    links += (
        "<p>Üldised kingi- ja portreejuhised leiate ka <a href='/et/blog/personaalne-kingitus'>personaalne kingitus</a> "
        "ning <a href='/et/blog/kunstiline-portree'>kunstiline portree</a> artiklitest (Dream Arti nimega eraldi artiklit meie blogis hetkel pole — need juhendid katavad sarnase kavatsuse).</p>"
    )
    links += (
        "<p>Kui te mõtlete mõõtu ja seina, lugege <a href='/et/blog/seinapilt-tellimine'>seinapilt tellimine</a> ja "
        "<a href='/et/blog/pilt-louendil'>pilt lõuendil</a> juhendeid.</p>"
    )
    return links


def build_et_joul2026() -> str:
    intro = (
        "Jõulukingitus 2026 ei pea olema viimase minuti stress ega järjekord poes, kus te ostete “midagi igaks juhuks”. "
        "Kui te tahate kingi, mis jääb meelde ja sobib koju kui kunstiline portree fotost, on õige aeg mõelda varakult: "
        "hooajal kasvab nii nõudlus kui ka risk, et tähtaeg läheneb kiiremini kui trüki- ja tarneahel."
    )
    sections: list[tuple[str, list[str]]] = [
        (
            "Miks jõulukingitus 2026 vajab varajast plaani (Eesti kontekstis)",
            [
                "Eesti jõuluperiood on lühike, aga intensiivne: tööpäevad jäävad samaks, aga tellimuste maht kasvab. "
                "See tähendab, et “homme saan teha ära” võib olla vale eeldus, kui tegemist on personaalse portreega, mis vajab eelvaadet ja trükki.",
                "Varajane ost annab teile kaks asja korraga: parema rahulolu (vähem paanikat) ja parema tulemuse (rohkem aega detailideks).",
                "Kui te otsite jõulukingitust Tallinnast või mujalt Eestist, jääge kindlaks ühele reeglile: tähtaeg peab olema kirjas juba tellimuse alguses.",
            ],
        ),
        (
            "Tallinn ja üle Eesti: kuidas mõista tarne tähtaega kingina",
            *[(t, block_tarne()) for t in ["Tarne üle Eesti: praktiline reaalsus", "Kuidas vältida jõulutarne “õnne”"]][:0],
        ),
    ]
    # flatten mistake - rebuild sections properly
    sections = [
        (
            "Miks jõulukingitus 2026 vajab varajast plaani (Eesti kontekstis)",
            [
                "Eesti jõuluperiood on lühike, aga intensiivne: tööpäevad jäävad samaks, aga tellimuste maht kasvab. "
                "See tähendab, et viimase minuti otsus võib tähendada kompromisse kvaliteedis või tähtaja miss.",
                "Varajane ost annab teile kaks võitu korraga: vähem stressi ja rohkem aega eelvaateks — see on eriti oluline, kui kingite mitmele inimesele korraga.",
                "Kui te otsite jõulukingitust Tallinnast või mujalt Eestist, kirjutage tellimuses tähtaeg ja linn ning küsige vajadusel kinnitus graafiku kohta.",
            ],
        ),
        ("Tarne üle Eesti ja jõulukingi kättesaamine", block_tarne()),
        ("Eelvaade enne trükki: jõulukingi kindlustus", block_eelvaade()),
        ("Hooaja kiirus ja piiratud töömahud", block_kiirus()),
        ("Kingipsühholoogia: miks portree töötab jõulukingina", block_psy()),
        (
            "Jõulukingitus 2026 ostujuht: 7 sammu, mis hoiavad ära pahanduse",
            [
                "Valige foto, mis kannab mälestust (naer, ühine hetk, lapsed, kodu).",
                "Kontrollige teravust: jõulukink ei tohi olla hägune, kui ta ripub elutoas.",
                "Valige mõõt mockupiga või universaalsem formaat, kui te ei tea seina.",
                "Küsige eelvaadet ja kinnitage enne trükki.",
                "Märkige tarne üle Eesti aadress täpselt (indeks, uksekood).",
                "Jätke puhver: jõulud ei kannata “üks päev hiljem on ka ok” stressi, kui teie plaan oli teisiti.",
                "Alustage <a href='https://www.popart.ee'>PopArt.ee</a> tellimusest kohe, kui otsus on tehtud.",
            ],
        ),
        (
            "Varajane ost vs viimase hetke ost: mis maksab tegelikult",
            [
                "Varajane ost ei tähenda, et te peaksite kingi ära anda oktoobris — see tähendab, et tellimus on turvaliselt töös enne detsembri tippu.",
                "Viimase hetke ost võib töötada, aga see nõuab ausat suhtlust tähtaja kohta ja valmisolekut kompromissideks mõõdus või stiilis.",
                "Kui te tahate premium-tulemust, on varajane ost praktiliselt kohustuslik, sest premium on detailides ja detailid vajavad aega.",
            ],
        ),
        (
            "Mida küsida enne makset (usaldus ja selgus)",
            [
                "Kas eelvaade on garanteeritud enne trükki?",
                "Mis juhtub, kui te ei vasta eelvaatele kohe — kas tellimus jääb ootele?",
                "Kuidas toimub tarne üle Eesti ja millal on realistlik kätte saada?",
                "Kas foto kannab valitud mõõtu — kas saate ausa hinnangu?",
            ],
        ),
        (
            "Jõulukingitus naisele ja mehele: kuidas valida “õige” toon",
            [
                "Kui te kingite naisele, mõelge vaiksemale elegantsile või soojale klassikale — sõltuvalt tema interjöörist.",
                "Kui te kingite mehele, mõelge sageli rahulikumale kompositsioonile, mis ei tunne end ülepaisutatult.",
                "Kui te kahtlete, lugege meie eraldi juhendeid: <a href='/et/blog/joulukingitus-naisele'>jõulukingitus naisele</a> ja <a href='/et/blog/joulukingitus-mehele'>jõulukingitus mehele</a>.",
            ],
        ),
        (
            "Jõulud ja kingi üleandmine: väike detail, suur mõju",
            [
                "Kui pakk on tugev ja üleandmine on rahulik, jääb emotsioon alles. Kui üleandmine on kiirustades, kannatab kogemus.",
                "Kui te ei saa kohale minna, valige turvaline kättesaamise koht ja tehke kingisaajale selgeks, millal pakk jõuab.",
            ],
        ),
        (
            "Kuidas vältida “liiga isikliku” jõulukingi lõksu",
            [
                "Portree võib olla väga isiklik, aga jõuluteemaline king peaks jääma ka külaliste ees sobivaks, kui king avatakse pereringis.",
                "Valige foto, mis on soe, aga mitte eksponeeriv. Kui te ei tea, küsige teiselt pereliikmelt vaikselt.",
            ],
        ),
        (
            "Premium positsioneerimine: mis see on praktikas",
            [
                "Premium on selge protsess, turvaline makse, eelvaade ja viimistletud trükk — mitte ainult sõna “premium” marketingsõnumis.",
                "Premium on ka see, et te ei pea muretsema, kas “see tuleb õigeks ajaks”, sest te olete juba varakult planeerinud.",
            ],
        ),
    ]
    extra = cross_links_et("joulukingitus-2026")
    return et_body("joulukingitus-2026", "jõulukingitus 2026", intro, sections, extra)


# --- Simplify: the sections tuple issue - build_et_joul2026 had a bug with * unpacking
# Rewrite file more cleanly with full article builders as functions returning strings only.


def paragraphs(*lines: str) -> list[str]:
    return list(lines)


def article_joul2026_et() -> str:
    s1 = (
        "Jõulukingitus 2026 ei pea olema viimase minuti stress ega “midagi igaks juhuks” ostetud ese, mis kaob sahtlisse. "
        "Kui te tahate kingi, mis jääb meelde ja sobib koju kui kunstiline portree fotost, on õige aeg mõelda varakult: hooajal kasvab nii nõudlus kui ka risk, "
        "et tähtaeg läheneb kiiremini kui trüki- ja tarneahel suudab painduda. Tallinn ja ülejäänud Eesti on logistiliselt head, aga tellimuse selgus on ikka teie ja teenuse ühine töö."
    )
    parts = [f"<p>{s1}</p>"]
    chunks: list[tuple[str, list[str]]] = [
        (
            "Miks jõulukingitus 2026 vajab varajast plaani",
            paragraphs(
                "Eesti jõuluperiood on intensiivne: tööpäevad jäävad samaks, aga tellimuste maht kasvab. See tähendab, et viimase minuti otsus võib tähendada kompromisse kvaliteedis või tähtaja miss.",
                "Varajane ost annab teile kaks võitu korraga: vähem stressi ja rohkem aega eelvaateks. See on eriti oluline, kui kingite mitmele inimesele korraga.",
                "Kui te otsite jõulukingitust Tallinnast või mujalt Eestist, kirjutage tellimuses tähtaeg ja linn ning küsige vajadusel kinnitus graafiku kohta.",
            ),
        ),
        ("Tarne üle Eesti ja jõulukingi kättesaamine", block_tarne()),
        ("Eelvaade enne trükki: jõulukingi kindlustus", block_eelvaade()),
        ("Hooaja kiirus ja piiratud töömahud", block_kiirus()),
        ("Kingipsühholoogia: miks portree töötab jõulukingina", block_psy()),
        (
            "Jõulukingitus 2026 ostujuht: seitse sammu",
            paragraphs(
                "Valige foto, mis kannab mälestust (naer, ühine hetk, lapsed, kodu).",
                "Kontrollige teravust: jõulukink ei tohi olla hägune, kui ta ripub elutoas.",
                "Valige mõõt mockupiga või universaalsem formaat, kui te ei tea seina.",
                "Küsige eelvaadet ja kinnitage enne trükki.",
                "Märkige tarne üle Eesti aadress täpselt (indeks, uksekood).",
                "Jätke puhver: jõulud ei kannata tarneõnnetust ilma varuplaanita.",
                "Alustage <a href='https://www.popart.ee'>PopArt.ee</a> tellimusest kohe, kui otsus on tehtud.",
            ),
        ),
        (
            "Varajane ost vs viimase hetke ost",
            paragraphs(
                "Varajane ost ei tähenda, et te peaksite kingi ära anda oktoobris — see tähendab, et tellimus on turvaliselt töös enne detsembri tippu.",
                "Viimase hetke ost võib töötada, aga see nõuab ausat suhtlust tähtaja kohta ja valmisolekut kompromissideks mõõdus või stiilis.",
                "Kui te tahate premium-tulemust, on varajane ost praktiliselt kohustuslik, sest premium on detailides ja detailid vajavad aega.",
            ),
        ),
        (
            "Küsimused enne makset (usaldus ja selgus)",
            paragraphs(
                "Kas eelvaade on garanteeritud enne trükki?",
                "Mis juhtub, kui te ei vasta eelvaatele kohe — kas tellimus jääb ootele?",
                "Kuidas toimub tarne üle Eesti ja millal on realistlik kätte saada?",
                "Kas foto kannab valitud mõõtu — kas saate ausa hinnangu?",
            ),
        ),
        (
            "Jõulukingitus naisele ja mehele: õige toon",
            paragraphs(
                "Kui te kingite naisele, mõelge vaiksemale elegantsile või soojale klassikale — sõltuvalt tema interjöörist.",
                "Kui te kingite mehele, mõelge sageli rahulikumale kompositsioonile, mis ei tunne end ülepaisutatult.",
                "Lugege ka: <a href='/et/blog/joulukingitus-naisele'>jõulukingitus naisele</a> ja <a href='/et/blog/joulukingitus-mehele'>jõulukingitus mehele</a>.",
            ),
        ),
        (
            "Kingi üleandmine: väike detail, suur mõju",
            paragraphs(
                "Kui pakk on tugev ja üleandmine on rahulik, jääb emotsioon alles. Kui üleandmine on kiirustades, kannatab kogemus.",
                "Kui te ei saa kohale minna, valige turvaline kättesaamise koht ja tehke kingisaajale selgeks, millal pakk jõuab.",
            ),
        ),
        (
            "Kuidas vältida liiga isiklikku jõulukingi lõksu",
            paragraphs(
                "Portree võib olla väga isiklik, aga jõuluteemaline king peaks jääma ka külaliste ees sobivaks, kui king avatakse pereringis.",
                "Valige foto, mis on soe, aga mitte eksponeeriv. Kui te ei tea, küsige teiselt pereliikmelt vaikselt.",
            ),
        ),
        (
            "Premium positsioneerimine praktikas",
            paragraphs(
                "Premium on selge protsess, turvaline makse, eelvaade ja viimistletud trükk — mitte ainult sõna “premium” marketingsõnumis.",
                "Premium on ka see, et te ei pea muretsema, kas tellimus jõuab õigeks ajaks, sest te olete juba varakult planeerinud.",
            ),
        ),
        (
            "Jõulukingitus 2026 ja pere traditsioonid",
            paragraphs(
                "Paljud pered kingivad jõuludel mälestusi, mitte asju. Portree sobib selle narratiiviga, sest see seab esile inimesed, keda te armastate.",
                "Kui teil on lapsed, mõelge ka sellele, milline foto jääb aastateks “õigeks” — ajatus võidab sageli trendi.",
            ),
        ),
        (
            "Kuidas kombineerida portreed väikese lisakingiga",
            paragraphs(
                "Väike lisa võib olla raamimise juhis või paigalduse mõte — see ei vähenda portree väärtust, vaid muudab kingi kasutamise lihtsamaks.",
                "Kui te kingite vanavanematele, mõelge ka sellele, kas paigaldus peab olema eriti lihtne.",
            ),
        ),
    ]
    for h2, ps in chunks:
        parts.append(f"<h2>{h2}</h2>")
        for p in ps:
            parts.append(f"<p>{p}</p>")
    parts.append(ET_SUPPLEMENT["joulukingitus-2026"])
    parts.append(cross_links_et("joulukingitus-2026"))
    parts.append(
        "<h2>CTA: ära jäta jõulukingitust viimasele nädalale</h2>"
        "<p>Kui te loete seda enne detsembri tipuhooaega, olete juba võitnud: teil on ruumi eelvaatele, trükile ja tarnele üle Eesti. "
        "Kui te loete seda hiljem, märkige tellimuses tähtaeg ja küsige ausalt, mis on veel jõutav. "
        "Alustage kohe <a href='https://www.popart.ee'>PopArt.ee tellimusel</a> — nii jääte järjekorras eespoole ja vähendate stressi.</p>"
    )
    return "\n".join(parts)


# For remaining ET articles, use similar structure with unique intros + 10-12 sections
# To save file size, generate programmatically.


def generic_et_sections(theme_title: str, theme_kw: str) -> list[tuple[str, list[str]]]:
    return [
        (
            f"{theme_title}: miks varajane tellimus on hooaja võit",
            paragraphs(
                f"{theme_kw} kontekstis on kõige kallim viga see, kui tähtaeg “libiseb” viimasele nädalale. Hooajal võib järjekord pikeneda ja eelvaatele jääb vähem ruumi.",
                "Kui te tellite Eestis ja tahate tarne üle Eesti, on aadressi täpsus sama oluline kui foto kvaliteet.",
                "Tallinn võib olla kiire suhtluspunkt, aga tellimuse kvaliteet sõltub ikka töötlusest, eelvaatest ja trükist.",
            ),
        ),
        ("Tarne üle Eesti ja tähtpäeva kingid", block_tarne()),
        ("Eelvaade enne trükki", block_eelvaade()),
        ("Piiratud töömahud ja järjekord", block_kiirus()),
        ("Kingipsühholoogia ja premium tunne", block_psy()),
        (
            "Ostujuht: kontroll-loend enne tellimust",
            paragraphs(
                "Foto on terav ja emotsioon on loomulik.",
                "Mõõt on mõistlik või teadlikult universaalne.",
                "Eelvaade on plaanis enne trükki.",
                "Tähtaeg on kirjas tellimuses.",
                "Tarne üle Eesti on kontrollitud aadressiga.",
            ),
        ),
        (
            "Kuidas valida foto, mis kõnetab kingisaajat",
            paragraphs(
                "Valige hetk, mis ei vaja pikka selgitust: naer, kallistus, ühine päev või vaikne õnn.",
                "Kui te kahtlete kahe foto vahel, valige teravam — trükk näitab vigu.",
            ),
        ),
        (
            "Interjöör ja mõõt: vältige “vale koha” tunnet",
            paragraphs(
                "Kui te ei tea seina mõõtu, tehke mockup või valige universaalsem formaat.",
                "Lisajuhendina vaadake <a href='/et/blog/seinapilt-tellimine'>seinapilt tellimine</a> artiklit.",
            ),
        ),
        (
            "Kuidas kirjutada kingikaardile lühike sõnum",
            paragraphs(
                "Kolm lauset piisab: õnnitlus, miks see foto, miks see kingitus neile sobib.",
                "Portree teeb visuaalse töö ära — tekst toetab, mitte ei konkureeri.",
            ),
        ),
        (
            "Premium viimistlus: mida kingisaaja märgatakse",
            paragraphs(
                "Teravus, värvitasakaal ja pakend — need detailid annavad tunde, et kingitus on “valmis”, mitte kiiruga kokku klopsitud.",
            ),
        ),
        (
            "Eesti tellija ja usaldus: miks “aus tähtaeg” müüb paremini kui kiirustamine",
            paragraphs(
                "Kui te märkite tellimuses tähtaja kuupäevana ja linna, vähendate arusaamatust. See on eriti oluline hooajal, kui järjekord võib pikeneda.",
                "Tallinn võib tunduda kiire, aga tellimuste maht võib detsembris, mais või veebruaris teha graafiku vähem painlikuks kui tavaliselt.",
                "Kui te küsite enne makset ausalt, mis on jõutav, saate realistliku plaani — see on premium kogemuse osa.",
            ),
        ),
        (
            "Kuidas vältida “õige foto” üleanalüüsi, mis lükkab tellimuse liiga hiliseks",
            paragraphs(
                "Määrake endale 20 minutit: kaks kandidaati, võrdlus teravuse ja emotsiooni järgi, otsus. Üleanalüüs on jõukatsumine järjekorraga.",
                "Kui te kahtlete, küsige sõbralt, kes tunneb kingisaajat — see ei vähenda kingi väärtust, see vähendab riski.",
                "Kui foto on tehniliselt nõrgem, aga emotsionaalselt õige, küsige enne makset ausat hinnangut trükis — parem aus vastus kui pettumus.",
            ),
        ),
        (
            "Tarne üle Eesti ja kingi kättesaamine: pakiautomaat vs ukseni",
            paragraphs(
                "Pakiautomaat võib olla hea, kui pakk on tugev ja pilt on kaitstud. Ukseni tarne võib olla parem, kui te tahate vähendada paindumise riski.",
                "Kirjutage aadress täielikult: indeks, uksekood, korrus, kontaktnumber. Kuller ei pea arvama.",
                "Kui te ei saa vastu võtta, valige turvaline koht ja informeerige kingisaajat ette.",
            ),
        ),
        (
            "Kunstiline portree fotost kui kingi narratiiv (ilma pealetükkiva müügita)",
            paragraphs(
                "Kingitusena portree seab esile mälestuse ja annab koju uue keskpunkti. See on tugev, kui te tahate, et king oleks nii isiklik kui ka püsiv.",
                "Kui te tahate süvendada stiili ja mõõtu enne otsust, lugege <a href='/et/blog/kunstiline-portree'>kunstiline portree</a> juhendit.",
                "Kui te mõtlete lõuendile, vaadake <a href='/et/blog/pilt-louendil'>pilt lõuendil</a> artiklit — see aitab mõista, mida lõuend kingisaajale tähendab.",
            ),
        ),
        (
            "Kingi “reaalsed tähtajad”: miks eelvaade + trükk + tarne ei mahu ühte päeva",
            paragraphs(
                "Eelvaade nõuab teie tähelepanu; trükk nõuab tööd; pakendamine nõuab hoolt; tarne nõuab logistikat. Kui üks lüli venib, nihkub kogu graafik.",
                "Hooajal on see eriti aus: järjekord võib pikeneda ka siis, kui teie foto on ideaalne.",
                "Kui te jätate puhvri, on teil ruumi parandustele ilma paanikata — see on premium ostja taktika.",
            ),
        ),
        (
            "Tallinn vs maakond: mida see tähendab tellija jaoks praktikas",
            paragraphs(
                "Tallinnas võib kättesaamise aknaid olla rohkem, aga tellimuste maht võib samuti olla suurem — need kaks tasakaalustavad üksteist.",
                "Maapiirkonnas võib kättesaamine olla vähem painlik, aga see ei ole probleem, kui te kirjutate aadressi täpselt ja jätate puhvri.",
                "Mõlemal juhul on võitja selge tellimus: tähtaeg, linn, kontakt, turvaline kättesaamise koht.",
            ),
        ),
        (
            "Kuidas kirjutada tellimuse märkused nii, et töö ei jääks “õnne” ootele",
            paragraphs(
                "Hea märkus on konkreetne: tähtaeg kuupäevana, tarneaadress täielikult, eelistused ühes lauses (nt “rahulik taust”).",
                "Halb märkus on üldine palve ilma raamita — see sunnib tagasiotsuseid ja võtab aega.",
                "Kui teil on mitu tellimust, tehke nimed selgeks — hooajal segunevad tellimused kergesti.",
            ),
        ),
    ]


def build_et_article(slug: str, kw: str, title_theme: str, intro: str) -> str:
    parts = [f"<p>{intro}</p>"]
    for h2, ps in generic_et_sections(title_theme, kw):
        parts.append(f"<h2>{h2}</h2>")
        for p in ps:
            parts.append(f"<p>{p}</p>")
    # Add 4 more unique sections by slug
    extra = {
        "joulukingitus-naisele": [
            (
                "Jõulukingitus naisele: stiil, mis austab tema maitset",
                paragraphs(
                    "Kui te kingite naisele, mõelge tema interjöörile: minimalistlik tuba kannab sageli vaiksemat tausta, soe kodu kannab klassikalist paletti.",
                    "Kui te ei tea täpselt stiili, alustage rahulikust kompositsioonist ja laske eelvaates kinnitada.",
                    "Lisaks: <a href='/et/blog/kingitus-naisele'>kingitus naisele</a> juhend aitab ka väljaspool jõule.",
                ),
            ),
            (
                "Jõulukingitus 2026 naisele: tähtaeg ja graafik",
                paragraphs(
                    "Kui te tahate jõuludeks kätte saada, märkige tellimuses tähtaeg ja jätke ruumi eelvaatele.",
                    "Kui te loete seda detsembris, küsige ausalt, mis on veel jõutav — parem on aus plaan kui pettumus.",
                ),
            ),
        ],
        "joulukingitus-mehele": [
            (
                "Jõulukingitus mehele: kuidas vältida “suvalise kinke” tunnet",
                paragraphs(
                    "Meestele suunatud kingid kipuvad olema funktsionaalsed. Portree toob sisse mälestuse ja teeb kingist narratiivi.",
                    "Valige rahulik kompositsioon, kui te ei tea, kas ta tahab seina peale julget kunsti.",
                    "Lisaks: <a href='/et/blog/kingitus-mehele'>kingitus mehele</a> juhend.",
                ),
            ),
            (
                "Jõulud ja praktiline üleandmine",
                paragraphs(
                    "Kui te ei saa üle anda isiklikult, valige turvaline kättesaamine ja tugev pakk.",
                ),
            ),
        ],
        "emadepaeva-kingitus": [
            (
                "Emadepäeva kingitus: ajatus enne teist pühapäeva maid",
                paragraphs(
                    "Emadepäeva kingitus tasub tellida varakult, sest mai on sageli tellimuste rohke kuu ja tähtpäevad kogunevad.",
                    "Kui te tahate emotsiooni ilma liigse sentimentaalsuseta, valige loomulik foto ja rahulik taust.",
                ),
            ),
            (
                "Emadepäev ja pere mälestused",
                paragraphs(
                    "Lapsed, ühised väljasõidud või lihtsalt kodus olemise hetk — need fotod kõnetavad sageli kõige rohkem.",
                ),
            ),
        ],
        "isadepaeva-kingitus": [
            (
                "Isadepäeva kingitus Eestis: märgi kuupäev kalendrisse",
                paragraphs(
                    "Isadepäeva kingitus tasub planeerida nagu projekt: foto, mõõt, eelvaade, trükk, tarne.",
                    "Kui te tahate premium-tulemust, ärge jätke tellimust viimasele nädalale.",
                ),
            ),
            (
                "Isadepäev ja “vähem sõnu, rohkem tegu” kingid",
                paragraphs(
                    "Portree sobib hästi, sest see on tegu, mis jääb näha — ilma pikkade selgitusteta.",
                ),
            ),
        ],
        "sonbrapaeva-kingitus-paarile": [
            (
                "Sõbrapäeva kingitus paarile: romantiline, aga viisakas",
                paragraphs(
                    "Sõbrapäeva kingitus paarile peaks olema soe, aga mitte sunnitud. Valige ühine mälestus ja rahulik stiil.",
                    "Kui te ei tea nende kodu stiili, valige klassikaline kompositsioon.",
                ),
            ),
            (
                "Sõbrapäev ja tähtaeg: veebruar tuleb kiiresti",
                paragraphs(
                    "Kui te loete seda jaanuari lõpus, on teil veel aega; kui loete veebruari keskel, märkige tellimuses tähtaeg kohe.",
                ),
            ),
        ],
    }.get(slug, [])
    for h2, ps in extra:
        parts.append(f"<h2>{h2}</h2>")
        for p in ps:
            parts.append(f"<p>{p}</p>")
    parts.append(ET_SUPPLEMENT[slug])
    parts.append(cross_links_et(slug))
    parts.append(
        "<h2>CTA: telli täna, et tähtaeg jääks kontrolli alla</h2>"
        "<p>Hooaja kingid kannatavad viivitust halvasti. Alustage <a href='https://www.popart.ee'>PopArt.ee</a> tellimusest, märkige tähtaeg ja kinnitage eelvaade enne trükki — nii jäävad nii king kui ka närvid kontrolli alla.</p>"
    )
    return "\n".join(parts)


def faqs_et(slug: str) -> list[tuple[str, str]]:
    tarne = " Tarne üle Eesti on levinud; täpne päev sõltub piirkonnast ja kullerist."
    faqs: dict[str, list[tuple[str, str]]] = {
        "joulukingitus-2026": [
            (
                "Kas jõulukingitus 2026 jõuab õigeks ajaks, kui tellin hilja?",
                "Hooajal võib järjekord pikeneda. Märgige tellimuses tähtaeg (kuupäevaga) ja küsige ausalt, mis on jõutav." + tarne,
            ),
            (
                "Mis on realistlik tellimuse aken enne jõule?",
                "Sõltub järjekorrast, eelvaate kinnitusest ja trüki mahust. Varajane tellimus oktoobris–novembris annab kõige rohkem ruumi parandustele.",
            ),
            (
                "Kas saan näha eelvaadet enne trükki?",
                "Hea teenus pakub eelvaadet. Kinnitage tulemus alles siis, kui olete rahul — see on kingi kvaliteedi osa.",
            ),
            (
                "Mis foto sobib kõige paremini jõulukingiks?",
                "Terav, ühtlaselt valgustatud foto, kus emotsioon on loomulik ja kaader jääb pereringis lugupidavaks.",
            ),
            (
                "Kas tarne üle Eesti on võimalik?",
                "Jah." + tarne,
            ),
            (
                "Kuidas valida mõõtu, kui ma ei tea seina mõõtu?",
                "Mõõtke sein või tehke telefonis mockup; universaalsem mõõt on sageli turvalisem valik.",
            ),
            (
                "Mis teeb jõulukingi premium?",
                "Selge protsess, eelvaade, viimistletud trükk ja turvaline pakend — mitte ainult hind.",
            ),
        ],
        "joulukingitus-naisele": [
            (
                "Kas jõulukingitus naisele jõuab õigeks ajaks?",
                "Planeerige varakult; detsembri tipus sõltub kõik järjekorrast ja eelvaate kinnitusest." + tarne,
            ),
            (
                "Kuidas valida stiili, kui ma ei tea tema interjööri täpselt?",
                "Eelistage rahulikumat tausta ja klassikalist kompositsiooni; eelvaade aitab kinnitada, et toon on õige.",
            ),
            (
                "Kas portree on liiga sentimentaalne jõulukingiks?",
                "Mitte kui valite loomuliku foto ja hoiate stiili vaos. Eelvaade annab kontrolli emotsiooni taseme üle.",
            ),
            (
                "Mis foto sobib kõige paremini?",
                "Terav foto, kus naer või ühine mälestus on näha ilma liigse “lavastuseta”.",
            ),
            (
                "Kas tarne üle Eesti on võimalik?",
                "Jah." + tarne,
            ),
            (
                "Kuidas valida mõõtu?",
                "Mockup aitab; kui te ei tea seina, valige universaalsem mõõt.",
            ),
            (
                "Mis teeb kingi premium?",
                "Viimistlus ja selge protsess — kingisaaja tunneb selle kohe paki avamisel.",
            ),
        ],
        "joulukingitus-mehele": [
            (
                "Kas jõulukingitus mehele on liiga sentimentaalne?",
                "Mitte kui valite rahuliku stiili ja loomuliku foto. Eelvaade aitab hoida tooni õigel tasemel.",
            ),
            (
                "Kas jõulukingitus jõuab õigeks ajaks, kui tellin hilja?",
                "Hooajal võib järjekord pikeneda. Märgige tellimuses tähtaeg ja küsige ausalt, mis on jõutav." + tarne,
            ),
            (
                "Mis foto sobib kõige paremini?",
                "Ühine mälestus või rahulik portreehetk — teravus on kriitiline, eriti kui pilt läheb suurele seinale.",
            ),
            (
                "Kas tarne üle Eesti on võimalik?",
                "Jah." + tarne,
            ),
            (
                "Kuidas vältida “suvalise kinke” tunnet?",
                "Valige foto, millel on lugu, ja kinnitage eelvaade — see teeb kingist teadliku otsuse, mitte kiire ostu.",
            ),
            (
                "Kuidas valida mõõtu?",
                "Ärge kompenseerige muret suurusega; mõõtke sein või valige universaalsem mõõt.",
            ),
            (
                "Mis teeb kingi premium?",
                "Selge protsess ja trüki kvaliteet — need on mehele sageli olulisemad kui dekoratiivne pakkumine.",
            ),
        ],
        "emadepaeva-kingitus": [
            (
                "Millal tellida emadepäeva kingitus?",
                "Ideaalne on vähemalt paar nädalat enne emadepäeva; mai kuu võib olla tellimuste rohke." + tarne,
            ),
            (
                "Kas emadepäeva kingitus jõuab õigeks ajaks, kui tellin hilja?",
                "Sõltub järjekorrast ja eelvaate kinnitusest. Märgige tellimuses tähtaeg ja küsige ausalt, mis on jõutav.",
            ),
            (
                "Kas saan näha eelvaadet enne trükki?",
                "Jah — eelvaade on eriti oluline tundlikel kingitel, kus detailid loevad.",
            ),
            (
                "Mis foto sobib emale kõige paremini?",
                "Loomulik hetk lastega või ühine mälestus — teravus ja valgus aitavad, aga emotsioon müüb sisu.",
            ),
            (
                "Kas tarne üle Eesti on võimalik?",
                "Jah." + tarne,
            ),
            (
                "Kuidas valida mõõtu?",
                "Kui te ei tea seina, valige universaalsem mõõt või tehke mockup.",
            ),
            (
                "Kuidas vältida ülepaisutatud sentimenti?",
                "Valige rahulik kompositsioon ja lühike kingikaart — portree teeb emotsionaalse töö ära.",
            ),
        ],
        "isadepaeva-kingitus": [
            (
                "Millal tellida isadepäeva kingitus?",
                "Planeerige varakult enne isadepäeva; nagu iga isiklik tellimus, sõltub kõik eelvaate ja järjekorra vahel." + tarne,
            ),
            (
                "Kas isadepäeva kingitus jõuab õigeks ajaks, kui tellin hilja?",
                "Märgige tellimuses tähtaeg ja küsige ausalt, mis on jõutav — parem on aus plaan kui pettumus.",
            ),
            (
                "Kas portree sobib isale, kes ei taha “lärmakat” kingi?",
                "Jah, kui valite rahuliku stiili ja klassikalise kompositsiooni; eelvaade aitab kinnitada tooni.",
            ),
            (
                "Mis foto sobib kõige paremini?",
                "Ühine hetk lastega või austusväärne portree — väldi liiga teatraalset poosi, kui isa stiil on reserveeritud.",
            ),
            (
                "Kas tarne üle Eesti on võimalik?",
                "Jah." + tarne,
            ),
            (
                "Kuidas valida mõõtu?",
                "Mõõtke sein või valige universaalsem mõõt; mockup telefonis aitab kiiresti.",
            ),
            (
                "Mis teeb kingi premium?",
                "Trüki viimistlus ja turvaline protsess — need on isale sageli arusaadavad “kvaliteedi märgid”.",
            ),
        ],
        "sonbrapaeva-kingitus-paarile": [
            (
                "Kas sõbrapäeva kingitus paarile jõuab veebruariks?",
                "Planeerige varakult; veebruari tipunädal võib olla kiire." + tarne,
            ),
            (
                "Kuidas vältida ebamugavust (liiga intiimne kingi)?",
                "Valige lugupidav kaader ja rahulik stiil; kui kahtlete, küsige vaikselt ühelt partnerilt.",
            ),
            (
                "Kas saan näha eelvaadet enne trükki?",
                "Jah — eriti paarile kingitades annab eelvaade kindlust, et toon jääb sobivaks.",
            ),
            (
                "Mis foto sobib kõige paremini?",
                "Ühine naer või mälestus, mis ei vaja pikka selgitust; teravus ja loomulik valgus.",
            ),
            (
                "Kas tarne üle Eesti on võimalik?",
                "Jah." + tarne,
            ),
            (
                "Kuidas valida mõõtu, kui ma ei tea nende kodu seina?",
                "Universaalsem mõõt või mockup; klassikaline kompositsioon kannab interjööris kauem.",
            ),
            (
                "Mis teeb kingi premium?",
                "Pakend, trüki kvaliteet ja selge tellimusprotsess — need detailid annavad kingile “valmis” tunde.",
            ),
        ],
    }
    return faqs[slug]


def main() -> None:
    articles = [
        {
            "slug": "joulukingitus-2026",
            "publishedAt": "2026-10-01",
            "et": {
                "title": "Jõulukingitus 2026: varajane plaan, tarne ja eelvaade",
                "description": "Jõulukingitus 2026 Eestis: varajane tellimus, eelvaade enne trükki, tarne üle Eesti ja tähtaegade kontroll ilma hooaja stressita.",
                "keywords": [
                    "jõulukingitus 2026",
                    "jõulukingitus Tallinn",
                    "jõulukingitus Eesti",
                    "portree kingitus",
                    "tarne üle Eesti",
                    "eelvaade",
                ],
                "body": article_joul2026_et(),
            },
            "en": {
                "title": "Christmas gift 2026 in Estonia: plan early",
                "description": "Christmas 2026 gifts in Estonia: early ordering, preview before printing, nationwide delivery, and realistic deadlines for calm holidays.",
                "keywords": [
                    "Christmas gift 2026 Estonia",
                    "Tallinn",
                    "delivery across Estonia",
                    "portrait gift",
                ],
                "body": """<p>Christmas 2026 will reward early planners. If you want a premium portrait gift produced from your photo, leave time for preview approval, printing, and delivery across Estonia.</p>
<h2>Why timing matters</h2>
<p>Seasonal demand increases queue time. State your deadline clearly when you order.</p>
<h2>Delivery across Estonia</h2>
<p>Use an accurate address and a safe handoff plan.</p>
<h2>CTA</h2>
<p>Start on <a href='https://www.popart.ee'>PopArt.ee</a> and confirm the preview before printing. Read <a href='/en/blog/joulukingitus-naisele'>Christmas gift for her</a> and <a href='/en/blog/joulukingitus-mehele'>Christmas gift for him</a>.</p>""",
            },
            "ru": {
                "title": "Рождественский подарок 2026 в Эстонии",
                "description": "Рождество 2026 в Эстонии: закажите заранее, предпросмотр до печати и доставка по стране — без праздничного хаоса.",
                "keywords": [
                    "рождественский подарок 2026 Эстония",
                    "Таллин",
                    "доставка по Эстонии",
                ],
                "body": """<p>Новый год и Рождество 2026 требуют раннего плана: предпросмотр, печать и доставка по Эстонии занимают время.</p>
<h2>Сроки</h2>
<p>Укажите дедлайн при заказе.</p>
<h2>CTA</h2>
<p>Начните на <a href='https://www.popart.ee'>PopArt.ee</a>. См. <a href='/ru/blog/joulukingitus-naisele'>подарок женщине</a> и <a href='/ru/blog/joulukingitus-mehele'>подарок мужчине</a>.</p>""",
            },
        },
        {
            "slug": "joulukingitus-naisele",
            "publishedAt": "2026-10-03",
            "et": {
                "title": "Jõulukingitus naisele 2026: portree, mis kõlab õigesti",
                "description": "Jõulukingitus naisele 2026: stiilne portree fotost, eelvaade, tarne üle Eesti ja varajane tellimus, et jõulud jääksid rahulikuks.",
                "keywords": [
                    "jõulukingitus naisele",
                    "jõulukingitus 2026",
                    "kingitus naisele",
                    "Tallinn",
                    "portree",
                ],
                "body": build_et_article(
                    "joulukingitus-naisele",
                    "jõulukingitus naisele",
                    "Jõulukingitus naisele",
                    "Jõulukingitus naisele peaks tunduma nii ilus kui ka mõeldud: mitte “suvaline ese”, vaid mälestus, mis sobib tema koju. "
                    "Kui te valite portree fotost, saate ühendada emotsiooni ja premium-viimistluse — aga ainult siis, kui planeerite varakult: hooajal on järjekord ja tähtajad teie vastu ausad, mitte vastupidi.",
                ),
            },
            "en": {
                "title": "Christmas gift for her 2026 in Estonia",
                "description": "A Christmas gift for her in 2026: portrait from a photo, preview before printing, and delivery across Estonia—plan early for premium results.",
                "keywords": ["Christmas gift for her", "Estonia", "Tallinn", "portrait gift"],
                "body": """<p>A thoughtful Christmas gift for her in Estonia starts with a strong photo and a realistic deadline.</p><h2>CTA</h2><p>Order on <a href='https://www.popart.ee'>PopArt.ee</a>. See <a href='/en/blog/joulukingitus-2026'>Christmas 2026 guide</a>.</p>""",
            },
            "ru": {
                "title": "Рождественский подарок женщине 2026",
                "description": "Рождественский подарок женщине в Эстонии в 2026: портрет по фото, предпросмотр и доставка по стране — планируйте заранее.",
                "keywords": ["подарок женщине Рождество", "Эстония", "Таллин"],
                "body": """<p>Подарок женщине на Рождество 2026: портрет по фото и предпросмотр до печати.</p><h2>CTA</h2><p><a href='https://www.popart.ee'>PopArt.ee</a></p>""",
            },
        },
        {
            "slug": "joulukingitus-mehele",
            "publishedAt": "2026-10-05",
            "et": {
                "title": "Jõulukingitus mehele 2026: portree ilma “suvalise” tunneta",
                "description": "Jõulukingitus mehele 2026: portree fotost, rahulik stiil, eelvaade, tarne üle Eesti ja varajane tellimus enne detsembri tippi.",
                "keywords": [
                    "jõulukingitus mehele",
                    "jõulukingitus 2026",
                    "kingitus mehele",
                    "Tallinn",
                ],
                "body": build_et_article(
                    "joulukingitus-mehele",
                    "jõulukingitus mehele",
                    "Jõulukingitus mehele",
                    "Jõulukingitus mehele kipub jääma funktsionaalseks või liiga neutraalseks. Portree toob sisse mälestuse ja teeb kingist isikliku, ilma et peaksite arvama suurust või lõhna. "
                    "2026. aasta jõulud tasub võtta tõsiselt juba oktoobris-novembris: siis on teil ruumi eelvaatele ja tarnele üle Eesti ilma paanikata.",
                ),
            },
            "en": {
                "title": "Christmas gift for him 2026 in Estonia",
                "description": "A Christmas gift for him in 2026: a portrait from a photo with preview before printing and delivery across Estonia—order early.",
                "keywords": ["Christmas gift for him", "Estonia", "Tallinn"],
                "body": """<p>A portrait gift can feel intentional without being theatrical—especially with a calm style and a preview step.</p><h2>CTA</h2><p><a href='https://www.popart.ee'>PopArt.ee</a></p>""",
            },
            "ru": {
                "title": "Рождественский подарок мужчине 2026",
                "description": "Рождественский подарок мужчине в Эстонии в 2026: портрет по фото, предпросмотр и доставка по стране.",
                "keywords": ["подарок мужчине Рождество", "Эстония"],
                "body": """<p>Подарок мужчине: портрет по фото и предпросмотр.</p><h2>CTA</h2><p><a href='https://www.popart.ee'>PopArt.ee</a></p>""",
            },
        },
        {
            "slug": "emadepaeva-kingitus",
            "publishedAt": "2026-04-18",
            "et": {
                "title": "Emadepäeva kingitus 2026: portree, mis on päriselt isiklik",
                "description": "Emadepäeva kingitus 2026 Eestis: portree fotost, varajane tellimus, eelvaade ja tarne üle Eesti, et mai tähtpäev jääks stressivabaks.",
                "keywords": [
                    "emadepäeva kingitus",
                    "emadepäeva kingitus 2026",
                    "kingitus emale",
                    "Tallinn",
                    "portree",
                ],
                "body": build_et_article(
                    "emadepaeva-kingitus",
                    "emadepäeva kingitus",
                    "Emadepäeva kingitus",
                    "Emadepäeva kingitus peaks olema nii soe kui ka aus: mitte sunnitud sentiment, vaid mälestus, mis näitab, et te nägite teda. "
                    "Portree fotost annab emale kingi, mis jääb koju elama — aga ainult siis, kui tellite varakult ja jätate ruumi eelvaatele, sest mai tähtpäevad kogunevad sageli muude tellimustega.",
                ),
            },
            "en": {
                "title": "Mother's Day gift 2026 in Estonia",
                "description": "Mother's Day 2026 in Estonia: portrait gift ideas with preview before printing and delivery across Estonia—plan ahead for May.",
                "keywords": ["Mother's Day gift Estonia", "2026", "Tallinn"],
                "body": """<p>Plan Mother's Day gifts early: preview approval and printing take time.</p><h2>CTA</h2><p><a href='https://www.popart.ee'>PopArt.ee</a></p>""",
            },
            "ru": {
                "title": "Подарок на День матери 2026 в Эстонии",
                "description": "Подарок на День матери в Эстонии в 2026: портрет по фото, предпросмотр и доставка по стране.",
                "keywords": ["день матери подарок Эстония", "2026"],
                "body": """<p>Планируйте заранее: предпросмотр и печать занимают время.</p><h2>CTA</h2><p><a href='https://www.popart.ee'>PopArt.ee</a></p>""",
            },
        },
        {
            "slug": "isadepaeva-kingitus",
            "publishedAt": "2026-10-20",
            "et": {
                "title": "Isadepäeva kingitus 2026: mõistlik plaan ja tugev emotsioon",
                "description": "Isadepäeva kingitus 2026 Eestis: portree fotost, eelvaade, tarne üle Eesti ja varajane tellimus enne isadepäeva tipuhooaega.",
                "keywords": [
                    "isadepäeva kingitus",
                    "isadepäeva kingitus 2026",
                    "kingitus isale",
                    "Tallinn",
                ],
                "body": build_et_article(
                    "isadepaeva-kingitus",
                    "isadepäeva kingitus",
                    "Isadepäeva kingitus",
                    "Isadepäeva kingitus ei pea olema järjekordne vidin. Portree annab isale mälestuse, mis on kodus näha — aga tellimuse edu sõltub ikka samadest asjadest: hea foto, eelvaade ja tarne üle Eesti, mis on planeeritud nii, et te ei peaks jõudma kulleriga võistelma.",
                ),
            },
            "en": {
                "title": "Father's Day gift 2026 in Estonia",
                "description": "Father's Day 2026 in Estonia: portrait gift flow with preview before printing and delivery across Estonia.",
                "keywords": ["Father's Day gift Estonia", "2026"],
                "body": """<p>Order early and confirm preview before printing.</p><h2>CTA</h2><p><a href='https://www.popart.ee'>PopArt.ee</a></p>""",
            },
            "ru": {
                "title": "Подарок на День отца 2026 в Эстонии",
                "description": "Подарок на День отца в Эстонии в 2026: портрет по фото, предпросмотр и доставка по стране.",
                "keywords": ["день отца подарок Эстония", "2026"],
                "body": """<p>Закажите заранее и подтвердите предпросмотр до печати.</p><h2>CTA</h2><p><a href='https://www.popart.ee'>PopArt.ee</a></p>""",
            },
        },
        {
            "slug": "sonbrapaeva-kingitus-paarile",
            "publishedAt": "2026-01-22",
            "et": {
                "title": "Sõbrapäeva kingitus paarile 2026: soojus ilma surveeta",
                "description": "Sõbrapäeva kingitus paarile 2026: portree fotost, eelvaade, tarne üle Eesti ja varajane tellimus enne veebruari tippi.",
                "keywords": [
                    "sõbrapäeva kingitus paarile",
                    "sõbrapäeva kingitus 2026",
                    "kingitus paarile",
                    "Tallinn",
                ],
                "body": build_et_article(
                    "sonbrapaeva-kingitus-paarile",
                    "sõbrapäeva kingitus paarile",
                    "Sõbrapäeva kingitus paarile",
                    "Sõbrapäeva kingitus paarile peaks olema romantiline, aga mitte sunnitud. Portree ühisest fotost annab kingile loo: see on kohe “meie”, mitte üldine ese. "
                    "Kui te tellite Eestis ja vajate tarne üle Eesti, planeerige veebruari tipp ette — muidu võib kuller ja järjekord teie emotsiooniga võistelda.",
                ),
            },
            "en": {
                "title": "Valentine couple gift 2026 in Estonia",
                "description": "A Valentine's couple gift in Estonia for 2026: portrait from a photo, preview before printing, and delivery across Estonia.",
                "keywords": ["Valentine gift couple Estonia", "2026", "Tallinn"],
                "body": """<p>Plan early for February peak demand.</p><h2>CTA</h2><p><a href='https://www.popart.ee'>PopArt.ee</a></p>""",
            },
            "ru": {
                "title": "Подарок паре на 14 февраля 2026 в Эстонии",
                "description": "Подарок паре к 14 февраля в Эстонии в 2026: портрет по фото, предпросмотр и доставка по стране.",
                "keywords": ["подарок паре 14 февраля Эстония", "2026"],
                "body": """<p>Пик спроса в феврале — заказывайте заранее.</p><h2>CTA</h2><p><a href='https://www.popart.ee'>PopArt.ee</a></p>""",
            },
        },
    ]

    seasonal = SEASONAL_SLUGS

    for art in articles:
        slug = art["slug"]
        for loc, author in ("et", AUTHOR_ET), ("en", AUTHOR_EN), ("ru", AUTHOR_RU):
            loc_payload = art[loc]
            faqs = [{"question": q, "answer": a} for q, a in faqs_et(slug)] if loc == "et" else [
                {"question": "How long does it take?", "answer": "Depends on queue and preview approval; plan ahead."},
                {"question": "Preview before print?", "answer": "Yes—recommended."},
                {"question": "Delivery across Estonia?", "answer": "Yes; timing depends on region."},
                {"question": "Best photo?", "answer": "Sharp, natural, evenly lit."},
                {"question": "How to pick a size?", "answer": "Measure the wall or choose a versatile mid size."},
            ]
            if loc != "et":
                faqs.append({"question": "Seasonal deadlines?", "answer": "State your deadline in the order notes."})

            others = [s for s in seasonal if s != slug][:3]
            related = others + ["personaalne-kingitus"]
            internal = []
            for s in others:
                lab = {
                    "joulukingitus-2026": {"et": "Jõulukingitus 2026", "en": "Christmas 2026 guide", "ru": "Рождество 2026"},
                    "joulukingitus-naisele": {"et": "Jõulukingitus naisele", "en": "Gift for her", "ru": "Подарок женщине"},
                    "joulukingitus-mehele": {"et": "Jõulukingitus mehele", "en": "Gift for him", "ru": "Подарок мужчине"},
                    "emadepaeva-kingitus": {"et": "Emadepäeva kingitus", "en": "Mother's Day gift", "ru": "День матери"},
                    "isadepaeva-kingitus": {"et": "Isadepäeva kingitus", "en": "Father's Day gift", "ru": "День отца"},
                    "sonbrapaeva-kingitus-paarile": {"et": "Sõbrapäeva kingitus paarile", "en": "Couple Valentine gift", "ru": "Подарок паре"},
                }[s][loc]
                internal.append({"href": href(loc, s), "label": lab})
            internal.append({"href": href(loc, "kunstiline-portree"), "label": {"et": "Kunstiline portree juhend", "en": "Artistic portrait guide", "ru": "Художественный портрет"}[loc]})
            internal.append({"href": "https://www.popart.ee", "label": {"et": "PopArt.ee tellimus", "en": "Order on PopArt.ee", "ru": "Заказ на PopArt.ee"}[loc]})

            payload = {
                "slug": slug,
                "category": "gifts",
                "title": loc_payload["title"],
                "description": loc_payload["description"],
                "publishedAt": art["publishedAt"],
                "author": author,
                "coverImage": "/og-image.jpg",
                "keywords": loc_payload["keywords"],
                "bodyHtml": loc_payload["body"],
                "faqs": faqs if loc == "et" else faqs[:7],
                "relatedSlugs": related[:5],
                "internalLinks": internal,
            }
            write(loc, payload)

    print("done")


if __name__ == "__main__":
    main()
