import React, { useState, useRef, useEffect } from "react";

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const utteranceRef = useRef(null);

  const chapters = [
    "Chapter 1: Hot Metal. This is an autobiography by Henry M. Rowan about his journey in the steel industry.",
    "Chapter 2: Sparks of Innovation. Rowan explains how creativity and persistence drove breakthroughs.",
    "Chapter 3: Fire Within. This chapter highlights the struggles and motivation behind his success.",
    "Chapter 4: Forging Ahead. Rowan shares lessons about leadership, teamwork, and resilience.",
    "Chapter 5: Legacy of Steel. The story concludes with his contributions to industry and society."
  ];

  // Play current chapter
  const playChapter = (index) => {
    window.speechSynthesis.cancel(); // stop ongoing speech
    const utterance = new SpeechSynthesisUtterance(chapters[index]);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);

    utterance.onend = () => setIsPlaying(false); // reset when finished
  };

  // Play
  const handlePlay = () => {
    if (!isPlaying) {
      playChapter(currentIndex);
    }
  };

  // Pause
  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPlaying(false);
  };

  // Resume
  const handleResume = () => {
    window.speechSynthesis.resume();
    setIsPlaying(true);
  };

  // Stop
  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  // Forward (next chapter)
  const handleForward = () => {
    const nextIndex = (currentIndex + 1) % chapters.length;
    setCurrentIndex(nextIndex);
    playChapter(nextIndex);
  };

  // Backward (previous chapter)
  const handleBackward = () => {
    const prevIndex =
      (currentIndex - 1 + chapters.length) % chapters.length;
    setCurrentIndex(prevIndex);
    playChapter(prevIndex);
  };

  // Auto play first chapter on load
  useEffect(() => {
    playChapter(currentIndex);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-lg font-bold">
        {chapters[currentIndex].split(".")[0]}
      </h2>

      <div className="flex gap-6 text-2xl">
        <button onClick={handleBackward}>⏪</button>
        {isPlaying ? (
          <button onClick={handlePause}>⏸️</button>
        ) : (
          <button onClick={handleResume}>▶️</button>
        )}
        <button onClick={handleForward}>⏩</button>
        <button onClick={handleStop}>⏹️</button>
      </div>
    </div>
  );
};

export default Player;
 