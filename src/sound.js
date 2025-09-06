async function playSound(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await ui.audio.decodeAudioData(arrayBuffer);

  const source = ui.audio.createBufferSource();

  source.playbackRate.value = 0.95 + Math.random() * 0.1;
  source.buffer = audioBuffer;
  source.connect(ui.audio.destination);
  source.start();
}
