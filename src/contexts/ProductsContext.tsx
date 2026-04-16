import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { genId, slugify } from "@/lib/products-utils";

export type LessonType = "video" | "text" | "quiz" | "live";

export interface Material {
  id: string;
  name: string;
  data: string; // base64 or URL
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  videoUrl: string;
  content: string;
  duration: string;
  status: "draft" | "published";
  materials: Material[];
}

export interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Benefit {
  id: string;
  text: string;
}
export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface DraftProduct {
  // Step 1
  name: string;
  tagline: string;
  description: string;
  type: string;
  category: string;
  thumbnail: string | null;
  videoUrl: string;
  // Step 2
  price: number;
  originalPrice: number | null;
  paymentType: "single" | "recurring";
  installments: { enabled: boolean; max: number };
  guarantee: { enabled: boolean; days: number };
  // Step 3
  course: { modules: Module[] };
  // Step 4
  salesPage: {
    headline: string;
    subheadline: string;
    ctaText: string;
    showBenefits: boolean;
    benefits: Benefit[];
    showGuarantee: boolean;
    showFaq: boolean;
    faq: FaqItem[];
  };
  // Step 5
  checkout: {
    methods: { pix: boolean; card: boolean; boleto: boolean };
    maxInstallments: number;
    buttonText: string;
    guaranteeText: string;
  };
  // Step 6
  postPurchase: {
    successMessage: string;
    redirectEnabled: boolean;
    redirectUrl: string;
    emailEnabled: boolean;
    welcomeEmail: string;
  };
  // Meta
  id: string | null;
  slug: string | null;
  url: string | null;
  status: "draft" | "published" | "archived";
  createdAt: string | null;
  publishedAt: string | null;
  analytics: {
    visits: number;
    sales: number;
    revenue: number;
    conversionRate: number;
  };
}

export interface Product extends DraftProduct {
  id: string;
  slug: string;
  url: string;
  createdAt: string;
}

const STORAGE_KEY = "mentoria_products";

