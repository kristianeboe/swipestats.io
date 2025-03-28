import Link from "next/link";
import { MobileNav } from "./MobileNav";
import { Button } from "@/app/_components/ui/button";
import { SwipestatsLogo } from "@/svg/logos/SwipestatsLogo";

const navigation: { name: string; href: string }[] = [
  // { name: "Product", href: "#" },
  { name: "How it works", href: "/#how-it-works" },
  { name: "Research and blog datasets", href: "/#pricing" },
  { name: "In the news", href: "/#blog" },
  { name: "Blog", href: "/blog" },
  { name: "AI Dating Photos", href: "/ai-dating-photos" },
  // { name: "SwipeGuide", href: "/swipeguide" },
  // { name: "Company", href: "#" },
];

export function Header() {
  return (
    <header className="">
      <nav
        className="relative z-10 flex items-center justify-center p-4 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Swipestats</span>
            {/* <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=rose&shade=600"
              alt=""
            /> */}
            <SwipestatsLogo className="h-12 w-auto" />
          </Link>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {/* <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Log in <span aria-hidden="true">&rarr;</span>
          </a> */}
          <Link href="/#data-request-support">
            <Button>How do I get my data?</Button>
          </Link>
        </div>

        {/* <MobileNav /> */}
      </nav>
    </header>
  );
}
