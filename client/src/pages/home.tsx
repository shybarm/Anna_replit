import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Stethoscope,
  Baby,
  Users,
  Shield,
  Pill,
  HeartPulse,
  ChevronDown,
  Calendar,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import doctorPhoto from "@assets/Unknown_1766607958403.jpeg";
import allergyTestImage from "@assets/stock_images/medical_allergy_test_65d27e99.jpg";
import asthmaImage from "@assets/stock_images/asthma_inhaler_respi_4f7c10ff.jpg";
import springImage from "@assets/stock_images/spring_flowers_polle_a2372488.jpg";
import eczemaImage from "@assets/stock_images/child_with_eczema_sk_f2df5aa5.jpg";
import immunotherapyImage from "@assets/stock_images/immunotherapy_allerg_2c3ef341.jpg";
import dustMiteImage from "@assets/stock_images/dust_mite_allergy_ho_54da4a72.jpg";
import petAllergyImage from "@assets/stock_images/pet_dog_cat_allergy__a47a91c7.jpg";

const appointmentSlots = [
  "ראשון, 09:00",
  "ראשון, 10:30",
  "ראשון, 14:00",
  "ראשון, 16:30",
  "שני, 09:00",
  "שני, 11:00",
  "שני, 15:00",
  "שני, 17:00",
  "שלישי, 09:30",
  "שלישי, 13:00",
  "שלישי, 15:30",
  "שלישי, 17:30",
  "רביעי, 10:00",
  "רביעי, 12:00",
  "רביעי, 14:30",
  "רביעי, 16:00",
  "חמישי, 09:00",
  "חמישי, 11:30",
  "חמישי, 14:00",
  "חמישי, 16:30",
  "שישי, 09:00",
  "שישי, 10:30",
  "שישי, 12:00",
];

