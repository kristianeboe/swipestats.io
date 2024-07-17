import Script from "next/script";
import { Button } from "../_components/ui/button";

const LmnCheckoutButton = () => {
  return (
    <>
      <Script
        src="https://assets.lemonsqueezy.com/lemon.js"
        strategy="lazyOnload"
      />
      <a
        href="https://swipestats.lemonsqueezy.com/buy/09d2ac28-81db-4784-953a-df22261344de?embed=1"
        className="lemonsqueezy-button"
      >
        <Button>Buy AI Dating Photos</Button>
      </a>
    </>
  );
};

export default LmnCheckoutButton;