const initialMocks: Product[] = [
  {
    id: "p_mock_1", name: "Programa PATRON", tagline: "Mentoria de alto ticket", description: "", type: "Mentoria",
    category: "", thumbnail: null, videoUrl: "",
    price: 997, originalPrice: 1497, paymentType: "single",
    installments: { enabled: true, max: 12 }, guarantee: { enabled: true, days: 7 },
    course: { modules: [] },
    salesPage: { headline: "", subheadline: "", ctaText: "Quero me inscrever", showBenefits: true, benefits: [], showGuarantee: true, showFaq: true, faq: [] },
    checkout: { methods: { pix: true, card: true, boleto: false }, maxInstallments: 12, buttonText: "Finalizar compra", guaranteeText: "" },
    postPurchase: { successMessage: "", redirectEnabled: false, redirectUrl: "", emailEnabled: false, welcomeEmail: "" },
    slug: "programa-patron", url: "/checkout/programa-patron",
    status: "published", createdAt: new Date().toISOString(), publishedAt: new Date().toISOString(),
    analytics: { visits: 410, sales: 34, revenue: 33966, conversionRate: 8.2 },
  },
  {
    id: "p_mock_2", name: "Curso Identidade Restaurada", tagline: "Descubra seu potencial", description: "", type: "Curso",
    category: "", thumbnail: null, videoUrl: "",
    price: 199, originalPrice: null, paymentType: "single",
    installments: { enabled: true, max: 12 }, guarantee: { enabled: true, days: 7 },
    course: { modules: [] },
    salesPage: { headline: "", subheadline: "", ctaText: "Quero me inscrever", showBenefits: true, benefits: [], showGuarantee: true, showFaq: true, faq: [] },
    checkout: { methods: { pix: true, card: true, boleto: false }, maxInstallments: 12, buttonText: "Finalizar compra", guaranteeText: "" },
    postPurchase: { successMessage: "", redirectEnabled: false, redirectUrl: "", emailEnabled: false, welcomeEmail: "" },
    slug: "identidade-restaurada", url: "/checkout/identidade-restaurada",
    status: "published", createdAt: new Date().toISOString(), publishedAt: new Date().toISOString(),
    analytics: { visits: 645, sales: 78, revenue: 15522, conversionRate: 12.1 },
  },
  {
    id: "p_mock_3", name: "Bundle Premium Completo", tagline: "Todos os cursos", description: "", type: "Bundle",
    category: "", thumbnail: null, videoUrl: "",
    price: 1990, originalPrice: 2990, paymentType: "single",
    installments: { enabled: true, max: 12 }, guarantee: { enabled: true, days: 15 },
    course: { modules: [] },
    salesPage: { headline: "", subheadline: "", ctaText: "Quero me inscrever", showBenefits: true, benefits: [], showGuarantee: true, showFaq: true, faq: [] },
    checkout: { methods: { pix: true, card: true, boleto: false }, maxInstallments: 12, buttonText: "Finalizar compra", guaranteeText: "" },
    postPurchase: { successMessage: "", redirectEnabled: false, redirectUrl: "", emailEnabled: false, welcomeEmail: "" },
    slug: "bundle-premium", url: "/checkout/bundle-premium",
    status: "draft", createdAt: new Date().toISOString(), publishedAt: null,
    analytics: { visits: 350, sales: 12, revenue: 23880, conversionRate: 3.4 },
  },
  {
    id: "p_mock_4", name: "Imersão Presencial VIP", tagline: "2 dias intensivos", description: "", type: "Imersão",
    category: "", thumbnail: null, videoUrl: "",
    price: 2497, originalPrice: null, paymentType: "single",
    installments: { enabled: true, max: 12 }, guarantee: { enabled: true, days: 7 },
    course: { modules: [] },
    salesPage: { headline: "", subheadline: "", ctaText: "Quero me inscrever", showBenefits: true, benefits: [], showGuarantee: true, showFaq: true, faq: [] },
    checkout: { methods: { pix: true, card: true, boleto: false }, maxInstallments: 12, buttonText: "Finalizar compra", guaranteeText: "" },
    postPurchase: { successMessage: "", redirectEnabled: false, redirectUrl: "", emailEnabled: false, welcomeEmail: "" },
    slug: "imersao-vip", url: "/checkout/imersao-vip",
    status: "published", createdAt: new Date().toISOString(), publishedAt: new Date().toISOString(),
    analytics: { visits: 140, sales: 8, revenue: 19976, conversionRate: 5.7 },
  },
  {
    id: "p_mock_5", name: "Assinatura Mensal Comunidade", tagline: "Acesso à comunidade", description: "", type: "Assinatura",
    category: "", thumbnail: null, videoUrl: "",
    price: 47, originalPrice: null, paymentType: "recurring",
    installments: { enabled: false, max: 1 }, guarantee: { enabled: true, days: 7 },
    course: { modules: [] },
    salesPage: { headline: "", subheadline: "", ctaText: "Assinar agora", showBenefits: true, benefits: [], showGuarantee: true, showFaq: true, faq: [] },
    checkout: { methods: { pix: true, card: true, boleto: false }, maxInstallments: 1, buttonText: "Assinar", guaranteeText: "" },
    postPurchase: { successMessage: "", redirectEnabled: false, redirectUrl: "", emailEnabled: false, welcomeEmail: "" },
    slug: "assinatura-comunidade", url: "/checkout/assinatura-comunidade",
    status: "published", createdAt: new Date().toISOString(), publishedAt: new Date().toISOString(),
    analytics: { visits: 850, sales: 156, revenue: 7332, conversionRate: 18.4 },
  },
];

