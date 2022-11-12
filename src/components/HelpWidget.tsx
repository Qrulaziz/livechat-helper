import { useRef, useState } from "react";
import { trpc } from "../utils/trpc";
import type {RtmChannel, RtmMessage} from 'agora-rtm-sdk';
import type { helpRequest } from "@prisma/client";

export type TMessage = {
    message: string;
    id: string;
    sender: string;
}

export const HelpWidget = () => {
    const createHelpRequestMut = trpc.helpRequest.createHelpRequest.useMutation();
    const deleteHelpRequestMut = trpc.helpRequest.deleteHelpRequest.useMutation();

    const [isChatDisplayed, setIsChatDisplayed] = useState(false);
    const [text, setText] = useState("");
    const [senderId, setSenderId] = useState('0');

    const [messages, setMessages] = useState<TMessage[]>([
        {message: 'Hello, how can we help you today?', id: 'banj2kdmd', sender: '1'},
    ]);

    const channelRef = useRef<RtmChannel | null>(null);
    const helpRequestRef = useRef<helpRequest | null>(null)

    const handleOpenSupportWidget = async () => {
        setIsChatDisplayed(true);
        const helpRequest = await createHelpRequestMut.mutateAsync();
        const { default: AgoraRTM } = await import("agora-rtm-sdk");
        const client = AgoraRTM.createInstance(process.env.NEXT_PUBLIC_AGORA_ID!);
        await client.login({
            uid: `${Math.floor(Math.random() * 250)}`,
            token: undefined,
        });
        helpRequestRef.current = helpRequest;
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

    const handleCloseWidget = async () => {
        setIsChatDisplayed(false);
        channelRef.current?.leave();
        channelRef.current = null;
        if (!helpRequestRef.current) return;
        await deleteHelpRequestMut.mutateAsync({
            id: helpRequestRef.current.id,
        });
        helpRequestRef.current = null;
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
                    sender: senderId,
                },
        ]);
        setText("");
    };

    return isChatDisplayed ? ( 
        <div className="
         flex flex-col justify-between
         fixed bottom-10 right-10 h-96 w-72 bg-white p-6">
            <button className="absolute top-2 right-2 hover:text-red-400" onClick={handleCloseWidget}>X</button>

            <ul className="h-[400px] overflow-auto">
                {messages.map(({message, id, sender}) => <li 
                className={`rounded p-1 mb-2 ${sender === senderId ? 'bg-gray-50' : 'bg-blue-400'}`}
                key={id}>{message}</li>)}
            </ul>
            <form onSubmit={handleSendMessage} className="flex">
                <input value={text} onChange={e => setText(e.target.value)} className="w-full border border-gray-600 p-1 px-2" />
                <button className="bg-blue-400 p-2 px-5 hover:bg-blue-500 cursor-pointer">Send</button>
            </form>
            
        </div> 
    ) : (
        <button onClick={handleOpenSupportWidget} className="fixed bottom-10 right-10 bg-blue-400 p-2 px-5 hover:bg-blue-500 cursor-pointer">Need help?</button>
    );
    
    
}