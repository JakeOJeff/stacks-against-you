import Link from "next/link";

const givenFont = ""
const btnTWStyle = "font-bold text-white rounded px-4 py-2"
const btnTWStyleContainer = "relative w-48 h-12 overflow-hidden rounded-3xl group";
const btnTWStyleBackGround = "absolute inset-0 bg-gray-700 transition-all duration-500 rounded-3xl";
const btnTWStyleImage = "absolute inset-0 bg-[url('/diamonds-design.png')] bg-contain translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out rounded-3xl";
const btnTWStyleLink = `${givenFont}relative z-10 w-full h-full flex items-center justify-center text-white ${btnTWStyle}`;


export default function Home() {
  return (
    <main className="bg-gray-950 flex flex-col items-center
     justify-center h-screen bg-radial-[at_0%_0%]
      from-gray-900 via-gray-700  to-gray-950 to-100%">

      <div>
        <div className="gap-1 flex flex-col md:container md:mx-auto items-center justify-center 
        bg-gray-900/25 backdrop-blur-lg p-12 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700">
          <h1 className="text-6xl font-bold">Stacks Against You</h1>
          <h2 className="font-bold text-2xl text-gray-300">Join or Host a Party!</h2>
          <h3 className="text-gray-400"> You don't have anyone. You have yourself.
          </h3>

          <div className="flex gap-2 mt-4">
            <div className={btnTWStyleContainer}>
              <div className={btnTWStyleBackGround}></div>
              <div className={btnTWStyleImage}></div>
              <Link href="/host" className={btnTWStyleLink}>
                Host Party
              </Link>
            </div>

            <div className={btnTWStyleContainer}>
              <div className={btnTWStyleBackGround}></div>
              <div className={btnTWStyleImage}></div>
              <Link href="/join" className={btnTWStyleLink}>
                Join Party
              </Link>
            </div>

          </div>
        </div>

      </div>


    </main>
  );
}
