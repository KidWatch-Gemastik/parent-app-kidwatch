import ChatWindow from "../components/ChatWindow"

export default function ChatPage({ params }: { params: { childId: string } }) {
    return (
        <div className="h-screen p-4">
            <ChatWindow childId={params.childId} />
        </div>
    )
}
