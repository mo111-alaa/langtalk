import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type LanguageCode =
  | "Arabic"
  | "English"
  | "Spanish"
  | "German"
  | "French"
  | "Japanese"
  | "Korean"
  | "Russian"
  | "Turkish";

const translations: Record<
  LanguageCode,
  {
    navHome: string;
    navFeatures: string;
    navHow: string;
    navFaq: string;
    login: string;
    getStarted: string;

    badge: string;
    heroTitle: string;
    heroDescription: string;
    startSpeaking: string;
    learnMore: string;

    featuresTitle: string;
    featuresDescription: string;

    videoTitle: string;
    videoDescription: string;

    matchingTitle: string;
    matchingDescription: string;

    sevenTitle: string;
    sevenDescription: string;

    languagesTitle: string;
    languagesDescription: string;

    levelsTitle: string;
    levelsDescription: string;

    howTitle: string;
    howDescription: string;

    step1Title: string;
    step1Description: string;

    step2Title: string;
    step2Description: string;

    step3Title: string;
    step3Description: string;

    step4Title: string;
    step4Description: string;

    faqTitle: string;
    faq1Question: string;
    faq1Answer: string;
    faq2Question: string;
    faq2Answer: string;
    faq3Question: string;
    faq3Answer: string;
    faq4Question: string;
    faq4Answer: string;

    ctaTitle: string;
    ctaDescription: string;

    complaintsTitle: string;
    complaintsDescription: string;
    complaintsEmail: string;

    footerDescription: string;
    footerRights: string;
  }
