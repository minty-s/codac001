const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// 🎤 Add mic button
const micButton = document.createElement('button');
micButton.type = 'button';
micButton.textContent = '🎤';
micButton.style.padding = '0 1rem';
micButton.style.background = '#e3b04b';
micButton.style.color = '#fff';
micButton.style.border = 'none';
micButton.style.borderRadius = '8px';
micButton.style.cursor = 'pointer';
micButton.style.fontSize = '1rem';
chatForm.appendChild(micButton);

// 🧠 Handle form submit
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  // Show user message
  const userMsg = document.createElement('div');
  userMsg.textContent = `🧑‍🎓: ${message}`;
  chatBox.appendChild(userMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  userInput.value = ''; // Clear input early

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    // Show bot reply
    const botMsg = document.createElement('div');
    botMsg.textContent = `🤖: ${data.reply}`;
    chatBox.appendChild(botMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    // 🔊 Text-to-Speech (TTS)
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // Stop any ongoing speech
      const tts = new SpeechSynthesisUtterance(data.reply);
      tts.lang = 'en-US';
      tts.rate = 1;
      speechSynthesis.speak(tts);
    } else {
      console.warn('TTS not supported in this browser.');
    }

  } catch (err) {
    console.error(err);
    const errMsg = document.createElement('div');
    errMsg.textContent = '⚠️ Error connecting to AI. Please try again.';
    chatBox.appendChild(errMsg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

// 🎙️ Speech-to-Text on mic click
micButton.addEventListener('click', () => {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    alert('Speech Recognition not supported in your browser.');
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  micButton.disabled = true;
  micButton.textContent = '🎙️ Listening...';

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
    micButton.textContent = '🎤';
    micButton.disabled = false;
  };

  recognition.onerror = () => {
    micButton.textContent = '🎤';
    micButton.disabled = false;
  };

  recognition.onend = () => {
    micButton.textContent = '🎤';
    micButton.disabled = false;
  };
});
