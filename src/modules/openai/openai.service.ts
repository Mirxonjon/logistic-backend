import { CONFIG_OPENAI_TOKEN, OpenAIConfig } from '@/common/config/app.config';
import { routeData } from '@/common/helpers/route-data';
import { MessageAnalyseDto } from '@/types/openai';
import { Injectable, Inject } from '@nestjs/common';
import OpenAI from 'openai';
// import { CONFIG_OPENAI_TOKEN, OpenAIConfig } from 'src/config/openai.config';
@Injectable()
export class OpenaiService {
  private client: OpenAI;
  private model: string;
  constructor(
    @Inject(CONFIG_OPENAI_TOKEN)
    private readonly openaiConfig: OpenAIConfig
  ) {
    this.client = new OpenAI({
      apiKey: this.openaiConfig.apiKey,
    });

    this.model = this.openaiConfig.model;
  }

  async askGPT(prompt: string): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
    });

    return completion.choices[0].message.content;
  }

  async messageAnalyse(message: MessageAnalyseDto): Promise<{
    classifieredMessage: any;
    route: any;
    metaData: any;
  }> {
    const classifieredMessage = await this.classifier(message.message);
    console.log(classifieredMessage);
    if (classifieredMessage.isLoad) {
      const route = await this.extractRoute(classifieredMessage.cleanText);
      const metaData = await this.extractMetaData(
        classifieredMessage.cleanText
      );
      console.log(route, metaData, 'route, metaData');

      return { classifieredMessage, route, metaData };
    } else {
      return { classifieredMessage, route: null, metaData: null };
    }
  }

  // ISCLOSE FUNCTION
  async normalizeLoc(s) {
    return (s ?? '')
      .toLowerCase()
      .trim()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '') // diacritics
      .replace(/[`ʻ’‘]/g, "'") // har xil apostroflarni bitta qil
      .replace(/o['’ʻ]g/g, 'og') // o‘g -> og (xohlasang)
      .replace(/g['’ʻ]/g, 'g') // g‘ -> g
      .replace(/o['’ʻ]/g, 'o') // o‘ -> o
      .replace(/[^a-zа-яё\s-]/g, '') // faqat harf
      .replace(/\s+/g, ' ')
      .trim();
  }

  async levenshtein(a, b) {
    if (a === b) return 0;
    const m = a.length,
      n = b.length;
    if (!m) return n;
    if (!n) return m;

    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
    return dp[m][n];
  }

  async isClose(a, b) {
    a = await this.normalizeLoc(a);
    b = await this.normalizeLoc(b);
    if (!a || !b) return false;
    if (a === b) return true;
    // 1 harf farq (kukon~kokon), uzunroq bo‘lsa 2 gacha
    const maxDist = a.length <= 6 && b.length <= 6 ? 1 : 2;
    return (await this.levenshtein(a, b)) <= maxDist;
  }

  // CLASSIFIER
  async classifier(text) {
    if (!text) return { isLoad: false, type: 'unknown', confidence: 0 };
    const ALLOWED_SYMBOLS = ['+', '-', '.', ',', '$', '%', ':', '/'];

    function removeEmojis(text) {
      const escaped = ALLOWED_SYMBOLS.map((s) =>
        s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
      ) // regex escape
        .join('');

      const regex = new RegExp(`[^\\p{L}\\p{N}\\s${escaped}]`, 'gu');

      return text
        .normalize('NFKC')
        .replace(/\p{Extended_Pictographic}/gu, '')
        .replace(/\uFE0F/g, '')
        .replace(regex, '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    const cleanText = removeEmojis(text).toLowerCase();

    // 1. Yuk tashishga xos kalit so'zlar (Lotin va Kirill uyg'unligi)
    const loadKeywords = [
      'yuk',
      'юк',
      'moshina',
      'мошина',
      'mashina',
      'машина',
      'fura',
      'фура',
      'isuzu',
      'исузу',
      'kamaz',
      'камаз',
      'gazel',
      'газел',
      'reys',
      'рейс',
      'tonna',
      'тонна',
      ' tn',
      ' тн',
      ' kg',
      ' кг',
      'kub',
      'куб',
      "so'm",
      'som',
      'сум',
      'сўм',
      'dostavka',
      'доставка',
      'pochta',
      'почта',
      'bor',
      'бор',
      'ketti',
      'кетди',
      'shofyor',
      'шофёр',
      'исузи',
      'лабо',

      'ref',

      'yuk',
      'moshina',
      'mashina',
      'kamaz',
      'fura',
      'isuzu',
      'labo',
      'gazel',
      'reys',
      'tonna',
      'tn',
      'kg',
      'kilo',
      'kub',
      "so'm",
      'som',
      'dostavka',
      'pochta',
      "bo'sh",
      'bosh',
      'bor',
      'ketti',
      'ketdi',
      'shofyor',
      'haydovchi',

      'груз',
      'т',
      'авто',
      'вес',
      'груз',
    ];

    // 2. Yuk bo'lmagan so'zlar (qattiq blok)
    const strictZeroWords = [
      'salom',
      'салом',
      'reklama',
      'реклама',
      'aksiya',
      'акция',
      'tabrik',
      'поздравляю',
      'sotiladi',
      'продается',
      'ish bor',
      'работа',
      'vakansiya',
      'вакансия',
      'obuna',
      'обуна',
    ];

    // STRICT ZERO CHECK
    for (const word of strictZeroWords) {
      if (cleanText.includes(word)) {
        return {
          isLoad: false,
          type: 'REGULAR_MESSAGE',
          confidence: 0,
          cleanText: cleanText,
          originalText: text.substring(0, 50) + '...',
        };
      }
    }

    // 2. Yo'nalish ko'rsatuvchi qo'shimchalar (Lotin va Kirill)
    // -dan, -ga, -дан, -га, shuningdek strelka belgisi →
    const directionPattern = /([a-z'а-я]+(dan|ga|дан|га|qa|ка)|[→\-<>\|])/i;

    // 3. Telefon raqami (Yuk xabarlarida deyarli har doim bo'ladi)
    const phonePattern =
      /(\+?998|97|99|90|91|93|94|95|88|33|77)\s?\d{2,3}\s?\d{2,3}\s?\d{2}\s?\d{2}/;

    // 4. Metrik pattern (Og'irlik yoki narx: 10т, 500$, 7млн)
    const metricPattern =
      /(\d+\s*(tn|t|тн|т|тонна|кг|kg|сум|сўм|som|usd|\$|млн))/i;

    let score = 0;

    // Kalit so'zlarni tekshirish
    loadKeywords.forEach((word) => {
      if (cleanText.includes(word)) score += 1.5;
    });

    // Yo'nalish belgilari uchun ball
    if (directionPattern.test(cleanText)) score += 2;

    // Telefon raqami mavjudligi - juda kuchli indikator
    if (phonePattern.test(cleanText)) score += 3;

    // Metrik o'lchovlar
    if (metricPattern.test(cleanText)) score += 2;

    // Maxsus: Agar xabarda → belgisi bo'lsa (Siz yuborgan msg1 kabi)
    if (cleanText.includes('→') || cleanText.includes('—')) score += 2;

    const threshold = 5; // Chegara

    return {
      isLoad: score >= threshold,
      type: score >= threshold ? 'LOAD_POST' : 'REGULAR_MESSAGE',
      confidence: score,
      cleanText: cleanText,
      originalText: text.substring(0, 50) + '...', // Matndan namuna
    };
  }

  // EXTRACT ROUTE FUNCTION
  async extractRoute(text) {
    const systemPrompt = `
Siz logistika matnidan yo'nalish ajratuvchi parser-siz.

Vazifa: matndan faqat 2 ta joyni aniqlang:
- "from": yuk qayerdan (jo'nash)
- "to": yuk qayerga (manzil)

QATTIQ QOIDALAR:
1) Javob faqat JSON bo'lsin. Hech qanday izoh, matn, markdown yo'q.
2) JSON faqat shu 2 ta kalitdan iborat bo'lsin: "from" va "to".
   - Boshqa hech qanday key chiqmasin (masalan fromCountry, regionFrom va h.k. chiqsa bu xato).
3) "from" va "to" qiymati:
   - faqat joy nomining o'zagi (shahar/viloyat/oblast) bo'lsin. Iloji bo'lsa viloyatni qaytar.
   - qo'shimchalar bo'lmasin ("-dan", "-ga", "г.", "обл.", "республика" va h.k. olib tashla).
   - from va to hechqachon bir xil bo'lmaydi.
