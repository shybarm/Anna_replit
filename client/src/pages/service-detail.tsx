import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Phone,
  Calendar,
  CheckCircle2,
  Pill,
  HeartPulse,
  Shield,
  Stethoscope,
  Baby,
  Users,
} from "lucide-react";

const servicesData: Record<string, {
  id: string;
  icon: typeof Pill;
  title: string;
  subtitle: string;
  description: string;
  symptoms: string[];
  treatments: string[];
  faqs: { q: string; a: string }[];
}> = {
  "food-allergy": {
    id: "food-allergy",
    icon: Pill,
    title: "אלרגיות מזון",
    subtitle: "אבחון וטיפול מקיף באלרגיות מזון לכל הגילאים",
    description: `אלרגיה למזון היא תגובה של מערכת החיסון למרכיבים מסוימים במזון. התגובה יכולה להופיע תוך דקות עד שעות מאכילת המזון האלרגני ועלולה לנוע מתסמינים קלים ועד לתגובה אנפילקטית מסכנת חיים.

במרפאתנו אנו מתמחים באבחון מדויק של אלרגיות מזון באמצעות בדיקות עור, בדיקות דם ובדיקות פרובוקציה מבוקרות. לאחר האבחון, אנו בונים תוכנית טיפול אישית הכוללת הדרכה תזונתית, תוכניות חשיפה מבוקרת (OIT) במידת הצורך, ותכנון לשעת חירום.`,
    symptoms: [
      "פריחה בעור, גירוד או אורטיקריה (סרפדת)",
      "נפיחות בשפתיים, לשון או גרון",
      "כאבי בטן, בחילות או הקאות",
      "קשיי נשימה או צפצופים",
      "סחרחורת או אובדן הכרה",
      "תגובה אנפילקטית",
    ],
    treatments: [
      "בדיקות אלרגיה מקיפות (עור ודם)",
      "בדיקות פרובוקציה מבוקרות",
      "תוכניות אימונותרפיה פומית (OIT)",
      "הדרכה תזונתית מותאמת אישית",
      "הנחיות לשעת חירום ורישום אפיפן",
      "מעקב תקופתי והערכה מחדש",
    ],
    faqs: [
      { q: "האם אלרגיה למזון יכולה להיעלם?", a: "כן, חלק מאלרגיות המזון בילדות (כמו חלב וביצים) יכולות להיעלם עם הגיל. אלרגיות לאגוזים ודגים נוטות להישאר לאורך החיים." },
      { q: "מהי אימונותרפיה פומית?", a: "זהו טיפול שבו מכניסים לגוף כמויות קטנות ועולות של האלרגן במטרה לבנות סבילות. הטיפול נעשה תחת פיקוח רפואי צמוד." },
      { q: "כמה זמן לוקח לאבחן אלרגיה למזון?", a: "בדיקות עור נותנות תוצאות תוך 15-20 דקות. בדיקות דם לוקחות מספר ימים. בדיקות פרובוקציה מתבצעות במרפאה לאורך מספר שעות." },
    ],
  },
  "asthma": {
    id: "asthma",
    icon: HeartPulse,
    title: "אסתמה",
    subtitle: "טיפול מקיף ומתקדם באסתמה לכל הגילאים",
    description: `אסתמה היא מחלה כרונית של דרכי הנשימה המתבטאת בדלקת ובהיצרות של הסמפונות. הסימפטומים כוללים קוצר נשימה, צפצופים, שיעול ולחץ בחזה, והם יכולים להופיע בעקבות חשיפה לאלרגנים, מאמץ גופני, זיהום אוויר או מצבים רגשיים.

במרפאתנו אנו מציעים הערכה מקיפה של תפקודי ריאות, זיהוי גורמי הטריגר האישיים, ובניית תוכנית טיפול מותאמת. הטיפול משלב תרופות מניעתיות ותרופות הרגעה, יחד עם הדרכה לניהול המחלה ושיפור איכות החיים.`,
    symptoms: [
      "קוצר נשימה, במיוחד בלילה או בבוקר",
      "צפצופים בנשימה",
      "שיעול יבש או עם ליחה",
      "לחץ או כאב בחזה",
      "החמרה בעת מאמץ גופני",
      "התקפים בעקבות חשיפה לאלרגנים",
    ],
    treatments: [
      "בדיקות תפקודי ריאות (ספירומטריה)",
      "זיהוי גורמי טריגר אלרגיים",
      "טיפול תרופתי מותאם אישית",
      "משאפים מניעתיים וטיפוליים",
      "טיפולים ביולוגיים לאסתמה קשה",
      "הדרכה לניהול עצמי של המחלה",
    ],
    faqs: [
      { q: "האם אסתמה נרפאת?", a: "אסתמה היא מחלה כרונית, אך עם טיפול נכון ניתן לשלוט בה ולחיות חיים מלאים ופעילים. בילדים, האסתמה עשויה להשתפר עם הגיל." },
      { q: "האם אפשר לעשות ספורט עם אסתמה?", a: "בהחלט! עם טיפול מתאים, רוב החולים יכולים להיות פעילים גופנית. חשוב להתייעץ עם הרופא לגבי טיפול מניעתי לפני פעילות." },
      { q: "מתי לפנות לחדר מיון?", a: "יש לפנות מיידית אם המשאף לא עוזר, קשיי הנשימה חמורים, השפתיים או הציפורניים מכחילות, או קיים קושי לדבר." },
    ],
  },
  "skin-allergy": {
    id: "skin-allergy",
    icon: Shield,
    title: "מחלות עור אלרגיות",
    subtitle: "אבחון וטיפול במצבי עור אלרגיים ודלקתיים",
    description: `מחלות עור אלרגיות כוללות מגוון רחב של מצבים כמו אטופיק דרמטיטיס (אקזמה), אורטיקריה (סרפדת), דרמטיטיס מגע ואנגיואדמה. מצבים אלה יכולים להשפיע משמעותית על איכות החיים ודורשים טיפול מקצועי.

במרפאתנו אנו מבצעים הערכה מקיפה של מצבי העור, כולל בדיקות אלרגיה רלוונטיות, ובונים תוכנית טיפול הכוללת טיפול תרופתי מקומי ומערכתי, הדרכה לטיפוח העור, וזיהוי והימנעות מגורמים מחמירים.`,
    symptoms: [
      "פריחות וגירוד בעור",
      "אודם ויובש בעור",
      "בועות או נגעים בעור",
      "נפיחות (אנגיואדמה)",
      "סרפדת (אורטיקריה)",
      "החמרה עונתית או לאחר חשיפה",
    ],
    treatments: [
      "בדיקות אלרגיה לזיהוי גורמים",
      "בדיקות מגע (Patch Test)",
      "טיפול בקרמים ומשחות",
      "טיפול תרופתי מערכתי",
      "טיפולים ביולוגיים למקרים קשים",
      "הדרכה לטיפוח והגנה על העור",
    ],
    faqs: [
      { q: "מה ההבדל בין אקזמה לאלרגיה?", a: "אקזמה (אטופיק דרמטיטיס) היא מחלה דלקתית כרונית של העור, שלעיתים קשורה לאלרגיות אך לא תמיד. אלרגיה היא תגובה של מערכת החיסון לחומר ספציפי." },
      { q: "האם אקזמה מדבקת?", a: "לא, אקזמה אינה מחלה מדבקת. היא מצב דלקתי של העור עם מרכיב גנטי וסביבתי." },
      { q: "איך מונעים התפרצויות?", a: "לחות קבועה של העור, הימנעות מחומרים מגרים, הימנעות ממקלחות חמות מדי, ולבוש מבדים טבעיים יכולים לעזור." },
    ],
  },
  "immunology": {
    id: "immunology",
    icon: Stethoscope,
    title: "אימונולוגיה קלינית",
    subtitle: "הערכה וטיפול במחלות של מערכת החיסון",
    description: `האימונולוגיה הקלינית עוסקת באבחון וטיפול במחלות הקשורות למערכת החיסון - החל מחסרים חיסוניים ראשוניים ומשניים, דרך מחלות אוטואימוניות ועד לתגובות יתר של מערכת החיסון.

במרפאתנו אנו מתמחים בהערכה מקיפה של מערכת החיסון, כולל בדיקות מעבדה מתקדמות, ובניית תוכניות טיפול מותאמות. אנו מטפלים בחולים עם זיהומים חוזרים, חסרי נוגדנים, ומחלות אוטואימוניות הקשורות לאלרגיות.`,
    symptoms: [
      "זיהומים חוזרים ונשנים",
      "זיהומים קשים או ממושכים במיוחד",
      "זיהומים על ידי חיידקים לא שכיחים",
      "בעיות ריפוי של פצעים",
      "עייפות כרונית בלתי מוסברת",
      "היסטוריה משפחתית של חסרים חיסוניים",
    ],
    treatments: [
      "הערכה מקיפה של מערכת החיסון",
      "בדיקות תפקוד חיסוני מתקדמות",
      "טיפול בעירויי אימונוגלובולינים",
      "טיפולים אימונומודולטוריים",
      "ייעוץ גנטי במידת הצורך",
      "מעקב וניהול ארוך טווח",
    ],
    faqs: [
      { q: "מהו חסר חיסוני?", a: "חסר חיסוני הוא מצב שבו מערכת החיסון אינה מתפקדת כראוי. יכול להיות מולד (ראשוני) או נרכש (משני) כתוצאה ממחלות או טיפולים." },
      { q: "איך מאבחנים בעיה חיסונית?", a: "האבחנה כוללת היסטוריה רפואית מפורטת, בדיקות דם לרמות נוגדנים ותאי דם לבנים, ובדיקות תפקוד ספציפיות." },
      { q: "האם בעיות חיסוניות ניתנות לטיפול?", a: "רבות מהבעיות החיסוניות ניתנות לטיפול יעיל. הטיפול תלוי בסוג הבעיה ויכול לכלול עירויי נוגדנים, תרופות או במקרים מסוימים השתלת מח עצם." },
    ],
  },
  "children-allergy": {
    id: "children-allergy",
    icon: Baby,
    title: "אלרגיות ילדים",
    subtitle: "התמחות באלרגיות בגיל הרך והילדות",
    description: `אלרגיות בילדים הן תופעה שכיחה הדורשת התייחסות מיוחדת. ילדים יכולים לפתח אלרגיות למזון (חלב, ביצים, אגוזים), אלרגיות נשימתיות, אסתמה ומצבי עור אלרגיים. האבחון והטיפול בילדים דורשים גישה מותאמת לגיל ולצרכים המיוחדים שלהם.

במרפאתנו אנו מתמחים באבחון וטיפול באלרגיות ילדים מגיל הינקות ועד גיל ההתבגרות. אנו מציעים סביבה ידידותית לילדים, בדיקות מותאמות גיל, ותמיכה להורים בניהול האלרגיות של ילדיהם.`,
    symptoms: [
      "תגובות לאחר אכילת מזונות חדשים",
      "פריחות ואקזמה חוזרות",
      "צפצופים או שיעול חוזר",
      "נזלת וגודש אף כרוניים",
      "כאבי בטן לאחר אכילה",
      "עיניים מגרדות ודומעות",
    ],
    treatments: [
      "בדיקות אלרגיה מותאמות לילדים",
      "תוכניות הכנסת מזונות אלרגניים",
      "טיפול באסתמה של הילדות",
      "הדרכה להורים ולמסגרות חינוכיות",
      "תוכניות אימונותרפיה לילדים",
      "מעקב התפתחותי וצמיחה",
    ],
    faqs: [
      { q: "מתי להתחיל להכניס מזונות אלרגניים?", a: "ההמלצות העדכניות מעודדות הכנסה מוקדמת של מזונות אלרגניים (בוטנים, ביצים) סביב גיל 4-6 חודשים, במיוחד בתינוקות בסיכון. יש להתייעץ עם הרופא." },
      { q: "האם הילד יגדל מהאלרגיה?", a: "חלק מהאלרגיות בילדות נעלמות עם הגיל. אלרגיות לחלב וביצים נעלמות לעיתים קרובות, בעוד אלרגיות לאגוזים נוטות להישאר." },
      { q: "איך מנהלים אלרגיה בגן או בבית ספר?", a: "חשוב ליידע את המסגרת, להכין תוכנית חירום, לוודא שיש אפיפן זמין, ולהדריך את הצוות לזהות תגובות אלרגיות." },
    ],
  },
  "adult-allergy": {
    id: "adult-allergy",
    icon: Users,
    title: "אלרגיות מבוגרים",
    subtitle: "טיפול באלרגיות עונתיות, תרופות ועקיצות",
    description: `אלרגיות במבוגרים יכולות להופיע בכל גיל ולהשפיע משמעותית על איכות החיים. הן כוללות אלרגיות עונתיות (קדחת השחת), אלרגיות לתרופות, אלרגיות לעקיצות חרקים, ונזלת אלרגית כרונית.

במרפאתנו אנו מציעים הערכה מקיפה של אלרגיות במבוגרים, כולל בדיקות אלרגיה מתקדמות ובניית תוכניות טיפול מותאמות. אנו מתמחים גם באימונותרפיה (חיסוני אלרגיה) שיכולה להציע פתרון ארוך טווח לאלרגיות נשימתיות ולאלרגיות לעקיצות.`,
    symptoms: [
      "נזלת, עיטוש וגירוד באף",
      "עיניים אדומות, מגרדות ודומעות",
      "גודש באף ונזילה",
      "תגובות לאחר נטילת תרופות",
      "נפיחות או כאב לאחר עקיצת חרק",
      "תסמינים עונתיים חוזרים",
    ],
    treatments: [
      "בדיקות אלרגיה מקיפות",
      "טיפול תרופתי לאלרגיות עונתיות",
      "אימונותרפיה (חיסוני אלרגיה)",
      "חיסון נגד אלרגיה לעקיצות",
      "הערכת אלרגיה לתרופות",
      "טיפול בנזלת כרונית",
    ],
    faqs: [
      { q: "האם אפשר לפתח אלרגיה בגיל מבוגר?", a: "כן, אלרגיות יכולות להופיע בכל גיל. לעיתים אלרגיות מתפתחות לאחר מעבר למקום מגורים חדש, שינויים הורמונליים או שינויים במערכת החיסון." },
      { q: "מהי אימונותרפיה וכמה זמן היא לוקחת?", a: "אימונותרפיה היא טיפול שמלמד את מערכת החיסון לסבול אלרגנים. הטיפול נמשך 3-5 שנים אך יכול להציע הקלה ארוכת טווח." },
      { q: "איך יודעים אם יש אלרגיה לתרופה?", a: "אלרגיה לתרופות יכולה להתבטא בפריחה, נפיחות, קשיי נשימה או תגובות אחרות. חשוב לתעד תגובות ולהתייעץ עם אלרגולוג להערכה מקיפה." },
    ],
  },
};

