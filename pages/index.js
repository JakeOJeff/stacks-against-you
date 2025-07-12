import Link from "next/link";

const btnTWStyle = "text-white rounded px-4 py-2"


export default function Home() {
  return (
    <main className="bg-gray-950 flex flex-col items-center justify-center h-screen">

      <h1 className="text-5xl font-bold">Stacks Against You</h1>
      <h2 className="font-bold text-gray-300">Join or Host a Party!</h2>

      <div className="flex justify-between gap-2 m-2">
          <Link href="/host" className={`${btnTWStyle} bg-blue-600`}>Host a Party</Link>
          <Link href="/join" className={`${btnTWStyle} bg-green-600`}>Join a Party</Link>

      </div>

    </main>    
  );
}
