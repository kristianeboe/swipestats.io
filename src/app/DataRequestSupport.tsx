import Link from "next/link";
import { Button } from "@/app/_components/ui/button";

const supportLinks = [
  {
    name: "Tinder",
    href: "https://www.help.tinder.com/hc/en-us/articles/115005626726-How-do-I-request-a-copy-of-my-personal-data-",
    description:
      "Easy! Follow the instructions to request the data, wait 1-3 days and receive a link to download your personal tinder.json. Then come back here!",
    icon: () => (
      // <svg
      //   viewBox="0 -0.060000000000000005 35 40.3"
      //   xmlns="http://www.w3.org/2000/svg"
      //   width="2168"
      //   height="2500"
      //   className="h-6 w-6 text-white"
      //   aria-hidden="true"
      // >
      //   <radialGradient id="a" cx=".5" cy="1" r="1" spreadMethod="pad">
      //     <stop offset="0" stop-color="#ff7854" />
      //     <stop offset="1" stop-color="#fd267d" />
      //   </radialGradient>
      //   <path
      //     d="M10.5 16.25c-.06 0-.1 0-.14-.04-1.36-1.8-1.7-4.9-1.78-6.08-.02-.23-.28-.35-.48-.24C3.9 12.24 0 17.82 0 23.2c0 9.27 6.43 17.04 17.5 17.04 10.37 0 17.5-8 17.5-17.03C35 11.4 26.57 3.58 19.06.04c-.2-.1-.42.07-.4.28.98 6.37-.36 13.28-8.17 15.95z"
      //     fill="url(#a)"
      //   />
      // </svg>
      <svg
        viewBox="0 -0.060000000000000005 35 40.3"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-white"
        aria-hidden="true"
      >
        <path
          d="M10.5 16.25c-.06 0-.1 0-.14-.04-1.36-1.8-1.7-4.9-1.78-6.08-.02-.23-.28-.35-.48-.24C3.9 12.24 0 17.82 0 23.2c0 9.27 6.43 17.04 17.5 17.04 10.37 0 17.5-8 17.5-17.03C35 11.4 26.57 3.58 19.06.04c-.2-.1-.42.07-.4.28.98 6.37-.36 13.28-8.17 15.95z"
          fill="white"
        />
      </svg>
      // <svg
      //   viewBox="0 0 2500 2500"
      //   xmlns="http://www.w3.org/2000/svg"
      //   aria-hidden="true"
      //   className="h-6 w-6 text-white"
      // >
      //   <path
      //     transform="scale(71.4286)"
      //     d="M10.5 16.25c-.06 0-.1 0-.14-.04-1.36-1.8-1.7-4.9-1.78-6.08-.02-.23-.28-.35-.48-.24C3.9 12.24 0 17.82 0 23.2c0 9.27 6.43 17.04 17.5 17.04 10.37 0 17.5-8 17.5-17.03C35 11.4 26.57 3.58 19.06.04c-.2-.1-.42.07-.4.28.98 6.37-.36 13.28-8.17 15.95z"
      //     fill="white"
      //   />
      // </svg>
    ),
  },
  {
    name: "Bumble",
    href: "https://bumble.com/en/help/how-can-i-request-my-data-or-retrieve-past-conversations",
    description:
      "This process is a bit more manual and time consuming. After you submit your data request it can take up to 30 days before you get a reply.",
    icon: () => (
      // <svg
      //   enableBackground="new 0 0 2500 2500"
      //   viewBox="0 0 2500 2500"
      //   xmlns="http://www.w3.org/2000/svg"
      //   className="h-6 w-6 text-white"
      //   aria-hidden="true"
      // >
      //   <linearGradient
      //     id="a"
      //     gradientTransform="matrix(2500 0 0 -2500 -724710 4475710)"
      //     gradientUnits="userSpaceOnUse"
      //     x1="290.384"
      //     x2="290.384"
      //     y1="1789.2841"
      //     y2="1790.2841"
      //   >
      //     <stop offset="0" stop-color="#f9b932" />
      //     <stop offset="1" stop-color="#f9cb37" />
      //   </linearGradient>
      //   <path d="m0 0h2500v2500h-2500z" fill="url(#a)" />
      //   <path
      //     d="m2278.8 1314-458 791c-19.5 33.7-55.7 56.2-97.7 56.2h-915.5c-42 0-78.1-22.5-97.7-56.6l-458.9-790.6c-20.2-34.9-20.2-77.9 0-112.8l458-791c19.5-33.2 56.2-56.2 97.7-56.2h917c42 0 78.1 22.9 97.7 56.6l457.5 790.5c20.2 34.9 20.2 78-.1 112.9zm-1153.8 447.2h280.8c62.3 0 112.8-50.5 112.8-112.8s-50.5-112.8-112.8-112.8h-280.8c-62.3 0-112.8 50.5-112.8 112.8s50.5 112.8 112.8 112.8zm392.1-1004.4h-503.4c-62.4 0-113 50.6-113 113s50.6 113 113 113h503.4c62.4 0 113-50.6 113-113s-50.6-113-113-113zm204.6 389.2h-913.1c-62.4 0-113 50.6-113 113s50.6 113 113 113h913.1c62.4 0 113-50.6 113-113s-50.6-113-113-113z"
      //     fill="#fff"
      //   />
      // </svg>
      // <svg
      //   version="1.1"
      //   id="Layer_1"
      //   xmlns="http://www.w3.org/2000/svg"
      //   x="0px"
      //   y="0px"
      //   viewBox="0 0 2500 2500"
      //   aria-hidden="true"
      //   className="h-6 w-6 text-white"
      // >
      //   <path d="m0 0h2500v2500h-2500z" fill="transparent" />
      //   <path
      //     d="m2278.8 1314-458 791c-19.5 33.7-55.7 56.2-97.7 56.2h-915.5c-42 0-78.1-22.5-97.7-56.6l-458.9-790.6c-20.2-34.9-20.2-77.9 0-112.8l458-791c19.5-33.2 56.2-56.2 97.7-56.2h917c42 0 78.1 22.9 97.7 56.6l457.5 790.5c20.2 34.9 20.2 78-.1 112.9zm-1153.8 447.2h280.8c62.3 0 112.8-50.5 112.8-112.8s-50.5-112.8-112.8-112.8h-280.8c-62.3 0-112.8 50.5-112.8 112.8s50.5 112.8 112.8 112.8zm392.1-1004.4h-503.4c-62.4 0-113 50.6-113 113s50.6 113 113 113h503.4c62.4 0 113-50.6 113-113s-50.6-113-113-113zm204.6 389.2h-913.1c-62.4 0-113 50.6-113 113s50.6 113 113 113h913.1c62.4 0 113-50.6 113-113s-50.6-113-113-113z"
      //     fill="#fff"
      //   />
      // </svg>
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="h-6 w-6 text-white"
        viewBox="0 0 2500 2500"
      >
        <path d="m0 0h2500v2500h-2500z" fill="transparent" />
        <path
          d="m2278.8 1314-458 791c-19.5 33.7-55.7 56.2-97.7 56.2h-915.5c-42 0-78.1-22.5-97.7-56.6l-458.9-790.6c-20.2-34.9-20.2-77.9 0-112.8l458-791c19.5-33.2 56.2-56.2 97.7-56.2h917c42 0 78.1 22.9 97.7 56.6l457.5 790.5c20.2 34.9 20.2 78-.1 112.9zm-1153.8 447.2h280.8c62.3 0 112.8-50.5 112.8-112.8s-50.5-112.8-112.8-112.8h-280.8c-62.3 0-112.8 50.5-112.8 112.8s50.5 112.8 112.8 112.8zm392.1-1004.4h-503.4c-62.4 0-113 50.6-113 113s50.6 113 113 113h503.4c62.4 0 113-50.6 113-113s-50.6-113-113-113zm204.6 389.2h-913.1c-62.4 0-113 50.6-113 113s50.6 113 113 113h913.1c62.4 0 113-50.6 113-113s-50.6-113-113-113z"
          fill="#fff"
        />
      </svg>
    ),
  },
  {
    name: "Hinge",
    href: "https://hingeapp.zendesk.com/hc/en-us/articles/360004792234-Data-Requests",
    description:
      "In Hinge you start the data request inside the app. All the steps are outlined in their help article linked here.",
    icon: () => (
      //     <svg
      //       version="1.1"
      //       id="Layer_1"
      //       xmlns="http://www.w3.org/2000/svg"
      //       x="0px"
      //       y="0px"
      //       viewBox="-300.4 530 263.8 243.5"
      //       className="h-6 w-6 text-white"
      //       aria-hidden="true"
      //       // style={"enable-background:new -300.4 530 263.8 243.5;"}
      //       // xml:space="preserve"
      //     >
      //       <title>hinge-logo</title>
      //       <path
      //         d="M-36.6,620.1c-17.4,37.4-46.6,47.7-79.5,47.7h-2.9v105.7h-41.4V667.8h-50.6c-31.4,0-47.5,10.6-47.9,44.7v61h-41.5V530h41.4
      //  v112.3c13.8-10.4,32.5-16.6,56.6-16.6h41.9V530h41.4v95.7c20.7,0,37-0.4,49.5-20.4L-36.6,620.1z"
      //       />
      //     </svg>
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="-300.4 530 263.8 243.5"
        aria-hidden="true"
        className="h-6 w-6 text-white"
      >
        <title>hinge-logo</title>
        <path
          d="M-36.6,620.1c-17.4,37.4-46.6,47.7-79.5,47.7h-2.9v105.7h-41.4V667.8h-50.6c-31.4,0-47.5,10.6-47.9,44.7v61h-41.5V530h41.4 v112.3c13.8-10.4,32.5-16.6,56.6-16.6h41.9V530h41.4v95.7c20.7,0,37-0.4,49.5-20.4L-36.6,620.1z"
          fill="#fff"
        />
      </svg>
      // <svg
      //   version="1.1"
      //   id="Layer_1"
      //   xmlns="http://www.w3.org/2000/svg"
      //   aria-hidden="true"
      //   className="h-6 w-6 text-white"
      //   viewBox="0 0 2500 2500"
      // >
      //   <title>hinge-logo</title>
      //   <path
      //     transform="translate(1250, 1250) scale(9.43396)"
      //     d="M-36.6,620.1c-17.4,37.4-46.6,47.7-79.5,47.7h-2.9v105.7h-41.4V667.8h-50.6c-31.4,0-47.5,10.6-47.9,44.7v61h-41.5V530h41.4 v112.3c13.8-10.4,32.5-16.6,56.6-16.6h41.9V530h41.4v95.7c20.7,0,37-0.4,49.5-20.4L-36.6,620.1z"
      //     fill="#fff"
      //   />
      // </svg>
    ),
  },
];

