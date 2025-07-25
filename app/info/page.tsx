"use client";

import PageWrapper from "@/components/PageWrapper";

export default function Info() {


    return (
                   <PageWrapper>
       
             <main className="relative flex flex-col items-center justify-center h-screen overflow-hidden">
            <div>
                <div className="w-[80vw] flex flex-col p-8 sm:p-12 items-start bg-gray-900/25 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 text-center">

                    <div className="">
                        <h1 className="text-4xl text-white font-extrabold ">Stacks Against You Guide</h1>
                        <hr className="mt-5 mb-5 w-full h-0.5 bg-gray-500 border-0" />
                    </div>
                    <div className="items-start flex flex-col text-left" >
                        <h2 className="text-white font-bold text-2xl">What is Stacks Against You?</h2>
                        <p className="ml-4 text-gray-500"><strong>Stacks Against You</strong> is a privacy focused chatting app which is made on Websockets and works without a database. Caddy has been used to provide a secure reverse proxy to the host in terms of safety.  </p>
                        <hr className="mt-5 mb-5 w-full h-0.5 bg-gray-500 border-0" />
                    </div>
                    <div className="items-start flex flex-col text-left" >
                        <h2 className="text-white font-bold text-2xl">Hosting a Room</h2>
                        <div className="ml-4">
                            <p className=" text-gray-500">Hosting a room on Stacks Against You is easy! There are two ways to do that:</p>
                            <ul className="ml-8 list-disc text-gray-500">
                                <li>Head over to the homepage, find and click on the host button to navigate to the <a href="/host" className="underline font-bold hover:text-gray-100 duration-500">host page</a>.
                                    A room code will be generated for you. Enter your username and then share the room code for others to join it.</li>
                                <li>You can create custom room codes by navigating over to the <a href="/host" className="underline font-bold hover:text-gray-100 duration-500">join page</a>. and entering custom room codes. If the room does not exist already, it will be created for you, else you would join the room</li>
                            </ul>
                        </div>

                        <hr className="mt-5 mb-5 w-full h-0.5 bg-gray-500 border-0" />
                    </div>
                </div>
            </div>

        </main> 
        </PageWrapper>
    )
}
