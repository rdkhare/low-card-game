'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export default function Home() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCard, setCurrentCard] = useState({ suit: '', value: '' });

  const getRandomCard = () => {
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    const randomValue = values[Math.floor(Math.random() * values.length)];
    return { suit: randomSuit, value: randomValue };
  };

  useEffect(() => {
    setCurrentCard(getRandomCard());
  }, []);

  const handleCardClick = () => {
    if (isFlipped) {
      // If card is face-up, just flip it back
      setIsFlipped(false);
    } else {
      // If card is face-down, generate new card and flip it
      setCurrentCard(getRandomCard());
      setIsFlipped(true);
    }
  };

  const getSuitSymbol = (suit: string) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  const getSuitColor = (suit: string) => {
    return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
  };

  return (
    <main className={styles.main}>
      <div 
        className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
        onClick={handleCardClick}
      >
        <div className={styles.cardInner}>
          <div className={styles.cardBack}>
            {/* Card back pattern will be styled in CSS */}
          </div>
          <div 
            className={styles.cardFront}
            style={{ color: getSuitColor(currentCard.suit) }}
          >
            <div className={styles.cardCorner}>
              <div>{currentCard.value}</div>
              <div>{getSuitSymbol(currentCard.suit)}</div>
            </div>
            <div className={styles.cardCenter}>
              {getSuitSymbol(currentCard.suit)}
            </div>
            <div className={`${styles.cardCorner} ${styles.bottomRight}`}>
              <div>{currentCard.value}</div>
              <div>{getSuitSymbol(currentCard.suit)}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
