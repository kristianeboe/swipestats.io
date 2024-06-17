import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-rose-600">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-rose-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
          >
            Go back home
          </Link>
          <Link
            href="mailto:support@swipestats.io?subject=Support%20Request%20for%20SwipeStats.io&body=Hello%20SwipeStats%20Support%2C%0A%0APlease%20describe%20your%20issue%20or%20inquiry%20below%3A%0A%5BYour%20detailed%20description%20here%5D%0A%0AKindly%20include%20any%20relevant%20details%20such%20as%20user%20ID%2C%20email%20address%20used%20to%20register%2C%20and%20any%20error%20messages%20or%20screenshots.%20This%20will%20help%20us%20resolve%20your%20issue%20more%20quickly.%0A%0AThank%20you%21%0A%0A-%20%5BYour%20Name%5D%0A%5BYour%20Contact%20Information%5D"
            className="text-sm font-semibold text-gray-900"
          >
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
