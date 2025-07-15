"use client";
import Link from "next/link";
import Image from 'next/image' // Logo Font is Pristina

const btnStyle = {
  container: "relative w-40 sm:w-48 h-12 overflow-hidden rounded-3xl group",
  background: "absolute inset-0 transition-all duration-500 rounded-3xl",
  image: "absolute inset-0 bg-[url('/diamonds-design.png')] bg-contain translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out rounded-3xl",
  link: "relative z-10 w-full h-full flex items-center justify-center font-bold text-white px-4 py-2  transition-colors duration-500 rounded-3xl",
};

export default function Home() {
  return (
 <main className="flex flex-col items-center justify-center h-screen bg-gray-950 bg-radial-[at_0%_0%] from-gray-900 via-gray-800 to-gray-950">

        <div><div className="w-[80vw] flex flex-col p-8 sm:p-12 md:container  bg-gray-900/25 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 text-center">
          <Image
            src="/logo.png"
            width={1000 / 1.4}
            height={220 / 1.4}
            alt="Main Logo" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-300 mt-2">Join or Host a Party!</h2>
          <h3 className="text-gray-400 mt-1">Prioritizing privacy over anything!</h3>

          <div className="flex gap-2 justify-center mt-6 flex-wrap">
            {[
              { href: "/host", label: "Host Party" },
              { href: "/join", label: "Join Party" },
            ].map(({ href, label }) => (
              <div key={label} className={btnStyle.container}>
                <div className={btnStyle.background} />
                <div className={btnStyle.image} />
                <Link href={href} className={btnStyle.link}>{label}</Link>
              </div>
            ))}
          </div>
        </div></div>

      </main>
  );
}
