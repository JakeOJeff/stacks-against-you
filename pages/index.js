import Link from "next/link";

export default function Home() {
  return (
    <main>

      <h1>Stacks Against You</h1>
      <h2>Join or Host a Party!</h2>

      <Link href="/host">Host a Party</Link>
      <Link href="/join">Join a Party</Link>

    </main>    
  );
}
