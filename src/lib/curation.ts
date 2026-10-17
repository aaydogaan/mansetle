import type { LiveArticle } from "@/lib/news";

export interface CuratedHomepage {
  centerRotatingStories: LiveArticle[];
  leftStory1: LiveArticle | null;
  leftStory2: LiveArticle | null;
  rightStory1: LiveArticle | null;
  rightStory2: LiveArticle | null;
  latestNews: LiveArticle[];
  editorsPick: LiveArticle | null;
  editorsGrid: LiveArticle[];
  catLeftGundemEkonomi: LiveArticle[];
  catRightSpor: LiveArticle[];
  techShowcase: LiveArticle[];
  moreNews: LiveArticle[];
}

/**
 * Editorial Curation Engine
 * 
 * Prevents any single high-frequency RSS source (e.g. 20 NTV Teknoloji items in a row)
 * from hijacking the entire homepage. Ensures professional category diversity across
 * the Hero banner, side columns, latest news grid, and editor's picks, while giving
 * high-volume beats like Technology and Sports their own dedicated showcases.
 */
export function curateHomepage(rawItems: LiveArticle[]): CuratedHomepage {
  if (!rawItems || rawItems.length === 0) {
    return {
      centerRotatingStories: [],
      leftStory1: null,
      leftStory2: null,
      rightStory1: null,
      rightStory2: null,
      latestNews: [],
      editorsPick: null,
      editorsGrid: [],
      catLeftGundemEkonomi: [],
      catRightSpor: [],
      techShowcase: [],
      moreNews: [],
    };
  }

  const usedSlugs = new Set<string>();

  // Helper to pick items with strict category diversity
  const pickDiverse = (
    count: number,
    maxPerCategory = 1,
    priorityCategories?: string[]
  ): LiveArticle[] => {
    const selected: LiveArticle[] = [];
    const catCounts: Record<string, number> = {};

    const available = rawItems.filter((item) => !usedSlugs.has(item.slug));

    // Phase 1: Try to pick from priority categories first (if provided)
    if (priorityCategories && priorityCategories.length > 0) {
      for (const cat of priorityCategories) {
        if (selected.length >= count) break;
        const candidate = available.find(
          (item) =>
            item.category === cat &&
            !selected.some((s) => s.slug === item.slug) &&
            (catCounts[cat] ?? 0) < maxPerCategory
        );
        if (candidate) {
          selected.push(candidate);
          catCounts[cat] = (catCounts[cat] ?? 0) + 1;
        }
      }
    }

    // Phase 2: Pick from remaining available respecting maxPerCategory
    for (const item of available) {
      if (selected.length >= count) break;
      if (selected.some((s) => s.slug === item.slug)) continue;

      const currentCatCount = catCounts[item.category] ?? 0;
      if (currentCatCount < maxPerCategory) {
        selected.push(item);
        catCounts[item.category] = currentCatCount + 1;
      }
    }

    // Phase 3: If still not filled to count, relax maxPerCategory constraint
    if (selected.length < count) {
      for (const item of available) {
        if (selected.length >= count) break;
        if (!selected.some((s) => s.slug === item.slug)) {
          selected.push(item);
        }
      }
    }

    // Mark as used
    for (const item of selected) {
      usedSlugs.add(item.slug);
    }

    return selected;
  };

  // 1. Center Rotating Showcase (5 items)
  // Ensure 5 distinct beats (Gündem, Para/Ekonomi, Spor, Dünya, Teknoloji, etc.)
  const centerRotatingStories = pickDiverse(
    5,
    1,
    ["gundem", "turkiye", "para", "spor", "dunya", "teknoloji", "kultur"]
  );

  // 2. Hero Side Columns (Left 2, Right 2)
  const leftStories = pickDiverse(2, 1, ["gundem", "turkiye", "para"]);
  const rightStories = pickDiverse(2, 1, ["spor", "teknoloji", "dunya", "kultur"]);

  const leftStory1 = leftStories[0] ?? null;
  const leftStory2 = leftStories[1] ?? null;
  const rightStory1 = rightStories[0] ?? null;
  const rightStory2 = rightStories[1] ?? null;

  // 3. Son Haberler (4-grid, fresh & diverse)
  const latestNews = pickDiverse(4, 1);

  // 4. Editörün Seçimi (1 big featured + 4 grid)
  const availableForEditor = rawItems.filter((i) => !usedSlugs.has(i.slug));
  const editorsPick = availableForEditor[0] ?? null;
  if (editorsPick) {
    usedSlugs.add(editorsPick.slug);
  }
  const editorsGrid = pickDiverse(4, 1);

  // 5. Gündem & Ekonomi (2 items)
  let catLeftGundemEkonomi = rawItems
    .filter(
      (i) =>
        !usedSlugs.has(i.slug) &&
        ["gundem", "turkiye", "para"].includes(i.category)
    )
    .slice(0, 2);
  if (catLeftGundemEkonomi.length < 2) {
    // If none unused, reuse from pool so section is never empty
    const fallback = rawItems
      .filter((i) => ["gundem", "turkiye", "para"].includes(i.category))
      .slice(0, 2);
    catLeftGundemEkonomi = fallback;
  }
  for (const item of catLeftGundemEkonomi) {
    usedSlugs.add(item.slug);
  }

  // 6. Spor Dünyası (2 items, next to SuperLig widget)
  let catRightSpor = rawItems
    .filter((i) => !usedSlugs.has(i.slug) && i.category === "spor")
    .slice(0, 2);
  if (catRightSpor.length === 0) {
    // Fallback to any spor article
    catRightSpor = rawItems.filter((i) => i.category === "spor").slice(0, 2);
  }
  for (const item of catRightSpor) {
    usedSlugs.add(item.slug);
  }

  // 7. Teknoloji & İnovasyon Dedicated Showcase (4 items)
  // Give all those rich NTV Teknoloji articles their own premium block!
  let techShowcase = rawItems
    .filter((i) => !usedSlugs.has(i.slug) && i.category === "teknoloji")
    .slice(0, 4);
  if (techShowcase.length < 4) {
    const allTech = rawItems.filter((i) => i.category === "teknoloji");
    techShowcase = allTech.slice(0, 4);
  }
  for (const item of techShowcase) {
    usedSlugs.add(item.slug);
  }

  // 8. Tüm Gelişmeler / Akış (All remaining unused articles)
  const moreNews = rawItems.filter((i) => !usedSlugs.has(i.slug)).slice(0, 16);

  return {
    centerRotatingStories,
    leftStory1,
    leftStory2,
    rightStory1,
    rightStory2,
    latestNews,
    editorsPick,
    editorsGrid,
    catLeftGundemEkonomi,
    catRightSpor,
    techShowcase,
    moreNews,
  };
}
