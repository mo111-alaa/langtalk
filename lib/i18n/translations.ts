import type { LanguageCode } from "@/types/profile";

type TranslationKeys =
  | "dashboard"
  | "startPractice"
  | "freeCalls"
  | "onboarding"
  | "nativeLanguage"
  | "country"
  | "targetLanguage"
  | "proficiency"
  | "continue"
  | "waiting"
  | "endCall"
  | "icebreakers"
  | "feedback"
  | "premium"
  | "premiumTitle"
  | "premiumDescription"
  | "monthly"
  | "yearly"
  | "month"
  | "year"
  | "choosePlan"
  | "subscribe"
  | "paymentMethods"
  | "cards"
  | "wallets"
  | "freeSessionsFinished"
  | "premiumRequired"
  | "activeSubscription"
  | "subscriptionExpires"
  | "paymentSuccess"
  | "paymentFailed"
  | "backToDashboard";

type TranslationMap = Record<
  LanguageCode,
  Record<TranslationKeys, string>
>;

export const translations: TranslationMap = {
  en: {
    dashboard: "Dashboard",
    startPractice: "Start 7-Min Practice Session",
    freeCalls: "Free sessions",
    onboarding: "Welcome to LWA",
    nativeLanguage: "Native Language",
    country: "Country of Residence",
    targetLanguage: "Target Language",
    proficiency: "Proficiency Level",
    continue: "Continue",
    waiting: "Finding your partner...",
    endCall: "End Call",
    icebreakers: "Icebreakers",
    feedback: "How was your conversation?",

    premium: "Premium",
    premiumTitle: "Unlock Unlimited Practice",
    premiumDescription:
      "Continue practicing with unlimited 7-minute conversation sessions.",
    monthly: "Monthly",
    yearly: "Yearly",
    month: "month",
    year: "year",
    choosePlan: "Choose your plan",
    subscribe: "Subscribe",
    paymentMethods: "Payment methods",
    cards: "Visa / Mastercard",
    wallets: "Electronic wallets",
    freeSessionsFinished: "Your free sessions are finished.",
    premiumRequired: "Premium is required to continue practicing.",
    activeSubscription: "Active subscription",
    subscriptionExpires: "Subscription expires",
    paymentSuccess: "Payment successful!",
    paymentFailed: "Payment failed. Please try again.",
    backToDashboard: "Back to Dashboard",
  },

  ar: {
    dashboard: "الرئيسية",
    startPractice: "ابدأ جلسة ممارسة لمدة 7 دقائق",
    freeCalls: "الجلسات المجانية",
    onboarding: "مرحبًا بك في LWA",
    nativeLanguage: "اللغة الأم",
    country: "بلد الإقامة",
    targetLanguage: "اللغة المستهدفة",
    proficiency: "مستوى اللغة",
    continue: "متابعة",
    waiting: "جارٍ البحث عن شريك...",
    endCall: "إنهاء المكالمة",
    icebreakers: "أسئلة للتعارف",
    feedback: "كيف كانت المحادثة؟",

    premium: "Premium",
    premiumTitle: "احصل على ممارسة غير محدودة",
    premiumDescription:
      "استمر في ممارسة اللغة من خلال جلسات محادثة غير محدودة لمدة 7 دقائق.",
    monthly: "شهري",
    yearly: "سنوي",
    month: "شهر",
    year: "سنة",
    choosePlan: "اختر خطتك",
    subscribe: "اشترك الآن",
    paymentMethods: "طرق الدفع",
    cards: "Visa / Mastercard",
    wallets: "المحافظ الإلكترونية",
    freeSessionsFinished: "لقد انتهت جلساتك المجانية.",
    premiumRequired: "تحتاج إلى Premium لمواصلة ممارسة اللغة.",
    activeSubscription: "الاشتراك نشط",
    subscriptionExpires: "ينتهي الاشتراك في",
    paymentSuccess: "تم الدفع بنجاح!",
    paymentFailed: "فشلت عملية الدفع. حاول مرة أخرى.",
    backToDashboard: "العودة إلى الرئيسية",
  },

  es: {
    dashboard: "Panel",
    startPractice: "Iniciar sesión de práctica de 7 minutos",
    freeCalls: "Sesiones gratuitas",
    onboarding: "Bienvenido a LWA",
    nativeLanguage: "Idioma nativo",
    country: "País de residencia",
    targetLanguage: "Idioma objetivo",
    proficiency: "Nivel",
    continue: "Continuar",
    waiting: "Buscando compañero...",
    endCall: "Finalizar llamada",
    icebreakers: "Preguntas",
    feedback: "¿Cómo fue la conversación?",

    premium: "Premium",
    premiumTitle: "Desbloquea práctica ilimitada",
    premiumDescription:
      "Continúa practicando con sesiones ilimitadas de conversación de 7 minutos.",
    monthly: "Mensual",
    yearly: "Anual",
    month: "mes",
    year: "año",
    choosePlan: "Elige tu plan",
    subscribe: "Suscribirse",
    paymentMethods: "Métodos de pago",
    cards: "Visa / Mastercard",
    wallets: "Carteras electrónicas",
    freeSessionsFinished: "Tus sesiones gratuitas han terminado.",
    premiumRequired:
      "Necesitas Premium para continuar practicando.",
    activeSubscription: "Suscripción activa",
    subscriptionExpires: "La suscripción vence",
    paymentSuccess: "¡Pago realizado correctamente!",
    paymentFailed: "El pago ha fallado. Inténtalo de nuevo.",
    backToDashboard: "Volver al panel",
  },

  de: {
    dashboard: "Dashboard",
    startPractice: "7-Minuten-Übung starten",
    freeCalls: "Kostenlose Sitzungen",
    onboarding: "Willkommen bei LWA",
    nativeLanguage: "Muttersprache",
    country: "Wohnsitzland",
    targetLanguage: "Zielsprache",
    proficiency: "Sprachniveau",
    continue: "Weiter",
    waiting: "Partner wird gesucht...",
    endCall: "Anruf beenden",
    icebreakers: "Eisbrecher",
    feedback: "Wie war das Gespräch?",

    premium: "Premium",
    premiumTitle: "Unbegrenztes Üben freischalten",
    premiumDescription:
      "Übe weiter mit unbegrenzten 7-minütigen Gesprächssitzungen.",
    monthly: "Monatlich",
    yearly: "Jährlich",
    month: "Monat",
    year: "Jahr",
    choosePlan: "Wähle deinen Plan",
    subscribe: "Abonnieren",
    paymentMethods: "Zahlungsmethoden",
    cards: "Visa / Mastercard",
    wallets: "Elektronische Geldbörsen",
    freeSessionsFinished:
      "Deine kostenlosen Sitzungen sind aufgebraucht.",
    premiumRequired:
      "Du benötigst Premium, um weiter zu üben.",
    activeSubscription: "Aktives Abonnement",
    subscriptionExpires: "Abonnement läuft ab",
    paymentSuccess: "Zahlung erfolgreich!",
    paymentFailed:
      "Die Zahlung ist fehlgeschlagen. Bitte versuche es erneut.",
    backToDashboard: "Zurück zum Dashboard",
  },

  fr: {
    dashboard: "Tableau de bord",
    startPractice: "Commencer une session de 7 minutes",
    freeCalls: "Sessions gratuites",
    onboarding: "Bienvenue sur LWA",
    nativeLanguage: "Langue maternelle",
    country: "Pays de résidence",
    targetLanguage: "Langue cible",
    proficiency: "Niveau",
    continue: "Continuer",
    waiting: "Recherche d'un partenaire...",
    endCall: "Terminer l'appel",
    icebreakers: "Questions",
    feedback: "Comment était la conversation ?",

    premium: "Premium",
    premiumTitle: "Débloquez une pratique illimitée",
    premiumDescription:
      "Continuez à pratiquer avec des sessions de conversation illimitées de 7 minutes.",
    monthly: "Mensuel",
    yearly: "Annuel",
    month: "mois",
    year: "an",
    choosePlan: "Choisissez votre formule",
    subscribe: "S'abonner",
    paymentMethods: "Modes de paiement",
    cards: "Visa / Mastercard",
    wallets: "Portefeuilles électroniques",
    freeSessionsFinished:
      "Vos sessions gratuites sont terminées.",
    premiumRequired:
      "Premium est nécessaire pour continuer à pratiquer.",
    activeSubscription: "Abonnement actif",
    subscriptionExpires: "L'abonnement expire le",
    paymentSuccess: "Paiement réussi !",
    paymentFailed:
      "Le paiement a échoué. Veuillez réessayer.",
    backToDashboard: "Retour au tableau de bord",
  },

  ja: {
    dashboard: "ダッシュボード",
    startPractice: "7分間の練習を開始",
    freeCalls: "無料セッション",
    onboarding: "LWAへようこそ",
    nativeLanguage: "母語",
    country: "居住国",
    targetLanguage: "学習言語",
    proficiency: "レベル",
    continue: "続行",
    waiting: "パートナーを探しています...",
    endCall: "通話を終了",
    icebreakers: "質問",
    feedback: "会話はいかがでしたか？",

    premium: "プレミアム",
    premiumTitle: "無制限の練習を解放",
    premiumDescription:
      "7分間の会話セッションを無制限で続けられます。",
    monthly: "月額",
    yearly: "年額",
    month: "月",
    year: "年",
    choosePlan: "プランを選択",
    subscribe: "登録する",
    paymentMethods: "支払い方法",
    cards: "Visa / Mastercard",
    wallets: "電子ウォレット",
    freeSessionsFinished:
      "無料セッションを使い切りました。",
    premiumRequired:
      "練習を続けるにはプレミアムが必要です。",
    activeSubscription: "有効なサブスクリプション",
    subscriptionExpires: "有効期限",
    paymentSuccess: "支払いが完了しました！",
    paymentFailed:
      "支払いに失敗しました。もう一度お試しください。",
    backToDashboard: "ダッシュボードに戻る",
  },

  ko: {
    dashboard: "대시보드",
    startPractice: "7분 연습 시작",
    freeCalls: "무료 세션",
    onboarding: "LWA에 오신 것을 환영합니다",
    nativeLanguage: "모국어",
    country: "거주 국가",
    targetLanguage: "목표 언어",
    proficiency: "레벨",
    continue: "계속",
    waiting: "파트너를 찾는 중...",
    endCall: "통화 종료",
    icebreakers: "질문",
    feedback: "대화는 어땠나요?",

    premium: "프리미엄",
    premiumTitle: "무제한 연습 이용하기",
    premiumDescription:
      "7분 대화 세션을 무제한으로 계속 이용할 수 있습니다.",
    monthly: "월간",
    yearly: "연간",
    month: "개월",
    year: "년",
    choosePlan: "요금제를 선택하세요",
    subscribe: "구독하기",
    paymentMethods: "결제 방법",
    cards: "Visa / Mastercard",
    wallets: "전자 지갑",
    freeSessionsFinished:
      "무료 세션을 모두 사용했습니다.",
    premiumRequired:
      "계속 연습하려면 프리미엄이 필요합니다.",
    activeSubscription: "활성 구독",
    subscriptionExpires: "구독 만료일",
    paymentSuccess: "결제가 완료되었습니다!",
    paymentFailed:
      "결제에 실패했습니다. 다시 시도해 주세요.",
    backToDashboard: "대시보드로 돌아가기",
  },

  ru: {
    dashboard: "Панель",
    startPractice: "Начать 7-минутную практику",
    freeCalls: "Бесплатные сессии",
    onboarding: "Добро пожаловать в LWA",
    nativeLanguage: "Родной язык",
    country: "Страна проживания",
    targetLanguage: "Целевой язык",
    proficiency: "Уровень",
    continue: "Продолжить",
    waiting: "Ищем партнёра...",
    endCall: "Завершить звонок",
    icebreakers: "Вопросы",
    feedback: "Как прошёл разговор?",

    premium: "Premium",
    premiumTitle: "Откройте безлимитную практику",
    premiumDescription:
      "Продолжайте практиковаться с неограниченными 7-минутными разговорами.",
    monthly: "Ежемесячно",
    yearly: "Ежегодно",
    month: "месяц",
    year: "год",
    choosePlan: "Выберите тариф",
    subscribe: "Подписаться",
    paymentMethods: "Способы оплаты",
    cards: "Visa / Mastercard",
    wallets: "Электронные кошельки",
    freeSessionsFinished:
      "Ваши бесплатные сессии закончились.",
    premiumRequired:
      "Для продолжения практики необходим Premium.",
    activeSubscription: "Активная подписка",
    subscriptionExpires: "Подписка истекает",
    paymentSuccess: "Оплата прошла успешно!",
    paymentFailed:
      "Не удалось выполнить оплату. Попробуйте ещё раз.",
    backToDashboard: "Вернуться на панель",
  },

  tr: {
    dashboard: "Ana Sayfa",
    startPractice: "7 Dakikalık Pratik Oturumunu Başlat",
    freeCalls: "Ücretsiz oturumlar",
    onboarding: "LWA'a Hoş Geldiniz",
    nativeLanguage: "Ana Dil",
    country: "İkamet Ülkesi",
    targetLanguage: "Hedef Dil",
    proficiency: "Dil Seviyesi",
    continue: "Devam Et",
    waiting: "Partneriniz aranıyor...",
    endCall: "Aramayı Bitir",
    icebreakers: "Tanışma Soruları",
    feedback: "Konuşmanız nasıldı?",

    premium: "Premium",
    premiumTitle: "Sınırsız Pratiğin Kilidini Aç",
    premiumDescription:
      "Sınırsız 7 dakikalık konuşma oturumlarıyla pratik yapmaya devam edin.",
    monthly: "Aylık",
    yearly: "Yıllık",
    month: "ay",
    year: "yıl",
    choosePlan: "Planınızı seçin",
    subscribe: "Abone Ol",
    paymentMethods: "Ödeme yöntemleri",
    cards: "Visa / Mastercard",
    wallets: "Elektronik cüzdanlar",
    freeSessionsFinished:
      "Ücretsiz oturumlarınız sona erdi.",
    premiumRequired:
      "Pratiğe devam etmek için Premium gereklidir.",
    activeSubscription: "Aktif abonelik",
    subscriptionExpires: "Abonelik sona eriyor",
    paymentSuccess: "Ödeme başarılı!",
    paymentFailed:
      "Ödeme başarısız oldu. Lütfen tekrar deneyin.",
    backToDashboard: "Ana Sayfaya Dön",
  },
};