> = {
  Arabic: {
    navHome: "الرئيسية",
    navFeatures: "المميزات",
    navHow: "كيف يعمل؟",
    navFaq: "الأسئلة الشائعة",
    login: "تسجيل الدخول",
    getStarted: "ابدأ الآن",

    badge: "تحدث بحرية • 7 دقائق • شخص حقيقي",
    heroTitle: "تحدث باللغة التي تتعلمها بثقة.",
    heroDescription:
      "LWA يوصلك تلقائيًا بمتعلم آخر للغة نفسها والمستوى نفسه في مكالمة فيديو مباشرة لمدة 7 دقائق.",
    startSpeaking: "ابدأ التحدث الآن",
    learnMore: "اكتشف المميزات",

    featuresTitle: "كل ما تحتاجه لممارسة اللغة",
    featuresDescription:
      "صممنا LWA لتتوقف عن دراسة اللغة فقط وتبدأ باستخدامها فعليًا.",

    videoTitle: "مكالمات فيديو مباشرة",
    videoDescription:
      "تحدث وجهًا لوجه بالصوت والصورة مع متعلم آخر في الوقت الحقيقي.",

    matchingTitle: "مطابقة تلقائية",
    matchingDescription:
      "لا تحتاج إلى البحث عن شريك. LWA يبحث تلقائيًا عن شخص مناسب لك.",

    sevenTitle: "جلسة مدتها 7 دقائق",
    sevenDescription:
      "مدة قصيرة ومركزة تساعدك على التحدث بحرية دون ضغط أو ملل.",

    languagesTitle: "9 لغات مدعومة",
    languagesDescription:
      "العربية، الإنجليزية، الإسبانية، الألمانية، الفرنسية، اليابانية، الكورية، الروسية والتركية.",

    levelsTitle: "نفس المستوى",
    levelsDescription:
      "نطابقك مع شخص يتعلم اللغة نفسها وفي المستوى نفسه للحصول على محادثة أفضل.",

    howTitle: "كيف يعمل LWA؟",
    howDescription:
      "ابدأ محادثتك في خطوات بسيطة.",

    step1Title: "اختر لغتك",
    step1Description:
      "حدد لغتك الأم واللغة التي تريد ممارستها ومستواك.",

    step2Title: "ابدأ البحث",
    step2Description:
      "اضغط على Start Practice وسيبدأ LWA في البحث تلقائيًا.",

    step3Title: "اعثر على شريك",
    step3Description:
      "سيتم اختيار شريك عشوائي مناسب لك حسب اللغة والمستوى.",

    step4Title: "تحدث لمدة 7 دقائق",
    step4Description:
      "تدخلان نفس غرفة الفيديو وتبدأ المحادثة مباشرة.",

    faqTitle: "الأسئلة الشائعة",

    faq1Question: "هل أحتاج إلى اختيار شريك بنفسي؟",
    faq1Answer:
      "لا. LWA يختار شريكًا مناسبًا لك تلقائيًا وبشكل عشوائي من المستخدمين المتاحين.",

    faq2Question: "كم تستمر المكالمة؟",
    faq2Answer:
      "كل جلسة تستمر لمدة 7 دقائق ويستخدم الطرفان نفس المؤقت.",

    faq3Question: "هل المكالمة بالصوت فقط؟",
    faq3Answer:
      "لا. LWA يعتمد على مكالمات الفيديو والصوت، مع إمكانية كتم الميكروفون.",

    faq4Question: "ما اللغات المتاحة؟",
    faq4Answer:
      "العربية والإنجليزية والإسبانية والألمانية والفرنسية واليابانية والكورية والروسية والتركية.",

    ctaTitle: "مستعد للتحدث؟",
    ctaDescription:
      "لا تنتظر أن تصبح مثاليًا. ابدأ باستخدام اللغة الآن.",

    complaintsTitle: "الشكاوى والتواصل",
    complaintsDescription:
      "إذا واجهت مشكلة أو لديك اقتراح لتحسين LWA، يمكنك التواصل معنا عبر البريد الإلكتروني.",
    complaintsEmail: "LWAlanguage@gmail.com",

    footerDescription:
      "LWA — تحدث بحرية مع متعلمين من جميع أنحاء العالم.",
    footerRights: "جميع الحقوق محفوظة.",
  },

  English: {
    navHome: "Home",
    navFeatures: "Features",
    navHow: "How it works",
    navFaq: "FAQ",
    login: "Log in",
    getStarted: "Get started",

    badge: "Speak freely • 7 minutes • Real people",
    heroTitle: "Speak the language you're learning with confidence.",
    heroDescription:
      "LWA automatically connects you with another learner of the same language and level for a live 7-minute video conversation.",
    startSpeaking: "Start speaking",
    learnMore: "Explore features",

    featuresTitle: "Everything you need to practice",
    featuresDescription:
      "LWA is designed to help you stop only studying a language and start actually using it.",

    videoTitle: "Live video calls",
    videoDescription:
      "Talk face-to-face with another learner using real-time video and audio.",

    matchingTitle: "Automatic matching",
    matchingDescription:
      "You don't need to search for a partner. LWA finds a suitable person automatically.",

    sevenTitle: "7-minute sessions",
    sevenDescription:
      "A short, focused session that helps you speak freely without pressure.",

    languagesTitle: "9 supported languages",
    languagesDescription:
      "Arabic, English, Spanish, German, French, Japanese, Korean, Russian and Turkish.",

    levelsTitle: "Same level",
    levelsDescription:
      "We match you with someone learning the same language at the same level.",

    howTitle: "How does LWA work?",
    howDescription:
      "Start your conversation in just a few simple steps.",

    step1Title: "Set your language",
    step1Description:
      "Choose your native language, target language and level.",

    step2Title: "Start searching",
    step2Description:
      "Press Start Practice and LWA will automatically start looking for a partner.",

    step3Title: "Meet a partner",
    step3Description:
      "A suitable available learner is selected randomly based on language and level.",

    step4Title: "Talk for 7 minutes",
    step4Description:
      "Both users enter the same video room and start talking.",

    faqTitle: "Frequently asked questions",

    faq1Question: "Do I choose my partner?",
    faq1Answer:
      "No. LWA automatically and randomly chooses a suitable available partner for you.",

    faq2Question: "How long is a call?",
    faq2Answer:
      "Every session lasts 7 minutes and both participants share the same timer.",

    faq3Question: "Are calls audio only?",
    faq3Answer:
      "No. LWA uses video and audio calls, with the option to mute your microphone.",

    faq4Question: "Which languages are supported?",
    faq4Answer:
      "Arabic, English, Spanish, German, French, Japanese, Korean, Russian and Turkish.",

    ctaTitle: "Ready to start speaking?",
    ctaDescription:
      "Don't wait until you're perfect. Start using the language now.",

    complaintsTitle: "Complaints & Contact",
    complaintsDescription:
      "If you experience a problem or have a suggestion for improving LWA, contact us by email.",
    complaintsEmail: "LWAlanguage@gmail.com",

    footerDescription:
      "LWA — Speak freely with language learners around the world.",
    footerRights: "All rights reserved.",
  },

  Spanish: {
    navHome: "Inicio",
    navFeatures: "Funciones",
    navHow: "Cómo funciona",
    navFaq: "Preguntas",
    login: "Iniciar sesión",
    getStarted: "Comenzar",

    badge: "Habla libremente • 7 minutos • Personas reales",
    heroTitle: "Habla el idioma que estás aprendiendo con confianza.",
    heroDescription:
      "LWA te conecta automáticamente con otro estudiante del mismo idioma y nivel durante una conversación de vídeo de 7 minutos.",
    startSpeaking: "Empezar a hablar",
    learnMore: "Ver funciones",

    featuresTitle: "Todo lo que necesitas para practicar",
    featuresDescription:
      "LWA está diseñado para ayudarte a dejar de estudiar solamente y empezar a usar el idioma.",

    videoTitle: "Videollamadas en directo",
    videoDescription:
      "Habla cara a cara con otro estudiante mediante vídeo y audio en tiempo real.",

    matchingTitle: "Emparejamiento automático",
    matchingDescription:
      "No necesitas buscar un compañero. LWA encuentra uno automáticamente.",

    sevenTitle: "Sesiones de 7 minutos",
    sevenDescription:
      "Una sesión corta y enfocada para ayudarte a hablar libremente.",

    languagesTitle: "9 idiomas disponibles",
    languagesDescription:
      "Árabe, inglés, español, alemán, francés, japonés, coreano, ruso y turco.",

    levelsTitle: "Mismo nivel",
    levelsDescription:
      "Te conectamos con alguien que aprende el mismo idioma y tiene el mismo nivel.",

    howTitle: "¿Cómo funciona LWA?",
    howDescription:
      "Comienza tu conversación en unos simples pasos.",

    step1Title: "Configura tu idioma",
    step1Description:
      "Elige tu idioma nativo, idioma objetivo y nivel.",

    step2Title: "Comienza la búsqueda",
    step2Description:
      "Pulsa Start Practice y LWA buscará automáticamente.",

    step3Title: "Encuentra un compañero",
    step3Description:
      "Se selecciona aleatoriamente un estudiante adecuado.",

    step4Title: "Habla durante 7 minutos",
    step4Description:
      "Ambos entran en la misma sala de vídeo y comienzan a hablar.",

    faqTitle: "Preguntas frecuentes",

    faq1Question: "¿Tengo que elegir a mi compañero?",
    faq1Answer:
      "No. LWA elige automáticamente un compañero disponible adecuado.",

    faq2Question: "¿Cuánto dura la llamada?",
    faq2Answer:
      "Cada sesión dura 7 minutos y ambos participantes tienen el mismo temporizador.",

    faq3Question: "¿Las llamadas son solo de audio?",
    faq3Answer:
      "No. LWA utiliza vídeo y audio, con opción para silenciar el micrófono.",

    faq4Question: "¿Qué idiomas están disponibles?",
    faq4Answer:
      "Árabe, inglés, español, alemán, francés, japonés, coreano, ruso y turco.",

    ctaTitle: "¿Listo para hablar?",
    ctaDescription:
      "No esperes a ser perfecto. Empieza a usar el idioma ahora.",

    complaintsTitle: "Quejas y contacto",
    complaintsDescription:
      "Si tienes un problema o una sugerencia, puedes contactarnos por correo electrónico.",
    complaintsEmail: "LWAlanguage@gmail.com",

    footerDescription:
      "LWA — Habla libremente con estudiantes de idiomas de todo el mundo.",
    footerRights: "Todos los derechos reservados.",
  },

  German: {
    navHome: "Startseite",
    navFeatures: "Funktionen",
    navHow: "So funktioniert es",
    navFaq: "FAQ",
    login: "Anmelden",
    getStarted: "Loslegen",

    badge: "Frei sprechen • 7 Minuten • Echte Menschen",
    heroTitle: "Sprich die Sprache, die du lernst, mit mehr Selbstvertrauen.",
    heroDescription:
      "LWA verbindet dich automatisch mit einem anderen Lernenden derselben Sprache und desselben Niveaus für ein 7-minütiges Videogespräch.",
    startSpeaking: "Jetzt sprechen",
    learnMore: "Funktionen entdecken",

    featuresTitle: "Alles, was du zum Üben brauchst",
    featuresDescription:
      "LWA hilft dir, die Sprache nicht nur zu lernen, sondern sie wirklich zu benutzen.",

    videoTitle: "Live-Videoanrufe",
    videoDescription:
      "Sprich per Video und Audio in Echtzeit von Angesicht zu Angesicht.",

    matchingTitle: "Automatische Suche",
    matchingDescription:
      "Du musst keinen Partner suchen. LWA findet automatisch einen passenden Lernenden.",

    sevenTitle: "7-Minuten-Sitzungen",
    sevenDescription:
      "Eine kurze und konzentrierte Sitzung zum freien Sprechen.",

    languagesTitle: "9 unterstützte Sprachen",
    languagesDescription:
      "Arabisch, Englisch, Spanisch, Deutsch, Französisch, Japanisch, Koreanisch, Russisch und Türkisch.",

    levelsTitle: "Gleiches Niveau",
    levelsDescription:
      "Du wirst mit jemandem verbunden, der dieselbe Sprache auf demselben Niveau lernt.",

    howTitle: "Wie funktioniert LWA?",
    howDescription:
      "Starte dein Gespräch in wenigen einfachen Schritten.",

    step1Title: "Sprache festlegen",
    step1Description:
      "Wähle deine Muttersprache, Zielsprache und dein Niveau.",

    step2Title: "Suche starten",
    step2Description:
      "Drücke auf Start Practice und LWA beginnt automatisch mit der Suche.",

    step3Title: "Partner finden",
    step3Description:
      "Ein passender verfügbarer Lernender wird zufällig ausgewählt.",

    step4Title: "7 Minuten sprechen",
    step4Description:
      "Beide Teilnehmer betreten denselben Video-Raum.",

    faqTitle: "Häufig gestellte Fragen",

    faq1Question: "Wähle ich meinen Partner selbst?",
    faq1Answer:
      "Nein. LWA wählt automatisch und zufällig einen passenden verfügbaren Partner.",

    faq2Question: "Wie lange dauert ein Anruf?",
    faq2Answer:
      "Jede Sitzung dauert 7 Minuten und beide Teilnehmer haben denselben Timer.",

    faq3Question: "Sind die Anrufe nur Audio?",
    faq3Answer:
      "Nein. LWA verwendet Video und Audio. Das Mikrofon kann stummgeschaltet werden.",

    faq4Question: "Welche Sprachen werden unterstützt?",
    faq4Answer:
      "Arabisch, Englisch, Spanisch, Deutsch, Französisch, Japanisch, Koreanisch, Russisch und Türkisch.",

    ctaTitle: "Bereit zum Sprechen?",
    ctaDescription:
      "Warte nicht, bis du perfekt bist. Fang jetzt an.",

    complaintsTitle: "Beschwerden & Kontakt",
    complaintsDescription:
      "Bei Problemen oder Verbesserungsvorschlägen kannst du uns per E-Mail kontaktieren.",
    complaintsEmail: "LWAlanguage@gmail.com",

    footerDescription:
      "LWA — Sprich frei mit Sprachlernenden aus der ganzen Welt.",
    footerRights: "Alle Rechte vorbehalten.",
  },

  French: {
    navHome: "Accueil",
    navFeatures: "Fonctionnalités",
    navHow: "Comment ça marche",
    navFaq: "FAQ",
    login: "Connexion",
    getStarted: "Commencer",

    badge: "Parlez librement • 7 minutes • De vraies personnes",
    heroTitle: "Parlez la langue que vous apprenez avec confiance.",
    heroDescription:
      "LWA vous connecte automatiquement avec un autre apprenant du même niveau pour une conversation vidéo de 7 minutes.",
    startSpeaking: "Commencer à parler",
    learnMore: "Découvrir les fonctionnalités",

    featuresTitle: "Tout ce dont vous avez besoin pour pratiquer",
    featuresDescription:
      "LWA vous aide à arrêter d'étudier seulement et à commencer à utiliser la langue.",

    videoTitle: "Appels vidéo en direct",
    videoDescription:
      "Parlez face à face avec un autre apprenant grâce à la vidéo et à l'audio.",

    matchingTitle: "Mise en relation automatique",
    matchingDescription:
      "Pas besoin de chercher un partenaire. LWA en trouve un automatiquement.",

    sevenTitle: "Sessions de 7 minutes",
    sevenDescription:
      "Une session courte et concentrée pour parler librement.",

    languagesTitle: "9 langues disponibles",
    languagesDescription:
      "Arabe, anglais, espagnol, allemand, français, japonais, coréen, russe et turc.",

    levelsTitle: "Même niveau",
    levelsDescription:
      "Vous êtes mis en relation avec une personne qui apprend la même langue au même niveau.",

    howTitle: "Comment fonctionne LWA ?",
    howDescription:
      "Commencez votre conversation en quelques étapes simples.",

    step1Title: "Configurez votre langue",
    step1Description:
      "Choisissez votre langue maternelle, votre langue cible et votre niveau.",

    step2Title: "Lancez la recherche",
    step2Description:
      "Appuyez sur Start Practice et LWA commencera automatiquement la recherche.",

    step3Title: "Trouvez un partenaire",
    step3Description:
      "Un apprenant disponible et adapté est choisi aléatoirement.",

    step4Title: "Parlez pendant 7 minutes",
    step4Description:
      "Les deux participants rejoignent la même salle vidéo.",

    faqTitle: "Questions fréquentes",

    faq1Question: "Dois-je choisir mon partenaire ?",
    faq1Answer:
      "Non. LWA choisit automatiquement et aléatoirement un partenaire adapté.",

    faq2Question: "Combien de temps dure l'appel ?",
    faq2Answer:
      "Chaque session dure 7 minutes avec le même minuteur pour les deux participants.",

    faq3Question: "Les appels sont-ils uniquement audio ?",
    faq3Answer:
      "Non. LWA utilise la vidéo et l'audio, avec la possibilité de couper le microphone.",

    faq4Question: "Quelles langues sont disponibles ?",
    faq4Answer:
      "Arabe, anglais, espagnol, allemand, français, japonais, coréen, russe et turc.",

    ctaTitle: "Prêt à parler ?",
    ctaDescription:
      "N'attendez pas d'être parfait. Commencez maintenant.",

    complaintsTitle: "Réclamations & Contact",
    complaintsDescription:
      "Pour signaler un problème ou proposer une amélioration, contactez-nous par e-mail.",
    complaintsEmail: "LWAlanguage@gmail.com",

    footerDescription:
      "LWA — Parlez librement avec des apprenants du monde entier.",
    footerRights: "Tous droits réservés.",
  },

  Japanese: {
    navHome: "ホーム",
    navFeatures: "機能",
    navHow: "使い方",
    navFaq: "よくある質問",
    login: "ログイン",
    getStarted: "始める",

    badge: "自由に話そう • 7分 • 本物の人と",
    heroTitle: "学んでいる言語を、自信を持って話そう。",
    heroDescription:
      "LWAは、同じ言語とレベルを学んでいるユーザーと自動的につなぎ、7分間のビデオ会話を行います。",
    startSpeaking: "今すぐ話す",
    learnMore: "機能を見る",

    featuresTitle: "練習に必要なすべて",
    featuresDescription:
      "LWAは、言語を勉強するだけでなく、実際に使うために作られています。",

    videoTitle: "ライブビデオ通話",
    videoDescription:
      "ビデオと音声を使って、他の学習者とリアルタイムで話せます。",

    matchingTitle: "自動マッチング",
    matchingDescription:
      "相手を探す必要はありません。LWAが自動的に相手を見つけます。",

    sevenTitle: "7分間のセッション",
    sevenDescription:
      "短く集中した時間で、プレッシャーなく自由に話せます。",

    languagesTitle: "9つの対応言語",
    languagesDescription:
      "アラビア語、英語、スペイン語、ドイツ語、フランス語、日本語、韓国語、ロシア語、トルコ語。",

    levelsTitle: "同じレベル",
    levelsDescription:
      "同じ言語を同じレベルで学んでいる人とマッチします。",

    howTitle: "LWAの使い方",
    howDescription:
      "簡単なステップで会話を始められます。",

    step1Title: "言語を設定",
    step1Description:
      "母語、学習言語、レベルを選択します。",

    step2Title: "検索開始",
    step2Description:
      "Start Practiceを押すと自動的に相手を探します。",

    step3Title: "パートナーを見つける",
    step3Description:
      "条件に合う利用可能な学習者がランダムに選ばれます。",

    step4Title: "7分間話す",
    step4Description:
      "2人が同じビデオルームに入り、会話を始めます。",

    faqTitle: "よくある質問",

    faq1Question: "自分で相手を選べますか？",
    faq1Answer:
      "いいえ。LWAが条件に合う相手を自動的かつランダムに選びます。",

    faq2Question: "通話はどのくらいですか？",
    faq2Answer:
      "各セッションは7分間で、2人が同じタイマーを使用します。",

    faq3Question: "音声だけですか？",
    faq3Answer:
      "いいえ。ビデオと音声を使用します。マイクをミュートすることもできます。",

    faq4Question: "対応している言語は？",
    faq4Answer:
      "アラビア語、英語、スペイン語、ドイツ語、フランス語、日本語、韓国語、ロシア語、トルコ語です。",

    ctaTitle: "話す準備はできましたか？",
    ctaDescription:
      "完璧になるまで待たず、今すぐ話し始めましょう。",

    complaintsTitle: "お問い合わせ・苦情",
    complaintsDescription:
      "問題や改善の提案がある場合は、メールでお問い合わせください。",
    complaintsEmail: "LWAlanguage@gmail.com",

    footerDescription:
      "LWA — 世界中の語学学習者と自由に話そう。",
    footerRights: "All rights reserved.",
  },

  Korean: {
    navHome: "홈",
    navFeatures: "기능",
    navHow: "이용 방법",
    navFaq: "FAQ",
    login: "로그인",
    getStarted: "시작하기",

    badge: "자유롭게 말하기 • 7분 • 실제 사람과",
    heroTitle: "배우고 있는 언어를 자신 있게 말해보세요.",
    heroDescription:
      "LWA는 같은 언어와 레벨을 배우는 다른 학습자와 자동으로 연결하여 7분 동안 영상 대화를 할 수 있게 합니다.",
    startSpeaking: "지금 말하기",
    learnMore: "기능 알아보기",

    featuresTitle: "연습에 필요한 모든 것",
    featuresDescription:
      "LWA는 언어를 공부하는 것에서 실제로 사용하는 것으로 나아갈 수 있도록 만들어졌습니다.",

    videoTitle: "실시간 영상 통화",
    videoDescription:
      "영상과 음성을 통해 다른 학습자와 실시간으로 대화하세요.",

    matchingTitle: "자동 매칭",
    matchingDescription:
      "파트너를 직접 찾을 필요가 없습니다. LWA가 자동으로 찾아줍니다.",

    sevenTitle: "7분 세션",
    sevenDescription:
      "짧고 집중된 시간 동안 부담 없이 자유롭게 말할 수 있습니다.",

    languagesTitle: "9개 언어 지원",
    languagesDescription:
      "아랍어, 영어, 스페인어, 독일어, 프랑스어, 일본어, 한국어, 러시아어, 터키어.",

    levelsTitle: "같은 레벨",
    levelsDescription:
      "같은 언어를 같은 레벨로 배우는 사람과 연결됩니다.",

    howTitle: "LWA는 어떻게 작동하나요?",
    howDescription:
      "몇 가지 간단한 단계로 대화를 시작하세요.",

    step1Title: "언어 설정",
    step1Description:
      "모국어, 목표 언어와 레벨을 선택하세요.",

    step2Title: "검색 시작",
    step2Description:
      "Start Practice를 누르면 LWA가 자동으로 파트너를 찾습니다.",

    step3Title: "파트너 만나기",
    step3Description:
      "조건에 맞는 이용 가능한 학습자가 무작위로 선택됩니다.",

    step4Title: "7분 동안 대화",
    step4Description:
      "두 사용자가 같은 영상 방에 들어가 대화를 시작합니다.",

    faqTitle: "자주 묻는 질문",

    faq1Question: "파트너를 직접 선택하나요?",
    faq1Answer:
      "아니요. LWA가 조건에 맞는 파트너를 자동으로 무작위 선택합니다.",

    faq2Question: "통화는 얼마나 오래 하나요?",
    faq2Answer:
      "각 세션은 7분이며 두 참가자는 같은 타이머를 사용합니다.",

    faq3Question: "음성 통화만 가능한가요?",
    faq3Answer:
      "아니요. 영상과 음성 통화를 사용하며 마이크를 음소거할 수 있습니다.",

    faq4Question: "어떤 언어를 지원하나요?",
    faq4Answer:
      "아랍어, 영어, 스페인어, 독일어, 프랑스어, 일본어, 한국어, 러시아어, 터키어입니다.",

    ctaTitle: "말할 준비가 되었나요?",
    ctaDescription:
      "완벽해질 때까지 기다리지 마세요. 지금 시작하세요.",

    complaintsTitle: "문의 및 불만",
    complaintsDescription:
      "문제가 있거나 개선 사항을 제안하고 싶다면 이메일로 문의해주세요.",
    complaintsEmail: "LWAlanguage@gmail.com",

    footerDescription:
      "LWA — 전 세계의 언어 학습자와 자유롭게 이야기하세요.",
    footerRights: "All rights reserved.",
  },

  Russian: {
    navHome: "Главная",
    navFeatures: "Возможности",
    navHow: "Как это работает",
    navFaq: "FAQ",
    login: "Войти",
    getStarted: "Начать",

    badge: "Говорите свободно • 7 минут • Реальные люди",
    heroTitle: "Говорите на изучаемом языке уверенно.",
    heroDescription:
      "LWA автоматически соединяет вас с другим изучающим тот же язык на том же уровне для 7-минутного видеодиалога.",
    startSpeaking: "Начать говорить",
    learnMore: "Посмотреть возможности",

    featuresTitle: "Всё необходимое для практики",
    featuresDescription:
      "LWA помогает не только изучать язык, но и использовать его в реальном разговоре.",

    videoTitle: "Видеозвонки в реальном времени",
    videoDescription:
      "Общайтесь лицом к лицу с другим изучающим через видео и аудио.",

    matchingTitle: "Автоматический подбор",
    matchingDescription:
      "Не нужно искать партнёра. LWA автоматически найдёт подходящего человека.",

    sevenTitle: "Сессии по 7 минут",
    sevenDescription:
      "Короткая и сосредоточенная сессия для свободного общения без давления.",

    languagesTitle: "9 поддерживаемых языков",
    languagesDescription:
      "Арабский, английский, испанский, немецкий, французский, японский, корейский, русский и турецкий.",

    levelsTitle: "Один уровень",
    levelsDescription:
      "Вы будете соединены с человеком, который изучает тот же язык на том же уровне.",

    howTitle: "Как работает LWA?",
    howDescription:
      "Начните разговор всего за несколько простых шагов.",

    step1Title: "Настройте язык",
    step1Description:
      "Выберите родной язык, изучаемый язык и свой уровень.",

    step2Title: "Начните поиск",
    step2Description:
      "Нажмите Start Practice, и LWA автоматически начнёт поиск.",

    step3Title: "Найдите партнёра",
    step3Description:
      "Подходящий доступный пользователь выбирается случайным образом.",

    step4Title: "Говорите 7 минут",
    step4Description:
      "Оба пользователя входят в одну видеокомнату и начинают разговор.",

    faqTitle: "Часто задаваемые вопросы",

    faq1Question: "Я выбираю партнёра сам?",
    faq1Answer:
      "Нет. LWA автоматически и случайным образом выбирает подходящего доступного партнёра.",

    faq2Question: "Сколько длится звонок?",
    faq2Answer:
      "Каждая сессия длится 7 минут, и оба участника используют один таймер.",

    faq3Question: "Звонки только аудио?",
    faq3Answer:
      "Нет. LWA использует видео и аудио. Микрофон можно отключить.",

    faq4Question: "Какие языки поддерживаются?",
    faq4Answer:
      "Арабский, английский, испанский, немецкий, французский, японский, корейский, русский и турецкий.",

    ctaTitle: "Готовы начать говорить?",
    ctaDescription:
      "Не ждите идеального уровня. Начните использовать язык прямо сейчас.",

    complaintsTitle: "Жалобы и контакты",
    complaintsDescription:
      "Если вы столкнулись с проблемой или хотите предложить улучшение, свяжитесь с нами по электронной почте.",
    complaintsEmail: "LWAlanguage@gmail.com",

    footerDescription:
      "LWA — свободное общение с изучающими языки со всего мира.",
    footerRights: "Все права защищены.",
  },

  Turkish: {
    navHome: "Ana Sayfa",
    navFeatures: "Özellikler",
    navHow: "Nasıl çalışır?",
    navFaq: "SSS",
    login: "Giriş yap",
    getStarted: "Başla",

    badge: "Özgürce konuş • 7 dakika • Gerçek insanlar",
    heroTitle: "Öğrendiğin dili güvenle konuş.",
    heroDescription:
      "LWA, seni aynı dili ve aynı seviyeyi öğrenen başka bir öğrenciyle 7 dakikalık canlı görüntülü konuşma için otomatik olarak eşleştirir.",
    startSpeaking: "Konuşmaya başla",
    learnMore: "Özellikleri keşfet",

    featuresTitle: "Pratik yapmak için ihtiyacın olan her şey",
    featuresDescription:
      "LWA, sadece dil çalışmayı bırakıp dili gerçekten kullanmaya başlamana yardımcı olmak için tasarlandı.",

    videoTitle: "Canlı görüntülü aramalar",
    videoDescription:
      "Başka bir öğrenciyle gerçek zamanlı görüntü ve ses kullanarak yüz yüze konuş.",

    matchingTitle: "Otomatik eşleştirme",
    matchingDescription:
      "Bir partner aramana gerek yok. LWA sana uygun bir kişiyi otomatik olarak bulur.",

    sevenTitle: "7 dakikalık oturumlar",
    sevenDescription:
      "Baskı olmadan özgürce konuşmana yardımcı olan kısa ve odaklanmış bir oturum.",

    languagesTitle: "9 desteklenen dil",
    languagesDescription:
      "Arapça, İngilizce, İspanyolca, Almanca, Fransızca, Japonca, Korece, Rusça ve Türkçe.",

    levelsTitle: "Aynı seviye",
    levelsDescription:
      "Seni aynı dili aynı seviyede öğrenen biriyle eşleştiriyoruz.",

    howTitle: "LWA nasıl çalışır?",
    howDescription:
      "Konuşmana birkaç basit adımda başla.",

    step1Title: "Dilini seç",
    step1Description:
      "Ana dilini, öğrenmek istediğin dili ve seviyeni seç.",

    step2Title: "Aramayı başlat",
    step2Description:
      "Start Practice düğmesine bas ve LWA otomatik olarak bir partner aramaya başlasın.",

    step3Title: "Bir partner bul",
    step3Description:
      "Dil ve seviyene göre uygun bir öğrenci rastgele seçilir.",

    step4Title: "7 dakika konuş",
    step4Description:
      "İki kullanıcı aynı görüntülü odaya girer ve konuşmaya başlar.",

    faqTitle: "Sıkça sorulan sorular",

    faq1Question: "Partnerimi kendim mi seçiyorum?",
    faq1Answer:
      "Hayır. LWA uygun ve müsait bir partneri otomatik ve rastgele seçer.",

    faq2Question: "Arama ne kadar sürer?",
    faq2Answer:
      "Her oturum 7 dakika sürer ve iki katılımcı aynı zamanlayıcıyı kullanır.",

    faq3Question: "Aramalar sadece sesli mi?",
    faq3Answer:
      "Hayır. LWA görüntülü ve sesli aramalar kullanır. Mikrofonunuzu sessize alabilirsiniz.",

    faq4Question: "Hangi diller destekleniyor?",
    faq4Answer:
      "Arapça, İngilizce, İspanyolca, Almanca, Fransızca, Japonca, Korece, Rusça ve Türkçe.",

    ctaTitle: "Konuşmaya hazır mısın?",
    ctaDescription:
      "Mükemmel olmayı bekleme. Dili şimdi kullanmaya başla.",

    complaintsTitle: "Şikayetler ve İletişim",
    complaintsDescription:
      "Bir sorun yaşarsanız veya LWA'ı geliştirmek için bir öneriniz varsa, bize e-posta yoluyla ulaşabilirsiniz.",
    complaintsEmail: "LWAlanguage@gmail.com",

    footerDescription:
      "LWA — Dünyanın dört bir yanındaki dil öğrencileriyle özgürce konuş.",
    footerRights: "Tüm hakları saklıdır.",
  },
};