const contactFormSchema = z.object({
  name: z.string().min(2, "נא להזין שם מלא"),
  phone: z.string().min(9, "נא להזין מספר טלפון תקין"),
  email: z.string().email("נא להזין כתובת אימייל תקינה"),
  message: z.string().min(10, "נא להזין הודעה"),
  preferredDate: z.string().min(1, "נא לבחור תור זמין"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const services = [
  {
    id: "food-allergy",
    icon: Pill,
    title: "אלרגיות מזון",
    description: "אבחון וטיפול באלרגיות מזון בילדים ומבוגרים, כולל תוכניות חשיפה מבוקרת והדרכה תזונתית מותאמת אישית.",
  },
  {
    id: "asthma",
    icon: HeartPulse,
    title: "אסתמה",
    description: "טיפול מקיף באסתמה, כולל תוכנית טיפול אישית, מעקב תקופתי ושיפור איכות החיים.",
  },
  {
    id: "skin-allergy",
    icon: Shield,
    title: "מחלות עור אלרגיות",
    description: "אבחון וטיפול באטופיק דרמטיטיס, אורטיקריה, אקזמה ומצבי עור אלרגיים אחרים.",
  },
  {
    id: "immunology",
    icon: Stethoscope,
    title: "אימונולוגיה קלינית",
    description: "הערכה וטיפול בחסרים חיסוניים, מחלות אוטואימוניות ותגובות יתר של מערכת החיסון.",
  },
  {
    id: "children-allergy",
    icon: Baby,
    title: "אלרגיות ילדים",
    description: "התמחות מיוחדת באלרגיות בגיל הרך, כולל אלרגיות לחלב, ביצים ואגוזים.",
  },
  {
    id: "adult-allergy",
    icon: Users,
    title: "אלרגיות מבוגרים",
    description: "טיפול באלרגיות עונתיות, אלרגיות לתרופות, עקיצות חרקים ונזלת אלרגית.",
  },
];

const updates = [
  {
    id: 1,
    title: "מחקר חדש: חשיפה מוקדמת לבוטנים מפחיתה אלרגיה",
    date: "20 דצמבר 2024",
    excerpt: "מחקרים עדכניים מראים כי חשיפה מוקדמת ומבוקרת לבוטנים עשויה להפחית משמעותית את הסיכון לפתח אלרגיה.",
    image: allergyTestImage,
  },
  {
    id: 2,
    title: "טיפולים חדשניים לאסתמה קשה",
    date: "15 דצמבר 2024",
    excerpt: "התקדמות בתחום הביולוגיים מאפשרת טיפול ממוקד יותר בחולי אסתמה קשה שלא הגיבו לטיפולים קונבנציונליים.",
    image: asthmaImage,
  },
  {
    id: 3,
    title: "עונת האביב: כיצד להתכונן לעונת האלרגיות",
    date: "10 דצמבר 2024",
    excerpt: "טיפים והמלצות להתמודדות עם אלרגיות עונתיות וכיצד להקל על התסמינים בתקופת האביב.",
    image: springImage,
  },
  {
    id: 4,
    title: "אקזמה בילדים: גישות טיפול חדשות",
    date: "5 דצמבר 2024",
    excerpt: "שיטות טיפול מתקדמות לאטופיק דרמטיטיס בילדים, כולל טיפולים ביולוגיים ואסטרטגיות לשיפור איכות החיים.",
    image: eczemaImage,
  },
  {
    id: 5,
    title: "אימונותרפיה: המהפכה בטיפול באלרגיות",
    date: "1 דצמבר 2024",
    excerpt: "חיסוני אלרגיה (אימונותרפיה) מציעים פתרון ארוך טווח לאלרגיות נשימתיות - כיצד הטיפול עובד ולמי הוא מתאים.",
    image: immunotherapyImage,
  },
  {
    id: 6,
    title: "קרדית האבק: איך להילחם באלרגיה הנפוצה ביותר בבית",
    date: "25 נובמבר 2024",
    excerpt: "טיפים מעשיים להפחתת חשיפה לקרדית אבק בבית, כולל המלצות לניקיון, מצעים היפואלרגניים ומערכות סינון.",
    image: dustMiteImage,
  },
  {
    id: 7,
    title: "אלרגיה לחיות מחמד: האם אפשר לחיות עם הכלב?",
    date: "20 נובמבר 2024",
    excerpt: "מידע על אלרגיה לכלבים וחתולים, אפשרויות טיפול והמלצות לחיים משותפים עם חיית מחמד למרות האלרגיה.",
    image: petAllergyImage,
  },
];

const faqs = [
  {
    question: "מתי כדאי לפנות לרופא אלרגיה?",
    answer: "מומלץ לפנות כאשר יש תסמינים חוזרים כמו נזלת, עיטוש, גירוד בעור, קשיי נשימה, או תגובות לאחר אכילת מזונות מסוימים. אם התסמינים משפיעים על איכות החיים היומיומית, חשוב להתייעץ עם מומחה.",
  },
  {
    question: "איך מתבצעת בדיקת אלרגיה?",
    answer: "בדיקות האלרגיה כוללות בדיקות עור (Prick Test) ובדיקות דם. בדיקת העור מהירה ובטוחה, ותוצאותיה מתקבלות תוך 15-20 דקות. בדיקת דם בודקת נוגדנים ספציפיים ומשלימה את התמונה האבחנתית.",
  },
  {
    question: "האם ניתן לרפא אלרגיה?",
    answer: "בחלק מהמקרים ניתן להשיג הקלה משמעותית ואף ריפוי באמצעות אימונותרפיה (חיסון אלרגיה). הטיפול מתאים במיוחד לאלרגיות נשימתיות ועקיצות חרקים, ודורש התמדה לאורך זמן.",
  },
  {
    question: "מה ההבדל בין אלרגיה לרגישות מזון?",
    answer: "אלרגיה למזון היא תגובה של מערכת החיסון שעלולה להיות מסכנת חיים, בעוד שרגישות מזון (כמו אי סבילות ללקטוז) אינה מערבת את מערכת החיסון ובדרך כלל גורמת לתסמינים עיכוליים בלבד.",
  },
  {
    question: "האם ילדים יכולים לגדול מאלרגיה?",
    answer: "כן, חלק מהאלרגיות בילדות נעלמות עם הגיל. אלרגיות לחלב וביצים נעלמות לעיתים קרובות, בעוד שאלרגיות לאגוזים ודגים נוטות להישאר. מעקב קבוע עם רופא אלרגיה חשוב להערכת המצב.",
  },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "bot"; content: string }[]>([
    { role: "bot", content: "שלום! אני העוזר הווירטואלי של ד״ר אנה ברמלי. כיצד אוכל לעזור לך היום?" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
      preferredDate: "",
    },
  });

  const [selectedSlot, setSelectedSlot] = useState("");

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "הודעה נשלחה בהצלחה",
        description: "ניצור איתך קשר בהקדם",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "שגיאה בשליחת ההודעה",
        description: "אנא נסו שוב מאוחר יותר",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const generateChatResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    // Emergency detection
    const emergencyKeywords = [
      "חירום", "קריאה", "צריך עזרה", "עזרה", "דחוף", "חיוני", "איום", "ביסקופ",
      "emergency", "urgent", "critical", "help", "pain", "כאב חזה", "קשיי נשימה",
      "קשיי נשימה חמורים", "תגובה אלרגית חמורה", "הלם", "אנפילקסיס"
    ];
    
    if (emergencyKeywords.some(keyword => lowerInput.includes(keyword))) {
      return `⚠️ בעת חירום, אנא התקשרו מיד ל-101 (קריאות חירום)\n\nזו בעיה רפואית חמורה הדורשת טיפול מיידי. אל תחכו - התקשרו כעת!\n\nאם אפשר לכם, ספרו להם שזו תגובה אלרגית או בעיית נשימה.`;
    }
    
    // Clinic info responses
    if (lowerInput.includes("שעות") || lowerInput.includes("פתוחה") || lowerInput.includes("מתי")) {
      return `שעות הפעילות:\n📅 ראשון - חמישי: 08:00 - 18:00\n📅 שישי: 08:00 - 13:00\n\nנשמח לעמוד לרשותכם!`;
    }
    
    if (lowerInput.includes("כתובת") || lowerInput.includes("היכן") || lowerInput.includes("מיקום")) {
      return `📍 כתובתנו:\nרחוב הרופאים 15, תל אביב\n\n☎️ טלפון: 03-1234567\n📧 אימייל: info@dr-brameli.co.il`;
    }
    
    if (lowerInput.includes("טלפון") || lowerInput.includes("התקשר")) {
      return `☎️ מספר הטלפון שלנו: 03-1234567\n\nתוכלו להתקשר כדי:\n✓ לקבוע תור\n✓ לשאול שאלות\n✓ לדבר עם הצוות`;
    }
    
    if (lowerInput.includes("שירות") || lowerInput.includes("טיפול") || lowerInput.includes("איך")) {
      return `אנו מתמחים ב:\n✓ אלרגיות מזון\n✓ אסתמה\n✓ מחלות עור אלרגיות\n✓ אימונולוגיה קלינית\n✓ אלרגיות ילדים\n✓ אלרגיות מבוגרים\n\nהתעניינתם בשירות מסוים?`;
    }
    
    if (lowerInput.includes("חיסון") || lowerInput.includes("immunotherapy") || lowerInput.includes("אימונותרפיה")) {
      return `אימונותרפיה (חיסון אלרגיה) היא טיפול אפקטיבי שמהווה:\n✓ טיפול ארוך טווח\n✓ הפחתת תסמינים\n✓ שיפור איכות החיים\n\nמתעניין? אנא קבעו תור לייעוץ עם ד״ר ברמלי.`;
    }
    
    if (lowerInput.includes("בדיקה") || lowerInput.includes("סוגי בדיקות")) {
      return `סוגי בדיקות אלרגיה:\n1️⃣ בדיקת עור (Prick Test) - מהירה וביטוחה\n2️⃣ בדיקת דם - בדיקה ממצה\n\nשתי הבדיקות משלימות אחת את השנייה ונותנות תמונה מלאה.`;
    }
    
    if (lowerInput.includes("מחיר") || lowerInput.includes("עלות") || lowerInput.includes("כמה")) {
      return `לשאלות על מחירים וביטוח:\n☎️ אנא התקשרו ל- 03-1234567\n\nאנחנו עובדים עם רוב תוכניות הביטוח העיקריות.`;
    }
    
    if (lowerInput.includes("תור") || lowerInput.includes("קביעת") || lowerInput.includes("עכשיו")) {
      return `כדי לקבוע תור:\n☎️ התקשרו: 03-1234567\n📧 שלחו אימייל: info@dr-brameli.co.il\n🌐 או השתמשו בטופס צרו קשר בעמוד זה\n\nנשמח לראות אתכם!`;
    }
    
    // Default response for other queries
    return `תודה על פנייתך! 👋\n\nאני עוזר וירטואלי של מרפאת ד״ר אנה ברמלי. אוכל לעזור לך עם:\n✓ שעות פעילות וכתובת\n✓ סוגי שירותים\n✓ קביעת תורים\n✓ שאלות כלליות על אלרגיות\n\nאם יש לך שאלה חמורה, התקשר ל-101.\n\nמה אוכל לעזור?`;
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const userMessage = chatInput;
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setChatInput("");
    setTimeout(() => {
      const botResponse = generateChatResponse(userMessage);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: botResponse,
        },
      ]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-8 w-8 text-primary" />
              <span className="font-bold text-lg" data-testid="text-logo">ד״ר אנה ברמלי</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => scrollToSection("about")}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-about"
              >
                אודות
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-services"
              >
                שירותים
              </button>
              <button
                onClick={() => scrollToSection("updates")}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-updates"
              >
                עדכונים
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-faq"
              >
                שאלות נפוצות
              </button>
              <Button onClick={() => scrollToSection("contact")} data-testid="button-contact-nav">
                צרו קשר
              </Button>
            </nav>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="flex flex-col p-4 gap-4">
              <button
                onClick={() => scrollToSection("about")}
                className="text-right py-2 text-foreground"
              >
                אודות
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-right py-2 text-foreground"
              >
                שירותים
              </button>
              <button
                onClick={() => scrollToSection("updates")}
                className="text-right py-2 text-foreground"
              >
                עדכונים
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-right py-2 text-foreground"
              >
                שאלות נפוצות
              </button>
              <Button onClick={() => scrollToSection("contact")} className="w-full">
                צרו קשר
              </Button>
            </nav>
          </div>
        )}
      </header>

      <section
        id="about"
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 via-background to-muted/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(79,209,197,0.15),transparent_50%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-right order-2 lg:order-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6" data-testid="text-hero-title">
                ד״ר אנה ברמלי
              </h1>
              <p className="text-xl sm:text-2xl text-primary font-medium mb-4" data-testid="text-hero-subtitle">
                מומחית לאלרגיה ואימונולוגיה קלינית
              </p>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0" data-testid="text-hero-description">
                טיפול מקצועי ואישי באלרגיות ומחלות מערכת החיסון לילדים ומבוגרים.
                גישה חמה ומקצועית לכל מטופל ומטופלת.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" onClick={() => scrollToSection("contact")} data-testid="button-book-appointment">
                  <Calendar className="ml-2 h-5 w-5" />
                  קבעו תור
                </Button>
                <Button size="lg" variant="outline" onClick={() => scrollToSection("services")} data-testid="button-view-services">
                  לשירותים שלנו
                </Button>
              </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-primary/30 to-muted/50 p-2">
                  <img
                    src={doctorPhoto}
                    alt="ד״ר אנה ברמלי"
                    className="w-full h-full rounded-full object-cover shadow-lg"
                    data-testid="img-doctor"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-card rounded-lg p-4 shadow-lg border border-card-border">
                  <p className="text-sm font-medium text-foreground">+10 שנות ניסיון</p>
                  <p className="text-xs text-muted-foreground">Vanderbilt University</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => scrollToSection("services")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
          data-testid="button-scroll-down"
        >
          <ChevronDown className="h-8 w-8 text-muted-foreground" />
        </button>
      </section>

      <section id="services" className="py-16 sm:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-services-title">
              השירותים שלנו
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              טיפול מקיף ומקצועי במגוון רחב של מצבים אלרגיים ואימונולוגיים
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Link key={index} href={`/services/${service.id}`}>
                <Card
                  className="hover-elevate transition-all duration-300 cursor-pointer h-full"
                  data-testid={`card-service-${index}`}
                >
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{service.description}</p>
                    <p className="text-primary text-sm mt-4 font-medium">קרא עוד</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="updates" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-updates-title">
              עדכונים אחרונים
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              חדשות ומידע עדכני מעולם האלרגיה והאימונולוגיה
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {updates.map((update) => (
              <Card key={update.id} className="hover-elevate overflow-hidden" data-testid={`card-update-${update.id}`}>
                <div className="aspect-video overflow-hidden">
                  <img
                    src={update.image}
                    alt={update.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader className="pt-4">
                  <div className="text-sm text-muted-foreground mb-2">{update.date}</div>
                  <CardTitle className="text-lg leading-snug">{update.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{update.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 sm:py-20 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-faq-title">
              שאלות נפוצות
            </h2>
            <p className="text-lg text-muted-foreground">
              תשובות לשאלות הנפוצות ביותר
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`} data-testid={`accordion-faq-${index}`}>
                <AccordionTrigger className="text-right text-base sm:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section id="contact" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-contact-title">
              צרו קשר
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              נשמח לעמוד לרשותכם ולענות על כל שאלה
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card data-testid="card-contact-form">
              <CardHeader>
                <CardTitle>השאירו פרטים</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>שם מלא</FormLabel>
                          <FormControl>
                            <Input placeholder="הזינו את שמכם" {...field} data-testid="input-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>טלפון</FormLabel>
                            <FormControl>
                              <Input placeholder="050-0000000" {...field} data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>אימייל</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="email@example.com" {...field} data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>בחרו תור*</FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedSlot(value);
                            }}>
                              <SelectTrigger data-testid="select-appointment">
                                <SelectValue placeholder="בחרו תור זמין" />
                              </SelectTrigger>
                              <SelectContent>
                                {appointmentSlots.map((slot) => (
                                  <SelectItem key={slot} value={slot}>
                                    {slot}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>הודעה</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="ספרו לנו במה נוכל לעזור..."
                              className="min-h-[120px]"
                              {...field}
                              data-testid="input-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={contactMutation.isPending}
                      data-testid="button-submit-contact"
                    >
                      {contactMutation.isPending ? "שולח..." : "שלחו הודעה"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card data-testid="card-clinic-details">
                <CardHeader>
                  <CardTitle>פרטי המרפאה</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="font-medium">כתובת</p>
                      <p className="text-muted-foreground">רחוב הרופאים 15, תל אביב</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="font-medium">טלפון</p>
                      <p className="text-muted-foreground" dir="ltr">03-1234567</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="font-medium">אימייל</p>
                      <p className="text-muted-foreground">info@dr-brameli.co.il</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="font-medium">שעות פעילות</p>
                      <p className="text-muted-foreground">ראשון - חמישי: 08:00 - 18:00</p>
                      <p className="text-muted-foreground">שישי: 08:00 - 13:00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-map">
                <CardContent className="p-0 overflow-hidden rounded-lg">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <div className="text-center p-8">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">מפה תוטמע כאן</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-muted/50 border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="h-6 w-6 text-primary" />
                <span className="font-bold">ד״ר אנה ברמלי</span>
              </div>
              <p className="text-sm text-muted-foreground">
                מומחית לאלרגיה ואימונולוגיה קלינית לילדים ומבוגרים
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">קישורים מהירים</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button onClick={() => scrollToSection("about")} className="hover:text-foreground transition-colors">
                    אודות
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("services")} className="hover:text-foreground transition-colors">
                    שירותים
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("faq")} className="hover:text-foreground transition-colors">
                    שאלות נפוצות
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">שירותים</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>אלרגיות מזון</li>
                <li>אסתמה</li>
                <li>מחלות עור</li>
                <li>אימונולוגיה</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">יצירת קשר</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li dir="ltr">03-1234567</li>
                <li>info@dr-brameli.co.il</li>
                <li>רחוב הרופאים 15, תל אביב</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} ד״ר אנה ברמלי. כל הזכויות שמורות.</p>
          </div>
        </div>
      </footer>

      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center z-50 hover-elevate"
        data-testid="button-chat-fab"
      >
        {chatOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {chatOpen && (
        <div
          className="fixed bottom-24 left-6 w-[calc(100vw-48px)] sm:w-96 h-[500px] bg-card rounded-lg shadow-xl border border-card-border flex flex-col z-50"
          data-testid="card-chat-window"
        >
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">עוזר וירטואלי</p>
                <p className="text-xs text-muted-foreground">מענה מהיר</p>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} data-testid="button-close-chat">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.role === "user"
                      ? "bg-muted text-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                  data-testid={`text-chat-message-${index}`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="הקלידו הודעה..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
                className="flex-1"
                data-testid="input-chat"
              />
              <Button size="icon" onClick={handleChatSend} data-testid="button-send-chat">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
