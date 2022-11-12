import { useState } from "react";

type TMessage = {
    message: string;
    id: string;
    sender: string;
}

export const HelpWidget = () => {
    const [isChatDisplayed, setIsChatDisplayed] = useState(false);
    const [senderId, setSenderId] = useState('0')

    const [messages, setMessages] = useState<TMessage[]>([
        {message: 'Hello, how can we help you today?', id: 'banj2kdmd', sender: '1'},
        {message: 'I need help fixing my computer', id: 'nma89klj', sender: '0'}
    ]);

    return isChatDisplayed ? ( 
        <div className="
         flex flex-col justify-between
         fixed bottom-10 right-10 h-96 w-72 bg-white p-6">
            <button className="absolute top-2 right-2 hover:text-red-400" onClick={() => setIsChatDisplayed(false)}>X</button>

            <ul>
                {messages.map(({message, id, sender}) => <li 
                className={`rounded p-1 mb-2 ${sender === senderId ? 'bg-gray-50' : 'bg-blue-400'}`}
                key={id}>{message}</li>)}
            </ul>
            <form className="flex">
                <input className="w-full border border-gray-600 p-1 px-2" />
                <button className="bg-blue-400 p-2 px-5 hover:bg-blue-500 cursor-pointer">Send</button>
            </form>
            
        </div> 
    ) : (
        <button onClick={() => setIsChatDisplayed(true)} className="fixed bottom-10 right-10 bg-blue-400 p-2 px-5 hover:bg-blue-500 cursor-pointer">Need help?</button>
    );
    
    
}