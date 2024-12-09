import { Card } from "@/app/_components/ui/card";
import {
  Book,
  Check,
  CheckIcon,
  CrownIcon,
  Lock,
  MessageCircle,
  Users,
} from "lucide-react";
import { useInsightsProvider } from "./InsightsProvider";

const includedFeatures = [
  {
    title: "All demographic comparisons",
    description: "Access detailed demographic insights and trends",
    icon: Users,
  },
  {
    title: "The Swipe Guide",
    description: "Access guides on how to swipe and get matches",
    icon: Book,
  },
  {
    title: "Access to all future updates",
    description: "We will add new features to Swipestats+ over time",
    icon: Check,
  },
  {
    title: "Premium Support",
    description: "Get priority support and feature requests",
    icon: MessageCircle,
  },

  // {
  //   title: "Message analysis",
  //   description: "Deep dive into your messaging patterns and success rates",
  //   icon: MessageCircle,
  // },
  // {
  //   title: "Private forum access",
  //   description: "Join exclusive discussions with other members",
  //   icon: Users,
  // },
  // {
  //   title: "Member resources",
  //   description: "Access premium guides and resources",
  //   icon: Check,
  // },
  // {
  //   title: "Entry to annual conference",
  //   description: "Attend our yearly member conference",
  //   icon: Users
  // },
  // {
  //   title: "Official member t-shirt",
  //   description: "Get exclusive Swipestats+ merchandise",
  //   icon: Crown
  // }
];

export function SwipestatsPlusCard() {
  const { myTinderId, myTinderProfile } = useInsightsProvider();
  const hasSwipestatsPlus = false;

  if (hasSwipestatsPlus) {
    return (
      <Card.Container className="w-full">
        <Card.Header className="space-y-2 text-center">
          <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
            <CrownIcon className="text-primary h-6 w-6" />
          </div>
          <Card.Title className="text-3xl font-bold">
            Welcome to Swipestats+
          </Card.Title>
          <Card.Description className="text-lg">
            You now have full access to all premium features
          </Card.Description>
        </Card.Header>
        <Card.Content className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {includedFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-card flex items-start gap-3 rounded-lg border p-4"
              >
                <div className="bg-primary/10 rounded-full p-2">
                  <feature.icon className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card.Container>
    );
  }

  return (
    <Card.Container className="lg:flex">
      <div className="p-8 sm:p-10 lg:flex-auto">
        <h3 className="text-3xl font-semibold tracking-tight text-gray-900">
          Swipestats+
        </h3>
        {/* <p className="mt-6 text-base/7 text-gray-600">
      Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque
      amet indis perferendis blanditiis repellendus etur quidem
      assumenda.
    </p> */}
        <div className="mt-10 flex items-center gap-x-4">
          <h4 className="flex-none text-sm/6 font-semibold text-rose-600">
            What&apos;s included
          </h4>
          <div className="h-px flex-auto bg-gray-100" />
        </div>
        <ul
          role="list"
          className="mt-8 grid grid-cols-1 gap-4 text-sm/6 text-gray-600 sm:grid-cols-2 sm:gap-6"
        >
          {includedFeatures.map((feature) => (
            <li key={feature.title} className="flex gap-x-3">
              <feature.icon
                aria-hidden="true"
                className="h-6 w-5 flex-none text-rose-600"
              />
              {feature.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-sm lg:shrink-0">
        <div className="rounded bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
          <div className="mx-auto max-w-xs px-8">
            <p className="text-base font-semibold text-gray-600">
              Pay once, access forever
            </p>
            <p className="mt-6 flex items-baseline justify-center gap-x-2">
              <span className="text-5xl font-semibold tracking-tight text-gray-900">
                $25
              </span>
              <span className="text-sm/6 font-semibold tracking-wide text-gray-600">
                USD
              </span>
            </p>
            <a
              href={`https://swipestats.lemonsqueezy.com/buy/e362e7c3-5fba-4e46-8134-ead1e9da8847?checkout[custom][tinderId]=${myTinderId}`}
              className="mt-10 block w-full rounded-md bg-rose-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
            >
              Get access
            </a>
            {/* <p className="mt-6 text-xs/5 text-gray-600">
          Invoices and receipts available for easy company
          reimbursement
        </p> */}
          </div>
        </div>
      </div>
    </Card.Container>
  );
}
