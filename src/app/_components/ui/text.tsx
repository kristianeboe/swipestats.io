function H1(props: { children: React.ReactNode }) {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {props.children}
    </h1>
  );
}

function MarketingH1(props: { children: React.ReactNode }) {
  return (
    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
      {props.children}
    </h1>
  );
}

function H2(props: { children: React.ReactNode }) {
  return (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      {props.children}
    </h2>
  );
}

function H3(props: { children: React.ReactNode }) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {props.children}
    </h3>
  );
}

function H4(props: { children: React.ReactNode }) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      {props.children}
    </h4>
  );
}

function P(props: { children: React.ReactNode }) {
  return (
    <p className="leading-7 [&:not(:first-child)]:mt-6">{props.children}</p>
  );
}

function MarketingP(props: { children: React.ReactNode }) {
  return (
    <p className="text-lg leading-8 text-gray-600 [&:not(:first-child)]:mt-6">
      {props.children}
    </p>
  );
}

function Blockquote(props: { children: React.ReactNode }) {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic">
      {props.children}
    </blockquote>
  );
}

function List(props: { children: React.ReactNode }) {
  return (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
      {/* <li>1st level of puns: 5 gold coins</li>
      <li>2nd level of jokes: 10 gold coins</li>
      <li>3rd level of one-liners : 20 gold coins</li> */}
      {props.children}
    </ul>
  );
}

function InlineCode(props: { children: React.ReactNode }) {
  return (
    <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
      {props.children}
    </code>
  );
}

function Lead(props: { children: React.ReactNode }) {
  return <p className="text-muted-foreground text-xl">{props.children}</p>;
}

function Large(props: { children: React.ReactNode }) {
  return <div className="text-lg font-semibold">{props.children}</div>;
}

function Small(props: { children: React.ReactNode }) {
  return (
    <small className="text-sm font-medium leading-none">{props.children}</small>
  );
}

function Muted(props: { children: React.ReactNode }) {
  return <p className="text-muted-foreground text-sm">{props.children}</p>;
}

function Prose(props: { children: React.ReactNode }) {
  return <div className="prose ">{props.children}</div>;
}

export const Text = {
  H1,
  MarketingH1,
  H2,
  H3,
  H4,
  P,
  MarketingP,
  Blockquote,
  List,
  InlineCode,
  Lead,
  Large,
  Small,
  Muted,
  Prose,
};
