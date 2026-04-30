import { categories, getDesignsByCategory, getCategoryById } from "@/lib/data";
import { DesignCard } from "@/components/ui/DesignCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.id }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categoryId } = await params;
  const category = getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  const categoryDesigns = getDesignsByCategory(categoryId);

  return (
    <div className="pt-20 sm:pt-24">
      <section className="gradient-dark py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/designs"
            className="inline-flex items-center gap-2 text-text-muted hover:text-accent mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to All Designs
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-5xl">{category.icon}</span>
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-text-light">
                {category.name} Invitations
              </h1>
              <p className="mt-2 text-text-muted text-lg">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categoryDesigns.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {categoryDesigns.map((design) => (
                <DesignCard key={design.id} design={design} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-text-muted text-lg">
                New designs coming soon for this category!
              </p>
              <Link
                href="/order"
                className="mt-4 inline-flex items-center gap-2 text-accent hover:underline"
              >
                Request a custom design instead
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
