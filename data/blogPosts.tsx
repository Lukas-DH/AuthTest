export type BlogPost = {
  title: string;
  image: any;
  summary: string;
  // likes: number;
  author: string;
};

const BLOG_POSTS: BlogPost[] = [
  {
    title: "Top 10 Foods to Boost Fertility Naturally",
    image: require("@/assets/images/mamabelly.jpg"),
    summary:
      "Discover the best fertility-boosting foods and how they can enhance reproductive health for both men and women.",
    // likes: 120,
    author: "Dr. Emily Carter",
  },
  {
    title: "Understanding Your Ovulation Cycle",

    image: require("@/assets/images/contracep.jpg"),
    summary:
      "Learn how to track ovulation and optimize your chances of conception with natural cycle awareness.",
    // likes: 95,
    author: "Sarah Thompson, RN",
  },
  {
    title: "The Impact of Stress on Fertility",
    image: require("@/assets/images/babyshoes.jpg"),
    summary:
      "Understand the connection between stress and reproductive health, and discover stress-reducing techniques for better fertility.",
    // likes: 76,
    author: "Dr. Laura Bennett",
  },
  {
    title: "Male Fertility: How to Improve Sperm Health",
    image: require("@/assets/images/pregphoto.jpg"),
    summary:
      "Explore lifestyle changes and medical insights to enhance sperm quality and increase fertility in men.",
    // likes: 88,
    author: "Dr. Mark Reynolds",
  },
  {
    title: "How to Prepare Your Body for Pregnancy",
    image: require("@/assets/images/freestocks-ux53SGpRAHU-unsplash.jpg"),
    summary:
      "A step-by-step guide on lifestyle, diet, and medical check-ups before trying to conceive.",
    // likes: 98,
    author: "Dr. Lisa Henderson",
  },
];

export default BLOG_POSTS;
