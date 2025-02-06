'use client';

//import Image from 'next/image'

import { useCallback, useEffect, useState } from 'react';

export default function Home() {
  const [translation, setTranslation] = useState('');
  const speakWord = useCallback((word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'es-ES'; // Set to Spanish pronunciation
    speechSynthesis.speak(utterance);
  }, []);

  const words = ['Vamos', 'a', 'la', 'casa', 'cuando', 'tu', 'quieres'];

  useEffect(() => {
    setTranslation("Let's go to the house when you want");
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex h-dvh bg-green-100">
        <div className="bg-blue-100 w-52 text-amber-950">1st col</div>
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-cyan-700 to-cyan-900">
          <p className="text-3xl text-white">
            {words.map((word, index) => (
              <>
                <span
                  key={index}
                  className="cursor-pointer hover:underline hover:decoration-dotted"
                  onClick={() => speakWord(word)}
                  //onMouseEnter={() => translateWord(word)}
                >
                  {word}
                  {translation && (
                    <span className="absolute bg-black text-white text-sm p-1 rounded-md -bottom-6 left-1/2 transform -translate-x-1/2">
                      {translation}
                    </span>
                  )}
                </span>
                <span>&nbsp;</span>
              </>
            ))}
          </p>
        </div>
      </div>
    </main>
  );
}
