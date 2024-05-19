export default class Peer {
  peer: RTCPeerConnection;
  constructor() {
    this.peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
    });
  }

  //service methods
  async getOffer() {
    const offer = await this.peer.createOffer();
    this.peer.setLocalDescription(new RTCSessionDescription(offer));
    return offer;
  }
  async setAnswer(answer: RTCSessionDescriptionInit) {
    this.peer.setRemoteDescription(new RTCSessionDescription(answer));
  }

  async getAnswer(offer: RTCSessionDescriptionInit) {
    this.peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.peer.createAnswer();
    this.peer.setLocalDescription(new RTCSessionDescription(answer));

    return answer;
  }
}