4) Ikkalasini ham inglizcha translit bilan qaytarishga harakat qil:
   - Toshkent -> "tashkent"
   - Samarqand -> "samarkand"
   - Свердловская область -> "sverdlovsk"
5) Agar joy topilmasa: null qaytar.
6) Agar matnda faqat shahar bo'lsa ham, shaharni qaytar (viloyat shart emas).
7) Agar bir nechta joy uchrasa:
   - birinchi yo'nalish joyi = from
   - oxirgi yo'nalish joyi = to

Javob formati (Aynan shunday):
{"from":"string or null","to":"string or null"}
`;
    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o-mini', // Tezroq va arzonroq model ham yetarli
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
        response_format: { type: 'json_object' },
        temperature: 0,
      });

      const rawResult = JSON.parse(completion.choices[0].message.content);

      // GPT topgan nomlarni o'zimizning routeData bilan tekshiramiz
      const source = await this.findInDatabase(rawResult.from);
      const destination = await this.findInDatabase(rawResult.to);

      return {
        fromCountry: source.country,
        fromRegion: source.region,
        toCountry: destination.country,
        toRegion: destination.region,
      };
    } catch (error) {
      console.error('Xatolik:', error);
      return {
        fromCountry: null,
        fromRegion: null,
        toCountry: null,
        toRegion: null,
      };
    }
  }

  async findInDatabase(locationName) {
    if (!locationName) return { country: null, region: null };

    const searchName = await this.normalizeLoc(locationName);

    // ✅ 1-PASS: faqat EXACT (regions)
    for (const country of routeData) {
      for (const region of country.regions) {
        const allAliases = [
          ...(region.alias || []),
          ...(region.alias_cyr || []),
        ];

        if (allAliases.some((a) => this.normalizeLoc(a) === searchName)) {
          return { country: country.indexedName, region: region.indexedName };
        }
      }
    }

    // ✅ 1-PASS: faqat EXACT (countries)
    for (const country of routeData) {
      const countryAliases = [
        ...(country.alias || []),
        ...(country.alias_cyr || []),
      ];

      if (countryAliases.some((a) => this.normalizeLoc(a) === searchName)) {
        return { country: country.indexedName, region: null };
      }
    }

    // ✅ 2-PASS: endi Fuzzy (regions) — faqat exact topilmagandan keyin
    for (const country of routeData) {
      for (const region of country.regions) {
        const allAliases = [
          ...(region.alias || []),
          ...(region.alias_cyr || []),
        ];

        if (allAliases.some((a) => this.isClose(a, searchName))) {
          return { country: country.indexedName, region: region.indexedName };
        }
      }
    }

    // ✅ 2-PASS: endi Fuzzy (countries)
    for (const country of routeData) {
      const countryAliases = [
        ...(country.alias || []),
        ...(country.alias_cyr || []),
      ];

      if (countryAliases.some((a) => this.isClose(a, searchName))) {
        return { country: country.indexedName, region: null };
      }
    }

    return { country: null, region: null };
  }

  async extractMetaData(text) {
    const SYSTEM_PROMPT = `
