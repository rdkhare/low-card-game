'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const getCardValue = (value: string): number => {
  if (value === 'A') return 14;
  if (value === 'K') return 13;
  if (value === 'Q') return 12;
  if (value === 'J') return 11;
  return parseInt(value);
};

const getDisplayValue = (numericValue: number): string => {
  if (numericValue > 14) numericValue = 14; // Cap at Ace
  if (numericValue === 14) return 'A';
  if (numericValue === 13) return 'K';
  if (numericValue === 12) return 'Q';
  if (numericValue === 11) return 'J';
  return numericValue.toString();
};

interface Card {
  suit: string;
  value: string;
  numericValue: number;
}

export default function Home() {
  const [isCompetitiveMode, setIsCompetitiveMode] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCard, setCurrentCard] = useState<Card>({ suit: '', value: '', numericValue: 0 });
  const [baseCard, setBaseCard] = useState<Card | null>(null);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [consecutiveLosses, setConsecutiveLosses] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getRandomCard = () => {
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    const randomValue = values[Math.floor(Math.random() * values.length)];
    const numericValue = getCardValue(randomValue);
    return {
      suit: randomSuit,
      value: randomValue,
      numericValue: numericValue
    };
  };

  const applyHandicap = (card: Card, handicap: number): Card => {
    const newNumericValue = card.numericValue + handicap;
    return {
      ...card,
      value: getDisplayValue(newNumericValue),
      numericValue: newNumericValue
    };
  };

  useEffect(() => {
    const initialCard = getRandomCard();
    setCurrentCard(initialCard);
  }, []);

  // Reset game state when switching modes
  useEffect(() => {
    setIsFlipped(false);
    setBaseCard(null);
    setConsecutiveLosses(0);
    setIsTransitioning(false);
    if (!isCompetitiveMode) {
      setWins(0);
      setLosses(0);
    }
  }, [isCompetitiveMode]);

  const handleCardClick = () => {
    if (!isFlipped && !isTransitioning) {
      const newBaseCard = getRandomCard();
      
      if (isCompetitiveMode) {
        const handicap = consecutiveLosses * 2;
        const handicappedCard = handicap > 0 ? applyHandicap(newBaseCard, handicap) : newBaseCard;
        setBaseCard(handicap > 0 ? newBaseCard : null);
        setCurrentCard(handicappedCard);
      } else {
        setCurrentCard(newBaseCard);
      }
      
      setIsFlipped(true);
    } else if (!isCompetitiveMode) {
      // In casual mode, allow flipping back
      setIsFlipped(false);
    }
  };

  const handleTransitionEnd = () => {
    if (!isFlipped) {
      setIsTransitioning(false);
    }
  };

  const handleWin = () => {
    if (!isFlipped || isTransitioning) return;
    setWins(prev => prev + 1);
    setBaseCard(null);
    setConsecutiveLosses(0);
    setIsTransitioning(true);
    setIsFlipped(false);
  };

  const handleLoss = () => {
    if (!isFlipped || isTransitioning) return;
    setLosses(prev => prev + 1);
    setConsecutiveLosses(prev => prev + 1);
    setIsTransitioning(true);
    setIsFlipped(false);
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

  const renderCard = (card: Card, isShadow = false) => (
    <>
      <div className={styles.cardBack} />
      <div className={styles.cardFront} style={{ color: getSuitColor(card.suit) }}>
        <div className={styles.cardCorner}>
          <div>{card.value}</div>
          <div>{getSuitSymbol(card.suit)}</div>
        </div>
        <div className={styles.cardCenter}>
          {getSuitSymbol(card.suit)}
        </div>
        <div className={`${styles.cardCorner} ${styles.bottomRight}`}>
          <div>{card.value}</div>
          <div>{getSuitSymbol(card.suit)}</div>
        </div>
      </div>
    </>
  );

  return (
    <main className={styles.main}>
      <div className={styles.modeToggle}>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={isCompetitiveMode}
            onChange={(e) => setIsCompetitiveMode(e.target.checked)}
          />
          <span className={styles.slider}></span>
        </label>
        <span className={styles.modeLabel}>
          {isCompetitiveMode ? 'Competitive Mode' : 'Casual Mode'}
        </span>
      </div>

      {isCompetitiveMode && (
        <div className={styles.scoreBoard}>
          {wins} - {losses}
          {consecutiveLosses > 0 && (
            <span className={styles.handicap}>
              {' '}(+{consecutiveLosses * 2})
            </span>
          )}
        </div>
      )}
      
      <div className={styles.cardContainer}>
        {isCompetitiveMode && baseCard && (
          <div className={`${styles.previousCard} ${isFlipped ? styles.flipped : ''}`}>
            <div className={styles.cardInner}>
              {renderCard(baseCard, true)}
            </div>
          </div>
        )}
        
        <div 
          className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
          onClick={handleCardClick}
          onTransitionEnd={handleTransitionEnd}
        >
          <div className={styles.cardInner}>
            {renderCard(currentCard)}
          </div>
        </div>
      </div>

      {isCompetitiveMode && (
        <div className={styles.buttonContainer}>
          <button 
            className={styles.lossButton}
            onClick={handleLoss}
            disabled={!isFlipped || isTransitioning}
          >
            I Lost
          </button>
          <button 
            className={styles.winButton}
            onClick={handleWin}
            disabled={!isFlipped || isTransitioning}
          >
            I Won
          </button>
        </div>
      )}
    </main>
  );
}
