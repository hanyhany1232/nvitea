export interface Category {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  icon: string;
  image: string;
  count: number;
}

export interface Design {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  featured: boolean;
  description: string;
  tags: string[];
}

export const categories: Category[] = [
  {
    id: "wedding",
    name: "Wedding",
    nameAr: "زفاف",
    description: "Elegant wedding invitations for your special day",
    icon: "💍",
    image: "/images/categories/wedding.jpg",
    count: 24,
  },
  {
    id: "engagement",
    name: "Engagement",
    nameAr: "خطوبة",
    description: "Beautiful engagement party invitations",
    icon: "💎",
    image: "/images/categories/engagement.jpg",
    count: 18,
  },
  {
    id: "birthday",
    name: "Birthday",
    nameAr: "عيد ميلاد",
    description: "Fun and elegant birthday invitations",
    icon: "🎂",
    image: "/images/categories/birthday.jpg",
    count: 32,
  },
  {
    id: "graduation",
    name: "Graduation",
    nameAr: "تخرج",
    description: "Celebrate academic achievements",
    icon: "🎓",
    image: "/images/categories/graduation.jpg",
    count: 15,
  },
  {
    id: "baby-shower",
    name: "Baby Shower",
    nameAr: "استقبال مولود",
    description: "Sweet baby shower invitations",
    icon: "👶",
    image: "/images/categories/baby-shower.jpg",
    count: 20,
  },
  {
    id: "corporate",
    name: "Corporate",
    nameAr: "فعاليات",
    description: "Professional corporate event invitations",
    icon: "🏢",
    image: "/images/categories/corporate.jpg",
    count: 12,
  },
  {
    id: "private",
    name: "Private Events",
    nameAr: "مناسبات خاصة",
    description: "Custom invitations for private occasions",
    icon: "✨",
    image: "/images/categories/private.jpg",
    count: 10,
  },
];

export const designs: Design[] = [
  {
    id: "royal-gold-wedding",
    name: "Royal Gold",
    category: "wedding",
    price: 149,
    image: "/images/designs/wedding-1.jpg",
    featured: true,
    description: "A luxurious gold-themed wedding invitation with elegant typography",
    tags: ["luxury", "gold", "classic"],
  },
  {
    id: "blush-floral-wedding",
    name: "Blush Floral",
    category: "wedding",
    price: 129,
    image: "/images/designs/wedding-2.jpg",
    featured: true,
    description: "Soft blush tones with delicate floral arrangements",
    tags: ["floral", "romantic", "soft"],
  },
  {
    id: "modern-minimal-wedding",
    name: "Modern Minimal",
    category: "wedding",
    price: 99,
    image: "/images/designs/wedding-3.jpg",
    featured: false,
    description: "Clean and contemporary minimalist design",
    tags: ["modern", "minimal", "clean"],
  },
  {
    id: "emerald-engagement",
    name: "Emerald Night",
    category: "engagement",
    price: 119,
    image: "/images/designs/engagement-1.jpg",
    featured: true,
    description: "Deep emerald tones with sparkling accents",
    tags: ["emerald", "elegant", "night"],
  },
  {
    id: "rose-garden-engagement",
    name: "Rose Garden",
    category: "engagement",
    price: 109,
    image: "/images/designs/engagement-2.jpg",
    featured: false,
    description: "Romantic rose garden themed invitation",
    tags: ["roses", "garden", "romantic"],
  },
  {
    id: "confetti-birthday",
    name: "Confetti Blast",
    category: "birthday",
    price: 79,
    image: "/images/designs/birthday-1.jpg",
    featured: true,
    description: "Vibrant and fun confetti-themed birthday invitation",
    tags: ["fun", "colorful", "party"],
  },
  {
    id: "elegant-birthday",
    name: "Golden Age",
    category: "birthday",
    price: 89,
    image: "/images/designs/birthday-2.jpg",
    featured: false,
    description: "Sophisticated birthday invitation for milestone celebrations",
    tags: ["elegant", "milestone", "gold"],
  },
  {
    id: "cap-gown-graduation",
    name: "Cap & Gown",
    category: "graduation",
    price: 89,
    image: "/images/designs/graduation-1.jpg",
    featured: true,
    description: "Classic graduation celebration invitation",
    tags: ["academic", "classic", "achievement"],
  },
  {
    id: "sweet-dreams-baby",
    name: "Sweet Dreams",
    category: "baby-shower",
    price: 89,
    image: "/images/designs/baby-1.jpg",
    featured: true,
    description: "Adorable pastel baby shower invitation",
    tags: ["pastel", "cute", "soft"],
  },
  {
    id: "corporate-summit",
    name: "Summit",
    category: "corporate",
    price: 199,
    image: "/images/designs/corporate-1.jpg",
    featured: false,
    description: "Professional corporate event invitation",
    tags: ["professional", "clean", "business"],
  },
];

export const featuredDesigns = designs.filter((d) => d.featured);

export function getDesignsByCategory(categoryId: string): Design[] {
  return designs.filter((d) => d.category === categoryId);
}

export function getDesignById(id: string): Design | undefined {
  return designs.find((d) => d.id === id);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