You are a strict information extraction engine for logistics load posts (Uzbek/Russian mixed).
Return ONLY valid JSON. No markdown, no comments.

CRITICAL RULES:
- "title" MUST be the cargo name only.
- NEVER use cities, directions, routes, arrows (➞), customs info, or locations as title.
- If cargo is written in parentheses — that is the title.
- If cargo is written after "Груз:", "Yuk:", "Cargo:" — that is the title.
- If you see "avans" or "аванс" set "advancePayment" to the amount.
- If paymentCurrency is null and paymentAmount is less than 10000 set "paymentCurrency" usd.
- Paymentamount should be more than 100
- If vehicleType is "fura", set "tent". If vehicleType is "paravoz", "паровоз" set "locomative_truck". If vehicleType is "gazel", "газель" set "isuzu"
- If you see words like "tayyor", "tayor", "готово", "срочно", so pickupdate is today. Also, pickupdate maybe like DD.MM.YYYY or DD.MM 
- If length of phone number is 9 add +998. Phonenumber length will be more than 9


Extract fields:
title: string | null (cargo name ONLY, e.g. "Болт и гайки", "Текстиль", "Taxta", "Napitka", "Meva")
weight: number | null (number only, e.g. "22")
cargoUnit: "tons" | "pallet" | null
vehicleType: tent | ref | isuzu | locomative_truck | string | null
paymentType: "cash" | "online" | "combo" | null
paymentAmount: string (number only) | null
advancePayment: string (number only) | null
paymentCurrency: "usd" | "sum" | null
pickupDate: today | string | null
phone_number: string

IMPORTANT:
- Do NOT include route, cities, or customs in ANY field.
- Unknown strings -> ""
- Unknown enums -> null
`;

    const prompt = await this.buildUserPrompt(text);
    const response = await this.client.chat.completions.create({
      model: 'gpt-4.1-mini',
      temperature: 0,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    });

    const json = response.choices[0]?.message?.content || '{}';
    return JSON.parse(json);
  }

  async buildUserPrompt(text) {
    return `
Extract metadata from this load post:

"""${text}"""
`;
  }
}
