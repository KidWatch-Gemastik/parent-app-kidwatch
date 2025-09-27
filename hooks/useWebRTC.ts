import { useRef, useState } from "react"

export function useWebRTC() {
    const pcRef = useRef<RTCPeerConnection | null>(null)
    const [localStream, setLocalStream] = useState<MediaStream | null>(null)
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

    const initCall = async () => {
        pcRef.current = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        })

        return pcRef.current
    }

    return { initCall, localStream, setLocalStream, remoteStream, setRemoteStream, pcRef }
}
