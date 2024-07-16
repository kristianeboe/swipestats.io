import { Button } from "@/app/_components/ui/button";

export function AiDatingPhotosPurchasePage() {
  return (
    <div>
      <h1>AI Dating Photos Page</h1>
      <div>
        <p>
          Great! You purchased the package. We will now start working on your
          photos.
        </p>
        <h2>Here are some important links</h2>
        <div>Drive link</div>
        <div>Stripe invoice link</div>
        <Button>Notify us that you have uploaded your photos</Button>
      </div>
    </div>
  );
}
