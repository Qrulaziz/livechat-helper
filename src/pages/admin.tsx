import { type NextPage } from "next";
import Head from "next/head";
import { useRef, useState } from "react";
import { trpc } from "../utils/trpc";
import type {RtmChannel, RtmMessage} from 'agora-rtm-sdk';
import type { helpRequest } from "@prisma/client";
import type { TMessage } from "../components/HelpWidget";
import { ChatPanel } from "../components/ChatPanel";

const AdminPage: NextPage = () => {

    const helpRequestsQuery = trpc.helpRequest.getHelpRequests.useQuery();
    const channelRef = useRef<RtmChannel | null>(null);
    const [messages, setMessages] = useState<TMessage[]>([]);
    const [text, setText] = useState("");

    const handleOpenRequest = async (helpRequest: helpRequest) => {
        setMessages([]);
        if (channelRef.current) {
            channelRef.current.leave();
            channelRef.current = null;
        }
        const { default: AgoraRTM } = await import("agora-rtm-sdk");
        const client = AgoraRTM.createInstance(process.env.NEXT_PUBLIC_AGORA_ID!);
        await client.login({
            uid: `${Math.floor(Math.random() * 250)}`,
            token: undefined,
        });
        const channel = await client.createChannel(helpRequest.id);
        channelRef.current = channel;
        await channel.join();
        channel.on("ChannelMessage", (message: RtmMessage) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    message: message.text ?? "",
                    id: Math.random() + "",
                    sender: "1",
                },
            ]);
        });
    };

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const channel = channelRef.current;
        channel?.sendMessage({text});
        setMessages((prevMessages) => [
                ...prevMessages,
                {
                    message: text,
                    id: Math.random() + "",
                    sender: "0",
                },
        ]);
        setText("");
    };

  return (
    <>
      <Head>
        <title>Admin Page</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col p-4">
        <h1 className="text-3xl mb-4">
          Admin Page
        </h1>
        <section className="flex gap-8">
            <div className="p-2 rounded bg-white mb-2">
            <h2 className="mb-2 text-xl">Help Request Ids</h2>
                <div className="flex flex-col gap-2">
                    {helpRequestsQuery.data?.map(helpRequest => (
                    <button className="hover:text-blue-400" onClick={() => handleOpenRequest(helpRequest)} key={helpRequest.id}>
                    {helpRequest.id}
                    </button>
                    ))}
                </div>
            </div>
            <ChatPanel
                text={text}
                setText={setText}
                messages={messages}
                handleSendMessage={handleSendMessage}
            />
        </section>
      </main>
    </>
  );
};

export default AdminPage;