export default function DataRequestSupport() {
  return (
    <div
      className="mx-auto max-w-7xl pt-32 sm:px-6 lg:px-8 "
      id="data-request-support"
    >
      {/* Header */}
      <div className="relative pb-32 ">
        <div className="absolute inset-0 overflow-hidden  sm:rounded-3xl">
          <img
            // className="h-full w-full object-cover"
            className="absolute inset-0 h-full w-full object-cover brightness-150 saturate-0 sm:rounded-3xl"
            src="https://images.unsplash.com/photo-1525130413817-d45c1d127c42?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1920&q=60&&sat=-100"
            alt=""
          />
          <div
            className="absolute inset-0 bg-gray-800 mix-blend-multiply"
            aria-hidden="true"
          />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
            How to request your data
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-gray-300">
            Requesting your data is easy, but it is not automatic. You usually
            need to log into your providers account, fill out a form and wait up
            to 24 hours. Instructions below:
          </p>
          <Link href={"/#newsletter"}>
            <Button className="mt-4">Get a reminder</Button>
          </Link>
        </div>
      </div>

      {/* Overlapping cards */}
      <section
        className="relative z-10 mx-auto -mt-32 max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-labelledby="contact-heading"
      >
        <h2 className="sr-only" id="contact-heading">
          How to request your data
        </h2>
        <div className="grid grid-cols-1 gap-y-20 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
          {supportLinks.map((link) => (
            <div
              key={link.name}
              className="flex flex-col rounded-2xl bg-white shadow-xl"
            >
              <div className="relative flex-1 px-6 pb-8 pt-16 md:px-8">
                <div className="absolute top-0 inline-block -translate-y-1/2 transform rounded-xl bg-rose-600 p-5 shadow-lg">
                  <link.icon />
                </div>
                <h3 className="text-xl font-medium text-gray-900">
                  {link.name}
                </h3>
                <p className="mt-4 text-base text-gray-500">
                  {link.description}
                </p>
              </div>
              <div className="rounded-bl-2xl rounded-br-2xl bg-gray-50 p-6 md:px-8">
                <a
                  href={link.href}
                  target="_blank"
                  className="text-base font-medium text-rose-700 hover:text-rose-600"
                  rel="noreferrer"
                >
                  Start here<span aria-hidden="true"> &rarr;</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
