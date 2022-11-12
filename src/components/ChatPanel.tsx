import type { TMessage } from "./HelpWidget"

export const ChatPanel = ({handleSendMessage, messages, text, setText}: {
    handleSendMessage: any;
    messages: TMessage[];
    text: string;
    setText: (newText: string) => void;
}) => {
    return (
        <div>
            <ul className="h-[400px] overflow-auto">
                {messages.map(({message, id, sender}) => <li 
                className={`rounded p-1 mb-2 ${sender === "1" ? 'bg-gray-50' : 'bg-blue-400'}`}
                key={id}>{message}</li>)}
            </ul>
            <form onSubmit={handleSendMessage} className="flex">
                <input value={text} onChange={e => setText(e.target.value)} className="w-full border border-gray-600 p-1 px-2" />
                <button className="bg-blue-400 p-2 px-5 hover:bg-blue-500 cursor-pointer">Send</button>
            </form>
            </div>
    )
}