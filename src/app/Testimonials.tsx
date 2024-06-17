import { cn } from "@/lib/utils";

const featuredTestimonial = {
  body: "Discovering SwipeStats.io was a turning point in my online dating journey. The platform offers more than just data; it provides a roadmap to understanding the subtle art of online attraction. With personalized feedback and actionable insights, I've not only seen an increase in matches but also in meaningful conversations. It's empowering to navigate the dating world with such a knowledgeable guide. For those looking to elevate their online dating game, SwipeStats.io is an invaluable ally.",
  author: {
    name: "Female, 37",
    handle: "Berlin, Germany",
    imageUrl: "/images/testimonials/f37.jpeg",
    logoUrl: "https://tailwindui.com/img/logos/savvycal-logo-gray-900.svg",
  },
};
const testimonials = [
  [
    // column 1 left
    [
      {
        body: "SwipeStats.io revolutionized my dating app experience. The insights offered are unparalleled, helping me refine my profile with ease. I've noticed a significant uptick in matches. Highly recommended for anyone serious about improving their online dating presence",
        author: {
          name: "Male, 29",
          handle: "London, UK",
          imageUrl: "/images/testimonials/m29.jpeg",
        },
      },
      {
        body: "Initially skeptical, I found SwipeStats.io to be a game-changer. The analytics are eye-opening, providing a unique perspective on what works in the online dating world. It's become an essential tool in my dating strategy.",
        author: {
          name: "Female, 34",
          handle: "New York, USA",
          imageUrl: "/images/testimonials/f34.jpeg",
        },
      },
      // {
      //   body: "Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil. Aut enim doloremque et ipsam.",
      //   author: {
      //     name: "Leslie Alexander",
      //     handle: "lesliealexander",
      //     imageUrl:
      //       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      //   },
      // },
      // More testimonials...
    ],
    // column 2 bottom left
    [
      {
        body: "The interface of SwipeStats.io is user-friendly and intuitive. It offers deep insights into dating trends, which have been instrumental in enhancing my profile's visibility. Their customer service is also top-notch, always ready to assist.",
        author: {
          name: "Male, 26",
          handle: "Sydney, Australia",
          imageUrl: "/images/testimonials/m26.jpeg",
        },
      },
      // {
      //   body: "As a data nerd, I appreciate the depth of analysis SwipeStats.io offers. It's not just about increasing matches but understanding the dynamics of online dating. This platform has been incredibly enlightening and fun to use.",
      //   author: {
      //     name: "Female, 31",
      //     handle: "Toronto, Canada",
      //     imageUrl:
      //       "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      //   },
      // },
      // More testimonials...
    ],
  ],
  [
    // column 3 bottom right
    [
      {
        body: "SwipeStats.io has been an eye-opener for me. The detailed stats have helped me tweak my profile in ways I hadn't considered, leading to more meaningful connections. It's like having a personal dating coach.",
        author: {
          name: "Male, 37",
          handle: "Tirana, Albania",
          imageUrl: "/images/testimonials/m37.jpeg",
        },
      },
      // {
      //   body: "I was amazed by how detailed and actionable the advice from SwipeStats.io was. From profile picture nuances to bio suggestions, it's been invaluable. My success rate has improved noticeably since I started using it.",
      //   author: {
      //     name: "Female, 25",
      //     handle: "Cape Town, South Africa",
      //     imageUrl:
      //       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      //   },
      // },
      // More testimonials...
    ],
    // column 4 right
    [
      {
        body: "SwipeStats.io is a masterclass in online dating efficiency. The analytics are not just numbers but a reflection of real-world interactions. Through its comprehensive breakdown of my profile's performance, I've been able to make informed decisions that have dramatically improved my visibility and engagement. What sets SwipeStats.io apart is its commitment to using data to foster genuine connections. It's a tool that respects the complexity of dating in the digital age.",
        author: {
          name: "Male, 32",
          handle: "São Paulo, Brazil",
          imageUrl: "/images/testimonials/m32.jpeg",
        },
      },
      // {
      //   body: "Using SwipeStats.io feels like unlocking a secret layer of the online dating world. The platform’s insightful analytics have demystified the patterns behind successful profiles, guiding me to adapt mine with strategies I never would have thought of. The result? A significant boost in quality matches and interactions that feel more aligned with what I’m looking for. SwipeStats.io doesn’t just play the numbers game; it elevates your dating profile to resonate with your ideal matches.",
      //   author: {
      //     name: "Male, 24",
      //     handle: "Tokyo, Japan",
      //     imageUrl:
      //       "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      //   },
      // },
      {
        body: "I was amazed by how detailed and actionable the advice from SwipeStats.io was. From profile picture nuances to bio suggestions, it's been invaluable. My success rate has improved noticeably since I started using it.",
        author: {
          name: "Female, 25",
          handle: "Cape Town, South Africa",
          imageUrl: "/images/testimonials/f25.jpeg",
        },
      },

      // More testimonials...
    ],
  ],
];