export function emptyDraft(): DraftProduct {
  return {
    name: "", tagline: "", description: "", type: "Curso Online", category: "",
    thumbnail: null, videoUrl: "",
    price: 0, originalPrice: null, paymentType: "single",
    installments: { enabled: true, max: 12 },
    guarantee: { enabled: true, days: 7 },
    course: { modules: [] },
    salesPage: {
      headline: "", subheadline: "", ctaText: "Quero me inscrever",
      showBenefits: true, benefits: [], showGuarantee: true, showFaq: true, faq: [],
    },
    checkout: {
      methods: { pix: true, card: true, boleto: false },
      maxInstallments: 12, buttonText: "Finalizar compra", guaranteeText: "Garantia incondicional",
    },
    postPurchase: {
      successMessage: "Sua compra foi confirmada! Em instantes você receberá o acesso por e-mail.",
      redirectEnabled: false, redirectUrl: "", emailEnabled: true,
      welcomeEmail: "Olá! Seja bem-vindo(a). Seu acesso já está liberado.",
    },
    id: null, slug: null, url: null, status: "draft",
    createdAt: null, publishedAt: null,
    analytics: { visits: 0, sales: 0, revenue: 0, conversionRate: 0 },
  };
}

interface ProductsCtx {
  products: Product[];
  draft: DraftProduct;
  visitedSteps: number[];
  currentStep: number;
  setCurrentStep: (n: number) => void;
  markVisited: (n: number) => void;
  updateDraft: (patch: Partial<DraftProduct>) => void;
  resetDraft: () => void;
  saveDraft: () => Product;
  publishDraft: () => Product;
  loadProductIntoDraft: (id: string) => void;
  deleteProduct: (id: string) => void;
}

const Ctx = createContext<ProductsCtx | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return initialMocks;
  });
  const [draft, setDraft] = useState<DraftProduct>(emptyDraft());
  const [visitedSteps, setVisitedSteps] = useState<number[]>([1]);
  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {}
  }, [products]);

  const updateDraft = useCallback((patch: Partial<DraftProduct>) => {
    setDraft((d) => ({ ...d, ...patch }));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(emptyDraft());
    setVisitedSteps([1]);
    setCurrentStep(1);
  }, []);

  const markVisited = useCallback((n: number) => {
    setVisitedSteps((v) => (v.includes(n) ? v : [...v, n]));
  }, []);

  const buildProductFromDraft = (status: "draft" | "published"): Product => {
    const id = draft.id ?? genId("prod");
    const slug = slugify(draft.name || "produto") || `produto-${Date.now()}`;
    const url = `/checkout/${slug}`;
    const now = new Date().toISOString();
    return {
      ...draft,
      id,
      slug,
      url,
      status,
      createdAt: draft.createdAt ?? now,
      publishedAt: status === "published" ? now : draft.publishedAt,
    };
  };

  const upsertProduct = (p: Product) => {
    setProducts((list) => {
      const exists = list.some((x) => x.id === p.id);
      return exists ? list.map((x) => (x.id === p.id ? p : x)) : [p, ...list];
    });
  };

  const saveDraft = useCallback((): Product => {
    const p = buildProductFromDraft("draft");
    upsertProduct(p);
    return p;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const publishDraft = useCallback((): Product => {
    const p = buildProductFromDraft("published");
    upsertProduct(p);
    return p;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const loadProductIntoDraft = useCallback(
    (id: string) => {
      const p = products.find((x) => x.id === id);
      if (!p) return;
      setDraft({ ...p });
      setVisitedSteps([1, 2, 3, 4, 5, 6, 7]);
      setCurrentStep(1);
    },
    [products],
  );

  const deleteProduct = useCallback((id: string) => {
    setProducts((list) => list.filter((p) => p.id !== id));
  }, []);

  return (
    <Ctx.Provider
      value={{
        products, draft, visitedSteps, currentStep,
        setCurrentStep, markVisited, updateDraft, resetDraft,
        saveDraft, publishDraft, loadProductIntoDraft, deleteProduct,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProducts must be used inside ProductsProvider");
  return ctx;
}
