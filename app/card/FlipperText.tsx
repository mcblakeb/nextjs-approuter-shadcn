'use client';

import React, { useState } from 'react';
//import { useSpring, a, animated } from '@react-spring/web';
import { Verb } from './verbs';

import styles from './styles.module.css';
import { Button } from '@/components/ui/button';

type CardProps = {
  items: Verb[];
};

type VerbWithShown = Verb & {
  shown?: boolean;
};

export default function FlipperText(props: CardProps) {
  const showItems = props.items.map((item) => ({ ...item, shown: false }));
  const [item, setItem] = useState<Verb>(showItems[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, set] = useState(false);
  // const { transform, opacity } = useSpring({
  //   opacity: flipped ? 1 : 0,
  //   transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
  //   config: { mass: 5, tension: 500, friction: 80 },
  // });
  // const sharedStyles = { opacity, transform };
  // const sharedClassNames = `${styles.c} ${styles.shrink} px-2 flex text-center justify-center items-center card text-slate-900 text-4xl`;

  function nextItem() {
    console.log('nextItem');

    if (currentIndex === showItems.length) {
      setItem(showItems[0]);
    } else {
      const nextIndex = currentIndex + 1;
      setItem(showItems[nextIndex]);
      setCurrentIndex(nextIndex);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-4">
        <div className={styles.absolute_wrapper}>
          <div
            className={styles.container}
            onClick={() => set((state) => !state)}
          >
            TODO
            {/* <animated.div
              className={`${sharedClassNames} bg-slate-100`}
              style={{ ...sharedStyles, opacity: opacity.to((o) => 1 - o) }}
            >
              {item.english}
            </animated.div>
            <animated.div
              className={`${sharedClassNames} bg-green-100`}
              style={{ ...sharedStyles, rotateX: '180deg' }}
            >
              {item.spanish}
            </animated.div> */}
          </div>
        </div>
        <div
          className={`${styles.absolute_wrapper} flex justify-between w-full mt-2`}
        >
          <Button className="mt-2" onClick={() => console.log('clicked')}>
            Back
          </Button>
          <Button className="mt-2" onClick={() => nextItem()}>
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
