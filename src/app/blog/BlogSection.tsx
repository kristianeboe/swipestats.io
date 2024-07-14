import Link from "next/link";
import { Button } from "../_components/ui/button";

export type BlogPost = {
  id: string;
  title: string;
  href: string;
  readTime: string;
  description: string;
  imageUrl: string;
  date: string;
  datetime: string;
  category: {
    title: "Article" | "Case-Study";
    href: string;
  };
  author: {
    name: string;
    role: string;
    href: string;
    imageUrl: string;
  };
};

export const posts: BlogPost[] = [
  {
    id: "1",
    title:
      "I analyzed hundreds of user’s Tinder data — including messages — so you don’t have to.",
    href: "https://towardsdatascience.com/i-analyzed-hundreds-of-users-tinder-data-including-messages-so-you-dont-have-to-14c6dc4a5fdd",
    description:
      "The data is embarrassingly intimate, but reveals the most boring parts of ourselves we already knew. I read Modern Romance by Aziz Ansari in 2016 and beyond a shadow of a doubt, it is one of the most influential books I’ve ever read...",
    readTime: "13 min read",
    imageUrl: "https://miro.medium.com/max/1400/1*VqIdzn99v1VmeQVD34pO_w.jpeg",
    date: "Aug 10, 2021",
    datetime: "2021-08-10",
    category: { title: "Article", href: "#" },
    author: {
      name: "Alyssa Beatriz Fernandez",
      role: "Co-Founder / CTO",
      href: "#",
      imageUrl: "https://miro.medium.com/fit/c/262/262/0*PUwLMwezgreBAaS2",
    },
  },
  {
    id: "2",
    title: "Why do women have the Upper Hand on Tinder?",
    href: "https://thebolditalic.com/the-two-worlds-of-tinder-f1c34e800db4?gi=87ab2f7db817",
    description:
      "Explaining the two worlds of the dating app. Over the last decade, Tinder has redefined the online dating industry. The app has proven especially popular among young people, with three-quarters of those ages 18 to 24 reporting using the app at one point...",
    readTime: "6 min read",
    imageUrl: "https://miro.medium.com/max/1400/1*lrOlpLXLCam7Dgb-zK3rsA.jpeg",
    date: "Mar 8, 2021",
    datetime: "2021-03-08",
    category: { title: "Article", href: "#" },
    author: {
      name: "Brayden Gerrard",
      role: "Co-Founder / CTO",
      href: "#",
      imageUrl:
        "https://miro.medium.com/fit/c/262/262/1*FRURVIuFwaNcTAj9_LxOxw.jpeg",
    },
  },
  {
    id: "3",
    title:
      "[OC] Despite being far more selective, women still match more frequently than men on Tinder",
    href: "https://www.reddit.com/r/dataisbeautiful/comments/mbf6wg/oc_despite_being_far_more_selective_women_still",
    description:
      "A reddit post with more than 12 000 upvotes and 1000+ comments",
    readTime: "4 min read",
    imageUrl:
      "https://preview.redd.it/8wzwio329so61.png?width=960&crop=smart&auto=webp&s=9b5813ca84cbb05d96693844ed61988b90be09c3",
    date: "Mar 23, 2021",
    datetime: "2021-03-23",
    category: { title: "Case-Study", href: "#" },
    author: {
      name: "raptorman556 @reddit",
      role: "Co-Founder / CTO",
      href: "#",
      imageUrl: "/images/Reddit_Mark_OnWhite.png",
    },
  },
  // More posts...
];

export function Blog() {
  return (
    <div id="blog" className="bg-white pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Link href={"/blog"}>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              From the blog
            </h2>
          </Link>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Learn how to grow your business with our expert advice.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col items-start justify-between"
            >
              <div className="relative w-full">
                <img
                  src={post.imageUrl}
                  alt=""
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <time dateTime={post.datetime} className="text-gray-500">
                    {post.date}
                  </time>
                  <a
                    href={post.category.href}
                    className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                  >
                    {post.category.title}
                  </a>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <a href={post.href}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                    {post.description}
                  </p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4">
                  <img
                    src={post.author.imageUrl}
                    alt=""
                    className="h-10 w-10 rounded-full bg-gray-100"
                  />
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900">
                      <a href={post.author.href}>
                        <span className="absolute inset-0" />
                        {post.author.name}
                      </a>
                    </p>
                    <p className="text-gray-600">{post.author.role}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="my-10 flex justify-center">
          <Link href={"/blog"}>
            <Button>See all blog posts and news articles</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Blog2() {
  return (
    <div className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            From the blog
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Learn how to grow your business with our expert advice.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
            >
              <img
                src={post.imageUrl}
                alt=""
                className="absolute inset-0 -z-10 h-full w-full object-cover"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
              <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

              <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                <time dateTime={post.datetime} className="mr-8">
                  {post.date}
                </time>
                <div className="-ml-4 flex items-center gap-x-4">
                  <svg
                    viewBox="0 0 2 2"
                    className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50"
                  >
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                  <div className="flex gap-x-2.5">
                    <img
                      src={post.author.imageUrl}
                      alt=""
                      className="h-6 w-6 flex-none rounded-full bg-white/10"
                    />
                    {post.author.name}
                  </div>
                </div>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                <a href={post.href}>
                  <span className="absolute inset-0" />
                  {post.title}
                </a>
              </h3>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
