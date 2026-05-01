"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Save,
  X,
  Image as ImageIcon,
} from "lucide-react";
import {
  getDesigns,
  createDesign,
  updateDesign,
  deleteDesign,
} from "@/lib/actions/designs";
import { categories } from "@/lib/data";
import Link from "next/link";

interface Design {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  tags: string[];
  featured: boolean;
  active: boolean;
  created_at: string;
}

const emptyForm = {
  name: "",
  slug: "",
  category: "wedding",
  price: 99,
  description: "",
  imageUrl: "",
  tags: [] as string[],
  featured: false,
  active: true,
};

export default function AdminDesignsPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadDesigns();
  }, []);

  async function loadDesigns() {
    const result = await getDesigns();
    if (result.designs) {
      setDesigns(result.designs as Design[]);
    }
    setLoading(false);
  }

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (editingId) {
      const result = await updateDesign(editingId, form);
      if (result.error) {
        setError(result.error);
        return;
      }
    } else {
      const result = await createDesign(form);
      if (result.error) {
        setError(result.error);
        return;
      }
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    loadDesigns();
  };

  const handleEdit = (design: Design) => {
    setForm({
      name: design.name,
      slug: design.slug,
      category: design.category,
      price: design.price,
      description: design.description,
      imageUrl: design.image_url,
      tags: design.tags || [],
      featured: design.featured,
      active: design.active,
    });
    setEditingId(design.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this design?")) return;
    const result = await deleteDesign(id);
    if (result.error) {
      setError(result.error);
      return;
    }
    loadDesigns();
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream pt-20">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-24 min-h-screen bg-cream">
      <section className="gradient-dark py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Link
                  href="/admin"
                  className="text-text-muted hover:text-text-light text-sm transition-colors"
                >
                  Dashboard
                </Link>
                <span className="text-text-muted/50">/</span>
                <span className="text-text-light text-sm">Designs</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-light">
                Manage Designs
              </h1>
              <p className="text-text-muted mt-1">
                {designs.length} design{designs.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => {
                setForm(emptyForm);
                setEditingId(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-full hover:bg-accent-dark transition-colors"
            >
              <Plus size={16} />
              Add Design
            </button>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {showForm && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-accent/10 shadow-sm p-6 mb-8 space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-heading text-lg font-semibold text-primary">
                  {editingId ? "Edit Design" : "Add New Design"}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="p-1 text-text-muted hover:text-primary"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-primary mb-1 block">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-accent/20 bg-cream/50 text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                    placeholder="Design name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-primary mb-1 block">
                    Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) =>
                      setForm({ ...form, slug: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-accent/20 bg-cream/50 text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                    placeholder="design-slug"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-primary mb-1 block">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-accent/20 bg-cream/50 text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-primary mb-1 block">
                    Price (SAR)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-accent/20 bg-cream/50 text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-primary mb-1 block">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-accent/20 bg-cream/50 text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
                  placeholder="Design description"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-primary mb-1 block">
                  Image URL
                </label>
                <div className="flex items-center gap-2">
                  <ImageIcon size={16} className="text-accent" />
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm({ ...form, imageUrl: e.target.value })
                    }
                    className="flex-1 px-4 py-2.5 rounded-xl border border-accent/20 bg-cream/50 text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-primary mb-1 block">
                  Tags
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-accent/20 bg-cream/50 text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                    placeholder="Add tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2.5 bg-accent/10 text-accent rounded-xl text-sm hover:bg-accent/20 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent/10 text-accent text-xs rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-accent-dark"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({ ...form, featured: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-accent/30 text-accent focus:ring-accent/30"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) =>
                      setForm({ ...form, active: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-accent/30 text-accent focus:ring-accent/30"
                  />
                  Active
                </label>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full py-3 bg-accent text-white font-medium rounded-full hover:bg-accent-dark transition-colors"
              >
                <Save size={16} />
                {editingId ? "Update Design" : "Create Design"}
              </button>
            </motion.form>
          )}

          {designs.length === 0 && !showForm ? (
            <div className="text-center py-16">
              <ImageIcon
                size={48}
                className="mx-auto text-text-muted/30 mb-4"
              />
              <p className="text-text-muted mb-2">No designs in database yet</p>
              <p className="text-sm text-text-muted/70">
                Static designs from the catalog are still shown to users. Add
                designs here to manage them from the admin panel.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {designs.map((design) => (
                <motion.div
                  key={design.id}
                  layout
                  className="bg-white rounded-2xl border border-accent/10 shadow-sm overflow-hidden"
                >
                  {design.image_url ? (
                    <div className="h-40 bg-gradient-to-br from-accent/10 to-accent/5 relative">
                      <Image
                        src={design.image_url}
                        alt={design.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
                      <ImageIcon size={32} className="text-accent/30" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-primary">
                          {design.name}
                        </h3>
                        <p className="text-xs text-text-muted">
                          {design.category} · SAR {design.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {design.featured && (
                          <Star
                            size={14}
                            className="text-yellow-500 fill-yellow-500"
                          />
                        )}
                        {design.active ? (
                          <Eye size={14} className="text-green-500" />
                        ) : (
                          <EyeOff size={14} className="text-red-400" />
                        )}
                      </div>
                    </div>
                    {design.tags && design.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {design.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-accent/5 text-accent text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(design)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 text-sm bg-accent/10 text-accent rounded-xl hover:bg-accent/20 transition-colors"
                      >
                        <Edit2 size={13} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(design.id)}
                        className="flex items-center justify-center gap-1 py-2 px-3 text-sm bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
