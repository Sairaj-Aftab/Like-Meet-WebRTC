let screen1 = document.getElementById('s1')
let screen2 = document.getElementById('s2')
let camera = document.querySelector('.camera')
let mic = document.querySelector('.mic')

let peerConnection;
let localStream;
let remoteStream;

let servers = {
    iceServer : [
        {
            urls : [ 'stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302' ]
        }
    ]
}

const localStreamInit = async () => {

    localStream = await navigator.mediaDevices.getUserMedia({
        video : true,
        audio : true
    })
    localStream.getAudioTracks()[0].enabled = false
    screen2.srcObject = localStream

}
localStreamInit();

// Create Offer
const createOffers = async () => {
    peerConnection = new RTCPeerConnection(servers)

    // Remote Stream
    remoteStream = new MediaStream();
    screen1.srcObject = remoteStream

    localStream.getTracks().forEach(tracks => {
        peerConnection.addTrack(tracks, localStream)
    })

    peerConnection.ontrack = (e) => {
        e.streams[0].getTracks().forEach(tracks => {
            remoteStream.addTrack(tracks)
        })
    }

    // icecandidate
    peerConnection.onicecandidate = (e) => {
        if (e.candidate) {
            document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription)
        }
    }

    let offer = await peerConnection.createOffer()
    peerConnection.setLocalDescription(offer)
    document.getElementById('offer-sdp').value = JSON.stringify(offer)
}

// Create Answer
const createAnswer = async () => {
    peerConnection = new RTCPeerConnection(servers)

    // Remote Stream
    remoteStream = new MediaStream();
    screen1.srcObject = remoteStream

    localStream.getTracks().forEach(tracks => {
        peerConnection.addTrack(tracks, localStream)
    })

    peerConnection.ontrack = (e) => {
        e.streams[0].getTracks().forEach(tracks => {
            remoteStream.addTrack(tracks)
        })
    }

    // icecandidate
    peerConnection.onicecandidate = (e) => {
        if (e.candidate) {
            document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription)
        } else {
            
        }
    }

    // Get offer
    let offer = document.getElementById('offer-sdp').value;
    offer = JSON.parse(offer)
    peerConnection.setRemoteDescription(offer)

    let answer = await peerConnection.createAnswer()
    peerConnection.setLocalDescription(answer)
    document.getElementById('answer-sdp').value = JSON.stringify(answer)
}

// Add Answer
const addAnswer = () => {
    let answer = document.getElementById('add-answer-sdp').value;
    answer = JSON.parse(answer)
    peerConnection.setRemoteDescription(answer)
}

document.getElementById('create-offer').onclick = () => {
    createOffers()
}
document.getElementById('create-answer').onclick = () => {
    createAnswer()
}
document.getElementById('add-answer').onclick = () => {
    addAnswer()
}

// Camera Toggle

let camVideoStatus = true;
camera.onclick = (e) => {
    camVideoStatus = !camVideoStatus
    localStream.getVideoTracks()[0].enabled = camVideoStatus

    camera.classList.toggle('active')
}

// Audio Toggle
let micStatus = false;
mic.onclick = (e) => {
    micStatus = !micStatus
    localStream.getAudioTracks()[0].enabled = micStatus

    mic.classList.toggle('active')
}
