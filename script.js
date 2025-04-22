// script.js
let listening = false;
let recognition;

document.getElementById("bubble").addEventListener("click", () => {
  if (!listening) startListening();
});

document.getElementById("stop").addEventListener("click", () => {
  if (recognition) recognition.stop();
  listening = false;
  document.getElementById("status").innerText = "Conversation arrêtée";
});

function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "fr-FR";
  recognition.interimResults = false;

  recognition.onstart = () => {
    listening = true;
    document.getElementById("status").innerText = "Écoute...";
  };

  recognition.onend = () => {
    listening = false;
    document.getElementById("status").innerText = "Réflexion de l'IA...";
  };

  recognition.onresult = async (event) => {
    const text = event.results[0][0].transcript;
    document.getElementById("status").innerText = "Tu as dit : " + text;

    const res = await fetch("https://9c36-2a02-8428-5e22-6e01-a1a5-9dcf-7756-58df.ngrok-free.app/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();
    const response = data.choices?.[0]?.message?.content;

    if (response) {
      speak(response);
      document.getElementById("status").innerText = "IA : " + response;
    }
  };

  recognition.start();
}

function speak(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  synth.speak(utterance);
}

