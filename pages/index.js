import Link from "next/link";

const btnTWStyle = "font-bold text-white rounded px-4 py-2"


export default function Home() {
  return (
    <main className="bg-gray-950 flex flex-col items-center
     justify-center h-screen bg-radial-[at_0%_0%]
      from-gray-900 via-gray-700  to-gray-950 to-100%">

      <div>
        <div className="gap-1 flex flex-col md:container md:mx-auto items-center justify-center 
        bg-gray-900/25 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700">
          <h1 className="text-5xl font-bold">Stacks Against You</h1>
          <h2 className="font-bold text-gray-300">Join or Host a Party!</h2>

          <div className="flex gap-2 m-2">
            <Link href="/host" className={`${btnTWStyle} bg-gray-700 hover:bg-[url('/diamonds-design.png')] bg-cover bg-center transition-all duration-500`}>Host Party</Link>
            <Link href="/join" className={`${btnTWStyle} bg-gray-800`}>Join Party</Link>
          </div>
        </div>

      </div>


    </main>
  );
}
