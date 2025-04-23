let listening = false;
let recognition;

const statusEl = document.getElementById("status");
const bubbleEl = document.getElementById("bubble");
const stopBtn = document.getElementById("stop");

bubbleEl.addEventListener("click", () => {
  if (!listening) startListening();
});

stopBtn.addEventListener("click", () => {
  if (recognition) recognition.stop();
  listening = false;
  statusEl.innerText = "🛑 Conversation arrêtée.";
});

function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "fr-FR";
  recognition.interimResults = false;

  recognition.onstart = () => {
    listening = true;
    statusEl.innerText = "🎤 Je t'écoute...";
  };

  recognition.onend = () => {
    listening = false;
    statusEl.innerText = "🤔 Réflexion de l'IA...";
  };

  recognition.onerror = (event) => {
    statusEl.innerText = "❌ Erreur micro : " + event.error;
    listening = false;
  };

  recognition.onresult = async (event) => {
    const text = event.results[0][0].transcript;
    statusEl.innerText = "🗣️ Tu as dit : " + text;

    try {
      const res = await fetch("https://warm-clowns-wish.loca.lt/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();
      console.log("Réponse IA brute :", data);

const aiResponse = data.choices?.[0]?.message?.content || "L'IA n'a pas pu répondre.";

      console.log("L'IA répond :", aiResponse);

      statusEl.innerText = "💬 IA : " + aiResponse;
      speak(aiResponse);
    } catch (err) {
      console.error("❌ Erreur de requête :", err);
      statusEl.innerText = "❌ Erreur de communication avec le serveur.";
    }
  };

  recognition.start();
}

function speak(text) {
  const synth = window.speechSynthesis;
  if (!synth) {
    console.warn("Synthèse vocale non supportée");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  synth.speak(utterance);
}