export default function ServiceDetail() {
  const params = useParams();
  const serviceId = params.id as string;
  const service = servicesData[serviceId];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">השירות לא נמצא</h1>
          <Link href="/">
            <Button>
              <ArrowRight className="ml-2 h-4 w-4" />
              חזרה לעמוד הראשי
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const ServiceIcon = service.icon;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back-home">
              <ArrowRight className="ml-2 h-4 w-4" />
              חזרה לעמוד הראשי
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href="/#contact">
              <Button variant="outline" size="sm" data-testid="button-header-contact">
                <Phone className="ml-2 h-4 w-4" />
                צור קשר
              </Button>
            </Link>
            <Link href="/#contact">
              <Button size="sm" data-testid="button-header-appointment">
                <Calendar className="ml-2 h-4 w-4" />
                קביעת תור
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
              <ServiceIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-service-title">
                {service.title}
              </h1>
              <p className="text-muted-foreground text-lg">{service.subtitle}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>אודות השירות</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-lg max-w-none text-muted-foreground whitespace-pre-line">
                    {service.description}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>תסמינים שכיחים</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>שאלות נפוצות</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {service.faqs.map((faq, index) => (
                    <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                      <h4 className="font-semibold mb-2">{faq.q}</h4>
                      <p className="text-muted-foreground">{faq.a}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    קביעת תור
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    מעוניינים להתייעץ עם ד״ר אנה ברמלי? קבעו תור עוד היום.
                  </p>
                  <Link href="/#contact">
                    <Button className="w-full" data-testid="button-book-appointment">
                      קביעת תור
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>או התקשרו: 03-1234567</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>השירותים שלנו</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.treatments.map((treatment, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{treatment}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-muted py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            ד״ר אנה ברמלי - מרפאה לאלרגיה ואימונולוגיה
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            כל הזכויות שמורות 2024
          </p>
        </div>
      </footer>
    </div>
  );
}
