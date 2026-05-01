import Link from "next/link";
import { type Design, getCategoryById } from "@/lib/data";

export function DesignCard({ design }: { design: Design }) {
  const category = getCategoryById(design.category);

  return (
    <Link
      href={`/order?design=${design.id}`}
      className="group block glass-card-light rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-accent/10 transition-all duration-300"
    >
      <div className="aspect-[4/5] bg-gradient-to-br from-accent/5 to-accent/20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <span className="text-2xl">{category?.icon || "✉️"}</span>
            </div>
            <p className="font-heading text-xl font-semibold text-primary/80">
              {design.name}
            </p>
            <p className="text-sm text-text-muted mt-1">{category?.name}</p>
          </div>
        </div>
        <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors duration-300" />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-heading text-lg font-semibold text-primary group-hover:text-accent transition-colors">
              {design.name}
            </h3>
            <p className="text-sm text-text-muted mt-1">{design.description}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-accent">
            SAR {design.price}
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
            {category?.name}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {design.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-primary/5 text-primary/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
