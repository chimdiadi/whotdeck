import { Deck, renderCard, renderGrid, mergeTheme } from 'whotdeck';

class WhotDemo {
  private deck: Deck;
  private drawnCards: any[] = [];
  private hands: any[][] = [];
  private currentTheme = 'light';

  constructor() {
    this.deck = new Deck();
    this.initializeEventListeners();
    this.updateDisplay();
  }

  private initializeEventListeners(): void {
    // Deck controls
    document.getElementById('newDeck')?.addEventListener('click', () => this.createNewDeck());
    document.getElementById('shuffle')?.addEventListener('click', () => this.shuffleDeck());
    document.getElementById('reset')?.addEventListener('click', () => this.resetDeck());

    // Actions
    document.getElementById('draw')?.addEventListener('click', () => this.drawCards());
    document.getElementById('deal')?.addEventListener('click', () => this.dealCards());

    // Display controls
    document.getElementById('exportSvg')?.addEventListener('click', () => this.exportSvg());
    document.getElementById('gridCols')?.addEventListener('change', () => this.updateDisplay());

    // Theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const theme = (e.target as HTMLElement).getAttribute('data-theme');
        if (theme) this.setTheme(theme);
      });
    });
  }

  private createNewDeck(): void {
    const numDecks = parseInt((document.getElementById('numDecks') as HTMLInputElement).value) || 1;
    const whotLabel = (document.getElementById('whotLabel') as HTMLInputElement).value || 'WHOT';
    const randomSeed =
      (document.getElementById('randomSeed') as HTMLInputElement).value || undefined;
    const renderer = (document.getElementById('renderer') as HTMLSelectElement).value as
      | 'template'
      | 'programmatic';

    this.deck = new Deck({
      numDecks,
      whotLabel,
      randomSeed: randomSeed || undefined,
      renderer,
    });

    this.drawnCards = [];
    this.hands = [];
    this.updateDisplay();
  }

  private shuffleDeck(): void {
    this.deck.shuffle();
    this.updateDisplay();
  }

  private resetDeck(): void {
    this.deck.reset();
    this.drawnCards = [];
    this.hands = [];
    this.updateDisplay();
  }

  private drawCards(): void {
    const count = parseInt((document.getElementById('drawCount') as HTMLInputElement).value) || 1;

    try {
      const drawn = this.deck.draw(count);
      this.drawnCards.push(...drawn);
      this.updateDisplay();
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private dealCards(): void {
    const players =
      parseInt((document.getElementById('dealPlayers') as HTMLInputElement).value) || 4;
    const cardsPerPlayer =
      parseInt((document.getElementById('dealCards') as HTMLInputElement).value) || 5;

    try {
      this.hands = this.deck.deal({ players, cardsPerPlayer });
      this.updateDisplay();
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private updateDisplay(): void {
    this.updateStatus();
    this.updateCardsDisplay();
    this.updateHandsDisplay();
  }

  private updateStatus(): void {
    const deckSizeEl = document.getElementById('deckSize');
    const totalCardsEl = document.getElementById('totalCards');

    if (deckSizeEl) deckSizeEl.textContent = this.deck.size().toString();
    if (totalCardsEl) totalCardsEl.textContent = this.deck.getFullDeckSize().toString();
  }

  private updateCardsDisplay(): void {
    const container = document.getElementById('cardsContainer');
    if (!container) return;

    container.innerHTML = '';

    if (this.drawnCards.length === 0) {
      return;
    }

    const cols = parseInt((document.getElementById('gridCols') as HTMLInputElement).value) || 4;
    const renderer = (document.getElementById('renderer') as HTMLSelectElement).value as
      | 'template'
      | 'programmatic';

    try {
      const svgString = renderGrid(this.drawnCards, cols, {
        width: 100,
        height: 140,
        renderer,
        theme: this.getCurrentTheme(),
        className: 'card-svg',
      });

      // Create a wrapper div for the SVG
      const wrapper = document.createElement('div');
      wrapper.innerHTML = svgString as string;
      container.appendChild(wrapper.firstElementChild!);
    } catch (error) {
      console.error('Error rendering cards:', error);
      container.innerHTML = `<p style="color: red;">Error rendering cards: ${error instanceof Error ? error.message : 'Unknown error'}</p>`;
    }
  }

  private updateHandsDisplay(): void {
    const section = document.getElementById('handsSection');
    const container = document.getElementById('handsContainer');

    if (!section || !container) return;

    if (this.hands.length === 0) {
      section.style.display = 'none';
      return;
    }

    section.style.display = 'block';
    container.innerHTML = '';

    const renderer = (document.getElementById('renderer') as HTMLSelectElement).value as
      | 'template'
      | 'programmatic';

    this.hands.forEach((hand, index) => {
      const handDiv = document.createElement('div');
      handDiv.className = 'hand';

      const handTitle = document.createElement('h3');
      handTitle.textContent = `Player ${index + 1} (${hand.length} cards)`;
      handDiv.appendChild(handTitle);

      const cardsDiv = document.createElement('div');
      cardsDiv.className = 'hand-cards';

      hand.forEach(card => {
        try {
          const svgString = renderCard(card, {
            width: 80,
            height: 112,
            renderer,
            theme: this.getCurrentTheme(),
            className: 'card-svg',
          });

          const cardWrapper = document.createElement('div');
          cardWrapper.innerHTML = svgString as string;
          cardsDiv.appendChild(cardWrapper.firstElementChild!);
        } catch (error) {
          console.error('Error rendering card:', error);
        }
      });

      handDiv.appendChild(cardsDiv);
      container.appendChild(handDiv);
    });
  }

  private setTheme(theme: string): void {
    this.currentTheme = theme;

    // Remove existing theme classes
    document.body.classList.remove('dark-theme', 'high-contrast-theme');

    // Add new theme class
    if (theme !== 'light') {
      document.body.classList.add(`${theme}-theme`);
    }

    // Update theme button states
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.remove('active');
      if ((btn as HTMLElement).getAttribute('data-theme') === theme) {
        btn.classList.add('active');
      }
    });

    this.updateDisplay();
  }

  private getCurrentTheme() {
    const baseTheme = {
      width: 100,
      height: 140,
    };

    switch (this.currentTheme) {
      case 'dark':
        return mergeTheme({
          ...baseTheme,
          fillColor: '#34495e',
          strokeColor: '#ecf0f1',
          suitColors: {
            circle: '#e74c3c',
            triangle: '#e74c3c',
            square: '#e74c3c',
            star: '#e74c3c',
            cross: '#e74c3c',
            whot: '#e74c3c',
          },
        });
      case 'high-contrast':
        return mergeTheme({
          ...baseTheme,
          fillColor: '#000000',
          strokeColor: '#ffffff',
          suitColors: {
            circle: '#ffff00',
            triangle: '#ffff00',
            square: '#ffff00',
            star: '#ffff00',
            cross: '#ffff00',
            whot: '#ffff00',
          },
        });
      default:
        return mergeTheme(baseTheme);
    }
  }

  private exportSvg(): void {
    if (this.drawnCards.length === 0) {
      alert('No cards to export');
      return;
    }

    const cols = parseInt((document.getElementById('gridCols') as HTMLInputElement).value) || 4;
    const renderer = (document.getElementById('renderer') as HTMLSelectElement).value as
      | 'template'
      | 'programmatic';

    try {
      const svgString = renderGrid(this.drawnCards, cols, {
        width: 100,
        height: 140,
        renderer,
        theme: this.getCurrentTheme(),
      });

      // Create blob and download
      const blob = new Blob([svgString as string], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `whot-cards-${new Date().toISOString().slice(0, 10)}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Error exporting SVG: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Initialize the demo when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new WhotDemo();
});
