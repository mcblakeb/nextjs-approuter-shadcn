'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { translateText } from '@/lib/translate';
//import Image from 'next/image'

import { useCallback, useEffect, useState } from 'react';

export default function Home() {
  const [translation, setTranslation] = useState('');
  const speakWord = useCallback((word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'es-ES'; // Set to Spanish pronunciation
    speechSynthesis.speak(utterance);
  }, []);

  const [wordsAndTranslations, setWordsAndTranslations] = useState<
    { word: string; translation: string }[]
  >([]);

  let words: string[] = [];
  useEffect(() => {
    words = ['Vamos', 'a', 'la', 'casa', 'cuando', 'tu', 'quieres'];
    const fetchTranslations = async () => {
      const translation = await translateText(words.join(' '));
      setWordsAndTranslations(
        words.map((word, index) => ({
          word,
          translation: translation,
        }))
      );
    };
    fetchTranslations();
  }, []);

  return (
    <main>
      <div className="flex h-dvh bg-green-100">
        <div className="bg-blue-100 w-52 text-amber-950 h-screen">1st col</div>
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-cyan-700 to-cyan-900">
          <p className="text-3xl text-white">
            {wordsAndTranslations.map((item, index) => (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span
                        key={index}
                        className="cursor-pointer hover:underline hover:decoration-dotted"
                        onClick={() => speakWord(item.word)}
                      >
                        {item.word}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.translation}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span>&nbsp;</span>
              </>
            ))}
          </p>
        </div>
      </div>
    </main>
  );
}