export default function Testimonials() {
  return (
    <div className="relative isolate bg-white pb-32 pt-32" id="testimonials">
      <div
        className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl"
        aria-hidden="true"
      >
        <div
          className="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div
        className="absolute inset-x-0 top-0 -z-10 flex transform-gpu overflow-hidden pt-32 opacity-25 blur-3xl sm:pt-40 xl:justify-end"
        aria-hidden="true"
      >
        <div
          className="ml-[-22rem] aspect-[1313/771] w-[82.0625rem] flex-none origin-top-right rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] xl:ml-0 xl:mr-[calc(50%-12rem)]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-rose-600">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            We have worked with thousands of amazing people
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
          <figure className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 sm:col-span-2 xl:col-start-2 xl:row-end-1">
            <blockquote className="p-6 text-lg font-semibold leading-7 tracking-tight text-gray-900 sm:p-12 sm:text-xl sm:leading-8">
              <p>{`“${featuredTestimonial.body}”`}</p>
            </blockquote>
            <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-4 border-t border-gray-900/10 px-6 py-4 sm:flex-nowrap">
              <img
                className="h-10 w-10 flex-none rounded-full bg-gray-50"
                src={featuredTestimonial.author.imageUrl}
                alt=""
              />
              <div className="flex-auto">
                <div className="font-semibold">
                  {featuredTestimonial.author.name}
                </div>
                <div className="text-gray-600">{`@${featuredTestimonial.author.handle}`}</div>
              </div>
              <img
                className="h-10 w-auto flex-none"
                src={featuredTestimonial.author.logoUrl}
                alt=""
              />
            </figcaption>
          </figure>
          {testimonials.map((columnGroup, columnGroupIdx) => (
            <div
              key={columnGroupIdx}
              className="space-y-8 xl:contents xl:space-y-0"
            >
              {columnGroup.map((column, columnIdx) => (
                <div
                  key={columnIdx}
                  className={cn(
                    (columnGroupIdx === 0 && columnIdx === 0) ||
                      (columnGroupIdx === testimonials.length - 1 &&
                        columnIdx === columnGroup.length - 1)
                      ? "xl:row-span-2"
                      : "xl:row-start-1",
                    "space-y-8",
                  )}
                >
                  {column.map((testimonial) => (
                    <figure
                      key={testimonial.author.handle}
                      className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5"
                    >
                      <blockquote className="text-gray-900">
                        <p>{`“${testimonial.body}”`}</p>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-x-4">
                        <img
                          className="h-10 w-10 rounded-full bg-gray-50"
                          src={testimonial.author.imageUrl}
                          alt=""
                        />
                        <div>
                          <div className="font-semibold">
                            {testimonial.author.name}
                          </div>
                          <div className="text-gray-600">{`@${testimonial.author.handle}`}</div>
                        </div>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const avatar1 = () => (
  <svg
    baseProfile="full"
    height="100"
    version="1.1"
    width="100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs />
    <circle cx="50" cy="50" fill="#FFA07A" r="45" />
    <circle cx="35.0" cy="35.0" fill="white" r="5.625" />
    <circle cx="65.0" cy="35.0" fill="white" r="5.625" />
    <path
      d="M35.0,50 q15.0,22.5 30.0,0"
      fill="none"
      stroke="white"
      stroke-width="4.5"
    />
  </svg>
);

const avatar2 = () => (
  <svg
    baseProfile="full"
    height="100"
    version="1.1"
    width="100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs />
    <circle cx="50" cy="50" fill="#ADD8E6" r="45" />
    <circle cx="35.0" cy="35.0" fill="white" r="5.625" />
    <circle cx="65.0" cy="35.0" fill="white" r="5.625" />
    <path
      d="M35.0,50 q15.0,22.5 30.0,0"
      fill="none"
      stroke="white"
      stroke-width="4.5"
    />
  </svg>
);

const avatar3 = () => (
  <svg
    baseProfile="full"
    height="100"
    version="1.1"
    width="100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs />
    <circle cx="50" cy="50" fill="#ADD8E6" r="45" />
    <circle cx="35.0" cy="35.0" fill="white" r="5.625" />
    <circle cx="65.0" cy="35.0" fill="white" r="5.625" />
    <path
      d="M35.0,50 q15.0,22.5 30.0,0"
      fill="none"
      stroke="white"
      stroke-width="4.5"
    />
  </svg>
);

const avatar4 = () => (
  <svg
    baseProfile="full"
    height="100"
    version="1.1"
    width="100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs />
    <circle cx="50" cy="50" fill="#FFA07A" r="45" />
    <circle cx="35.0" cy="35.0" fill="white" r="5.625" />
    <circle cx="65.0" cy="35.0" fill="white" r="5.625" />
    <path
      d="M35.0,50 q15.0,22.5 30.0,0"
      fill="none"
      stroke="white"
      stroke-width="4.5"
    />
  </svg>
);

const avatar5 = () => (
  <svg
    baseProfile="full"
    height="100"
    version="1.1"
    width="100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs />
    <circle cx="50" cy="50" fill="#FFA07A" r="45" />
    <circle cx="35.0" cy="35.0" fill="white" r="5.625" />
    <circle cx="65.0" cy="35.0" fill="white" r="5.625" />
    <path
      d="M35.0,50 q15.0,22.5 30.0,0"
      fill="none"
      stroke="white"
      stroke-width="4.5"
    />
  </svg>
);

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];
