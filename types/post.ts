export interface Post {
  documentId: string;
  title: string;
  summary: string;
  author: string | null;
  content: string | null;
  image?: {
    url: string;
    mime?: string;
    formats?: {
      thumbnail?: {
        url: string;
      };
    };
  } | null;
}

export function isPdfPost(post: Post): boolean {
  return post.image?.mime === "application/pdf";
}

export function getPdfUrl(post: Post): string | null {
  if (!isPdfPost(post)) return null;
  return post.image?.url || null;
}