function normalizeLanguage(
  language: string | null | undefined
): LanguageCode {
  const value = language?.trim();

  if (
    value &&
    value in translations
  ) {
    return value as LanguageCode;
  }

  return "English";
}

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let nativeLanguage: LanguageCode =
    "English";

  if (user) {
    const {
      data: profile,
    } = await supabase
      .from("profiles")
      .select("native_language")
      .eq("id", user.id)
      .maybeSingle();

    nativeLanguage =
      normalizeLanguage(
        profile?.native_language
      );
  }

  const t =
    translations[nativeLanguage];

  const isArabic =
    nativeLanguage === "Arabic";

  const direction =
    isArabic ? "rtl" : "ltr";

  return (
    <main
      dir={direction}
      className="min-h-screen overflow-hidden bg-[#f7f7f5] text-gray-900"
    >
      {/* =========================
          NAVBAR
      ========================== */}
      <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-[#f7f7f5]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            LWA<span className="text-blue-600">.</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#home"
              className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
            >
              {t.navHome}
            </a>

            <a
              href="#features"
              className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
            >
              {t.navFeatures}
            </a>

            <a
              href="#how"
              className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
            >
              {t.navHow}
            </a>

            <a
              href="#faq"
              className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
            >
              {t.navFaq}
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {!user && (
              <Link
                href="/auth/login"
                className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-200/70 sm:block"
              >
                {t.login}
              </Link>
            )}

            <Link
              href={
                user
                  ? "/dashboard"
                  : "/auth/login"
              }
              className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              {t.getStarted}
            </Link>
          </div>

        </div>
      </header>

      {/* =========================
          HERO
      ========================== */}
      <section
        id="home"
        className="relative"
      >
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            <div className="max-w-3xl">

              <div className="mb-7 inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                🌍 {t.badge}
              </div>

              <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                {t.heroTitle}
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
                {t.heroDescription}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <Link
                  href={
                    user
                      ? "/dashboard"
                      : "/auth/login"
                  }
                  className="rounded-2xl bg-blue-600 px-7 py-4 text-center font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  {t.startSpeaking} →
                </Link>

                <a
                  href="#features"
                  className="rounded-2xl border border-gray-300 bg-white px-7 py-4 text-center font-bold text-gray-900 transition hover:bg-gray-50"
                >
                  {t.learnMore}
                </a>

              </div>

              <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-500">
                <span>✓ {t.videoTitle}</span>
                <span>✓ {t.matchingTitle}</span>
                <span>✓ {t.sevenTitle}</span>
              </div>

            </div>

            {/* Hero visual */}
            <div className="relative">

              <div className="relative mx-auto max-w-lg rounded-[2rem] bg-[#10231f] p-4 shadow-2xl">

                <div className="mb-4 flex items-center justify-between px-3 pt-2">
                  <span className="font-bold text-white">
                    LWA
                  </span>

                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                    7:00
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">

                  <div className="flex aspect-[4/5] items-end rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 p-4">
                    <span className="rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                      You
                    </span>
                  </div>

                  <div className="flex aspect-[4/5] items-end rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 p-4">
                    <span className="rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                      Partner
                    </span>
                  </div>

                </div>

                <div className="mt-4 flex justify-center">
                  <div className="rounded-full bg-white px-6 py-3 text-sm font-bold text-black">
                    🎤 Mute
                  </div>
                </div>

              </div>

              <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-xl sm:block">
                <div className="text-xs text-gray-500">
                  Match
                </div>

                <div className="mt-1 font-bold">
                  Same language
                </div>

                <div className="text-sm text-blue-600">
                  Same level
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================
          FEATURES
      ========================== */}
      <section
        id="features"
        className="border-y border-gray-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              LWA
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              {t.featuresTitle}
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              {t.featuresDescription}
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            <FeatureCard
              icon="🎥"
              title={t.videoTitle}
              description={t.videoDescription}
            />

            <FeatureCard
              icon="🤝"
              title={t.matchingTitle}
              description={t.matchingDescription}
            />

            <FeatureCard
              icon="⏱️"
              title={t.sevenTitle}
              description={t.sevenDescription}
            />

            <FeatureCard
              icon="🌍"
              title={t.languagesTitle}
              description={t.languagesDescription}
            />

            <FeatureCard
              icon="📊"
              title={t.levelsTitle}
              description={t.levelsDescription}
            />

            <FeatureCard
              icon="⚡"
              title={t.matchingTitle}
              description={t.matchingDescription}
            />

          </div>

        </div>
      </section>

      {/* =========================
          HOW IT WORKS
      ========================== */}
      <section
        id="how"
        className="bg-[#10231f] text-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-300">
              Simple
            </p>

            <h2 className="mt-3 text-4xl font-black sm:text-5xl">
              {t.howTitle}
            </h2>

            <p className="mt-5 text-lg leading-8 text-white/60">
              {t.howDescription}
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            <StepCard
              number="01"
              title={t.step1Title}
              description={t.step1Description}
            />

            <StepCard
              number="02"
              title={t.step2Title}
              description={t.step2Description}
            />

            <StepCard
              number="03"
              title={t.step3Title}
              description={t.step3Description}
            />

            <StepCard
              number="04"
              title={t.step4Title}
              description={t.step4Description}
            />

          </div>

        </div>
      </section>

      {/* =========================
          LANGUAGE SECTION
      ========================== */}
      <section className="bg-[#f7f7f5]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm sm:p-12">

            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

              <div>
                <div className="text-5xl">
                  🌍
                </div>

                <h2 className="mt-5 text-4xl font-black">
                  {t.languagesTitle}
                </h2>

                <p className="mt-5 text-lg leading-8 text-gray-600">
                  {t.languagesDescription}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                {[
                  "🇪🇬 Arabic",
                  "🇬🇧 English",
                  "🇪🇸 Spanish",
                  "🇩🇪 German",
                  "🇫🇷 French",
                  "🇯🇵 Japanese",
                  "🇰🇷 Korean",
                  "🇷🇺 Russian",
                  "🇹🇷 Turkish",
                ].map((language) => (
                  <div
                    key={language}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center text-sm font-bold"
                  >
                    {language}
                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================
          FAQ
      ========================== */}
      <section
        id="faq"
        className="border-t border-gray-200 bg-white"
      >
        <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8">

          <h2 className="text-center text-4xl font-black sm:text-5xl">
            {t.faqTitle}
          </h2>

          <div className="mt-12 space-y-4">

            <FaqItem
              question={t.faq1Question}
              answer={t.faq1Answer}
            />

            <FaqItem
              question={t.faq2Question}
              answer={t.faq2Answer}
            />

            <FaqItem
              question={t.faq3Question}
              answer={t.faq3Answer}
            />

            <FaqItem
              question={t.faq4Question}
              answer={t.faq4Answer}
            />

          </div>

        </div>
      </section>

      {/* =========================
          CTA
      ========================== */}
      <section className="bg-blue-600">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center text-white lg:px-8">

          <h2 className="text-4xl font-black sm:text-5xl">
            {t.ctaTitle}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            {t.ctaDescription}
          </p>

          <Link
            href={
              user
                ? "/dashboard"
                : "/auth/login"
            }
            className="mt-8 inline-block rounded-2xl bg-white px-8 py-4 font-bold text-blue-700 shadow-xl transition hover:-translate-y-0.5 hover:bg-blue-50"
          >
            {t.startSpeaking} →
          </Link>

        </div>
      </section>

      {/* =========================
          COMPLAINTS / CONTACT
      ========================== */}
      <section
        id="contact"
        className="bg-[#10231f] text-white"
      >
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl">
            ✉️
          </div>

          <h2 className="mt-6 text-3xl font-black sm:text-4xl">
            {t.complaintsTitle}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            {t.complaintsDescription}
          </p>

          <a
            href={`mailto:${t.complaintsEmail}`}
            className="mt-7 inline-flex rounded-2xl bg-white px-7 py-4 font-bold text-[#10231f] transition hover:bg-gray-100"
          >
            {t.complaintsEmail}
          </a>

        </div>
      </section>

      {/* =========================
          FOOTER
      ========================== */}
      <footer className="border-t border-white/10 bg-[#0b1916] text-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-8">

          <div>
            <div className="text-xl font-black">
              LWA<span className="text-blue-500">.</span>
            </div>

            <p className="mt-2 max-w-md text-sm text-white/50">
              {t.footerDescription}
            </p>
          </div>

          <div className="text-sm text-white/40">
            © {new Date().getFullYear()} LWA.{" "}
            {t.footerRights}
          </div>

        </div>

      </footer>
    </main>
  );
}

/* =========================
   FEATURE CARD
========================= */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-3xl border border-gray-200 bg-gray-50 p-7 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-xl">

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-black">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-gray-600">
        {description}
      </p>

    </div>
  );
}

/* =========================
   STEP CARD
========================= */

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-7">

      <div className="text-sm font-black text-blue-300">
        {number}
      </div>

      <h3 className="mt-5 text-xl font-black">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-white/60">
        {description}
      </p>

    </div>
  );
}

/* =========================
   FAQ ITEM
========================= */

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group rounded-2xl border border-gray-200 bg-gray-50 p-6">

      <summary className="cursor-pointer list-none font-bold">

        <div className="flex items-center justify-between gap-5">

          <span>
            {question}
          </span>

          <span className="text-xl text-gray-400 transition group-open:rotate-45">
            +
          </span>

        </div>

      </summary>

      <p className="mt-4 leading-7 text-gray-600">
        {answer}
      </p>

    </details>
  );
}