import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticleBySlug } from "../../data/articles";

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  
  if (!article) {
    return { title: "Статья не найдена" };
  }

  return {
    title: `${article.title} | Блуждающие мысли`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const lines = content.trim().split("\n");
    const elements: React.ReactNode[] = [];
    let currentParagraph: string[] = [];
    let inList = false;
    let listItems: string[] = [];

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(" ");
        elements.push(
          <p key={elements.length} className="mb-6 leading-relaxed">
            {renderInlineFormatting(text)}
          </p>
        );
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={elements.length} className="mb-6 space-y-2 pl-6">
            {listItems.map((item, i) => (
              <li key={i} className="relative before:content-['•'] before:absolute before:-left-4 before:text-accent">
                {renderInlineFormatting(item)}
              </li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    const renderInlineFormatting = (text: string): React.ReactNode => {
      // Handle bold and italic
      const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i} className="italic">{part.slice(1, -1)}</em>;
        }
        return part;
      });
    };

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      // Empty line
      if (trimmedLine === "") {
        flushList();
        flushParagraph();
        return;
      }

      // H2 heading
      if (trimmedLine.startsWith("## ")) {
        flushList();
        flushParagraph();
        elements.push(
          <h2 key={elements.length} className="font-[family-name:var(--font-fraunces)] text-2xl font-medium text-foreground mt-10 mb-4">
            {trimmedLine.slice(3)}
          </h2>
        );
        return;
      }

      // List item
      if (trimmedLine.startsWith("- ")) {
        flushParagraph();
        inList = true;
        listItems.push(trimmedLine.slice(2));
        return;
      }

      // Regular text
      if (inList) {
        flushList();
      }
      currentParagraph.push(trimmedLine);
    });

    flushList();
    flushParagraph();

    return elements;
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors duration-200 text-sm"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Все статьи
          </Link>
        </div>
      </nav>

      {/* Article Header */}
      <header className="px-6 pt-8 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">{article.coverEmoji}</span>
            <span className="text-xs font-medium text-accent bg-accent-light px-3 py-1 rounded-full">
              {article.category}
            </span>
          </div>
          <h1 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-5xl font-medium text-foreground mb-6 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span>{article.date}</span>
            <span className="w-1 h-1 rounded-full bg-border"></span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg text-foreground/90">
            {renderContent(article.content)}
          </div>
        </div>
      </main>

      {/* Article Footer */}
      <footer className="border-t border-border">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <p className="text-muted text-sm mb-4">Спасибо за чтение ✨</p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-accent hover:underline font-medium"
            >
              ← Ещё статьи
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
