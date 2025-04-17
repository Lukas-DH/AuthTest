export type ImageFormat = {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
};

export type ImageData = {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type BlogPostContent = {
  type: string;
  children: { type: string; text: string }[];
};

export type BlogPost = {
  id: number;
  documentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  content: BlogPostContent[];
  summary: string;
  author: string;
  image: ImageData;
};

const BLOG_POSTS: BlogPost[] = [
  {
    id: 7,
    documentId: "xgn5zz1okdklr8ycnrxt1vj0",
    title: "IM LOCK",
    createdAt: "2025-03-26T21:08:27.370Z",
    updatedAt: "2025-03-26T21:33:03.414Z",
    publishedAt: "2025-03-26T21:33:03.419Z",
    content: [
      {
        type: "paragraph",
        children: [{ type: "text", text: "cigs cigs cigs" }],
      },
    ],
    summary: "durrys",
    author: "king the IV",
    image: {
      id: 3,
      documentId: "x7tlk1jtexms1q0n5ij5qp07",
      name: "contracep.jpg",
      alternativeText: null,
      caption: null,
      width: 4442,
      height: 3172,
      formats: {
        thumbnail: {
          name: "thumbnail_contracep.jpg",
          hash: "thumbnail_contracep_7c4d337d0f",
          ext: ".jpg",
          mime: "image/jpeg",
          path: null,
          width: 219,
          height: 156,
          size: 6.83,
          sizeInBytes: 6827,
          url: "/uploads/thumbnail_contracep_7c4d337d0f.jpg",
        },
        small: {
          name: "small_contracep.jpg",
          hash: "small_contracep_7c4d337d0f",
          ext: ".jpg",
          mime: "image/jpeg",
          path: null,
          width: 500,
          height: 357,
          size: 24.9,
          sizeInBytes: 24900,
          url: "/uploads/small_contracep_7c4d337d0f.jpg",
        },
        medium: {
          name: "medium_contracep.jpg",
          hash: "medium_contracep_7c4d337d0f",
          ext: ".jpg",
          mime: "image/jpeg",
          path: null,
          width: 750,
          height: 536,
          size: 48.65,
          sizeInBytes: 48645,
          url: "/uploads/medium_contracep_7c4d337d0f.jpg",
        },
        large: {
          name: "large_contracep.jpg",
          hash: "large_contracep_7c4d337d0f",
          ext: ".jpg",
          mime: "image/jpeg",
          path: null,
          width: 1000,
          height: 714,
          size: 81.92,
          sizeInBytes: 81921,
          url: "/uploads/large_contracep_7c4d337d0f.jpg",
        },
      },
      hash: "contracep_7c4d337d0f",
      ext: ".jpg",
      mime: "image/jpeg",
      size: 1644.79,
      url: "/uploads/contracep_7c4d337d0f.jpg",
      previewUrl: null,
      provider: "local",
      provider_metadata: null,
      createdAt: "2025-03-26T21:32:03.427Z",
      updatedAt: "2025-03-26T21:32:23.744Z",
      publishedAt: "2025-03-26T21:32:03.427Z",
    },
  },
  {
    id: 8,
    documentId: "y4w3ti3ac61fpitgmeworbr4",
    title: "getting pregs",
    createdAt: "2025-03-24T19:50:24.905Z",
    updatedAt: "2025-03-26T22:01:28.902Z",
    publishedAt: "2025-03-26T22:01:28.908Z",
    content: [
      {
        type: "paragraph",
        children: [
          { type: "text", text: "how to get pregs is easy... just do it" },
        ],
      },
    ],
    summary: "in and out",
    author: "Hugo Heff",
    image: {
      id: 4,
      documentId: "hnohzc540ilkbz9h0i57iuoa",
      name: "babyshoes.jpg",
      alternativeText: null,
      caption: null,
      width: 640,
      height: 398,
      formats: {
        thumbnail: {
          name: "thumbnail_babyshoes.jpg",
          hash: "thumbnail_babyshoes_ca92d0e42f",
          ext: ".jpg",
          mime: "image/jpeg",
          path: null,
          width: 245,
          height: 152,
          size: 5.34,
          sizeInBytes: 5338,
          url: "/uploads/thumbnail_babyshoes_ca92d0e42f.jpg",
        },
        small: {
          name: "small_babyshoes.jpg",
          hash: "small_babyshoes_ca92d0e42f",
          ext: ".jpg",
          mime: "image/jpeg",
          path: null,
          width: 500,
          height: 311,
          size: 14.98,
          sizeInBytes: 14978,
          url: "/uploads/small_babyshoes_ca92d0e42f.jpg",
        },
      },
      hash: "babyshoes_ca92d0e42f",
      ext: ".jpg",
      mime: "image/jpeg",
      size: 21.29,
      url: "/uploads/babyshoes_ca92d0e42f.jpg",
      previewUrl: null,
      provider: "local",
      provider_metadata: null,
      createdAt: "2025-03-26T22:01:08.280Z",
      updatedAt: "2025-03-26T22:01:08.280Z",
      publishedAt: "2025-03-26T22:01:08.280Z",
    },
  },
];

export default BLOG_POSTS;
