# Multijoueur à distance (à faire)
Principe : un hôte garde la partie (`Rami.Game`), les amis envoient leurs actions (piocher, poser, défausser) et reçoivent l'état. Il faut un petit relais WebSocket + WebRTC pour voix/vidéo (`Rami.Media.setRemote(pid, stream)`). Un serveur gratuit (ex. Cloudflare Workers) suffit pour commencer. Non hébergé ici : à valider avec toi.
