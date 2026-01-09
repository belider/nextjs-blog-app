import Link from "next/link";
import { articles } from "./data/articles";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="pt-16 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-[family-name:var(--font-fraunces)] text-5xl md:text-6xl font-medium text-foreground mb-4 tracking-tight">
            Блуждающие мысли
          </h1>
          <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Эссе о медленной жизни, творчестве и поиске смысла в обыденном.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted">
            <span className="w-12 h-px bg-border"></span>
            <span>Мария</span>
            <span className="w-12 h-px bg-border"></span>
          </div>
        </div>
      </header>

      {/* Articles Grid */}
      <main className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article, index) => (
              <Link
                key={article.slug}
                href={`/article/${article.slug}`}
                className={`group block bg-card-bg rounded-2xl p-6 border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1 ${
                  index === 0 ? "md:col-span-2" : ""
                }`}
              >
                <article>
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl" role="img" aria-label={article.category}>
                      {article.coverEmoji}
                    </span>
                    <span className="text-xs font-medium text-accent bg-accent-light px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                  <h2 className={`font-[family-name:var(--font-fraunces)] font-medium text-foreground group-hover:text-accent transition-colors duration-200 mb-3 ${
                    index === 0 ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
                  }`}>
                    {article.title}
                  </h2>
                  <p className={`text-muted leading-relaxed mb-4 ${
                    index === 0 ? "text-base md:text-lg" : "text-sm md:text-base"
                  }`}>
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span>{article.date}</span>
                    <span className="w-1 h-1 rounded-full bg-border"></span>
                    <span>{article.readTime}</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted">
          <p>Написано с ☕ и тихим созерцанием</p>
        </div>
      </footer>
    </div>
  );
}
