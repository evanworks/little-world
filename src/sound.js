async function playSound(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await ui.audio.decodeAudioData(arrayBuffer);

  const source = ui.audio.createBufferSource();
  source.playbackRate.value = 0.95 + Math.random() * 0.1;
  source.buffer = audioBuffer;

  // Connect directly to master gain
  source.connect(ui.gain);
  source.start();
}

function initializeGain() {
  ui.gain = ui.audio.createGain();
  ui.gain.gain.value = globals.volume ?? 1;
  ui.gain.connect(ui.audio.destination);
}