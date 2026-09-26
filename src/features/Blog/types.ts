export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  author?: string;
  publishedAt?: string;
  mainImageUrl?: string;
  category?: string;
}

export interface BlogPostFull extends BlogPost {
  /** Markdown source. */
  body?: string;
  /** ISO date of the last edit in the admin — the visible "Updated" stamp. */
  updatedAt?: string;
}
