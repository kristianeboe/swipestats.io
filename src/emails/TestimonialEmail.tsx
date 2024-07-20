import React from "react";
import { Container, Img, Text } from "@react-email/components";

const TestimonialEmail = () => {
  return (
    <Container className="relative isolate overflow-hidden bg-white px-6 py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50" />
      <div className="mx-auto max-w-2xl">
        <Img
          src="https://tailwindui.com/img/logos/workcation-logo-indigo-600.svg"
          width={48}
          height={48}
          alt="Workcation"
          className="mx-auto h-12"
        />
        <figure className="mt-10">
          <blockquote className="text-center text-xl font-semibold leading-8 text-gray-900">
            <Text>
              &quot;Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Nemo expedita voluptas culpa sapiente alias molestiae. Numquam
              corrupti in laborum sed rerum et corporis.&quot;
            </Text>
          </blockquote>
          <figcaption className="mt-10">
            <Img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              width={40}
              height={40}
              alt="Judith Black"
              className="mx-auto h-10 w-10 rounded-full"
            />
            <div className="mt-4 flex items-center justify-center space-x-3 text-base">
              <div className="font-semibold text-gray-900">Judith Black</div>
              <svg
                viewBox="0 0 2 2"
                width={3}
                height={3}
                aria-hidden="true"
                className="fill-gray-900"
              >
                <circle cx={1} cy={1} r={1} />
              </svg>
              <div className="text-gray-600">CEO of Workcation</div>
            </div>
          </figcaption>
        </figure>
      </div>
    </Container>
  );
};

export default TestimonialEmail;
