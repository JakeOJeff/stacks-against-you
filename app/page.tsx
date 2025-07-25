"use client";
import Link from "next/link";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
const btnStyle = {
  container: "relative w-40 sm:w-48 h-12 overflow-hidden rounded-3xl group",
  background: "absolute inset-0 transition-all duration-500 rounded-3xl",
  image: "absolute inset-0 bg-[url('/diamonds-design.png')] bg-contain translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out rounded-3xl",
  link: "relative z-10 w-full h-full flex items-center justify-center font-bold text-white dark:text-white px-4 py-2 transition-colors duration-500 rounded-3xl",
};

export default function Home() {
  return (
    <PageWrapper>

      <main className="relative flex flex-col items-center justify-center h-screen overflow-hidden">


        <div>
          <Link
            href="https://github.com/jakeojeff/stacks-against-you"
            className="ml-2 font-bold text-white p-2 pl-4 pr-4 rounded-t-full hover:bg-white hover:text-gray-950/50 duration-500"
          >
            Git
          </Link>
          <Link
            href="https://github.com/jakeojeff"
            className="ml-2 font-bold text-white p-2 pl-4 pr-4 rounded-t-full hover:bg-amber-300 hover:text-gray-950/50 duration-500"
          >
            More
          </Link>

          <div className="w-[80vw] flex flex-col p-8 sm:p-12 md:container bg-gray-900/25 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 text-center">
            <div className="flex justify-end items-end w-full">
              <Link
                href="/info"
                className="animate-pulse text-white text-2xl font-bold px-3 py-1 rounded-2xl hover:bg-gray-800 transition-colors duration-200"
              >
                ?
              </Link>
            </div>

            <Image
              src="/logo.png"
              width={1000 / 1.4}
              height={220 / 1.4}
              alt="Main Logo"
            />
            <h2 className="text-md sm:text-2xl font-bold text-gray-300 mt-2">
              Join or Host a Party!
            </h2>
            <h3 className="text-gray-400 mt-1 text-sm sm:text-md">
              Prioritizing privacy over anything!
            </h3>

            <div className="flex gap-2 justify-center mt-6 flex-wrap">
              {[
                { href: "/host", label: "Host Party" },
                { href: "/join", label: "Join Party" },
              ].map(({ href, label }) => (
                <div key={label} className={btnStyle.container}>
                  <div className={btnStyle.background} />
                  <div className={btnStyle.image} />
                  <Link href={href} className={btnStyle.link}>
                    {label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>

  );
}
