import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calculateGagnant(squares) {
  // Combinaisons gagnantes
  const lines = [
    // Lignes
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Colonnes
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonales
    [0, 4, 8],
    [2, 4, 6],
  ];

  // On parcourt chacune des combinaisons gagnantes
  for(let i = 0 ; i < lines.length ; i++) {
    // On affecte des variables avec les valeurs de la combinaison
    const [a, b, c] = lines[i];

    // Si la première valeur de la combinaison n'est pas nulle et si la deuxième
    // et la troisième valeur de la combinaison sont égales à la première,
    // alors on retourne la valeur
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  // S'il n'y a aucune combinaison ganante dans la grille, alors on retourne null
  return null;
}

function isPartieNulle(squares) {
  // S'il y a un gagnant, alors la partie n'est pas nulle
  if(calculateGagnant(squares) != null)
    return false;

  // On parcourt chaque case
  for(let i = 0 ; i < 9 ; i++) {
    // Si la case n'est pas remplie avec un X ou un O, alors la partie n'est pas nulle
    if(squares[i] != 'X' && squares[i] != 'O')
      return false;
  }

  return true;
}

// Fonction qui renvoie le code HTML d'un bouton
function Square(props) {
  let className = "square ";

  if(props.color == "blue")
    className += "blue";
  else if(props.color == "red")
    className += "red";

  return (
    <button
      className={className}
      // La prop onClick est définie dans Board
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    // Le constructeur de la classe parent doit être appelé avant d'utiliser this.
    super(props);
    // state correspond à l'état du jeu.
    this.state = {
      // On initialise un tableau de 9 carrés vides.
      squares: Array(9).fill(null),
      // Le joueur qui commence est X.
      xIsNext: true,
      // Le nombre de parties gagnées pour X et pour O est de 0.
      nbPartiesGagneesX: 0,
      nbPartiesGagneesO: 0,
    };
  }

  /* Gestionnaire de clic sur une case */
  handleClick(i) {
    const squares = this.state.squares;

    // Si quelqu'un a gagné la partie ou si la case est remplie, on sort.
    if(calculateGagnant(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    /* setState() planifie des modifications à l’état local du composant, et indique
       à React que ce composant et ses enfants ont besoin d’être rafraîchis une
       fois l’état mis à jour. */
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext
    });
  }

  /* Gestionnaire du clic sur le bouton "Rejouer" */
  handleClickRejouer() {
    // On détermine s'il y a un gagnant.
    const winner = calculateGagnant(this.state.squares);
    // On détermine si la pertie est nulle.
    const partieNulle = isPartieNulle(this.state.squares);

    // S'il y a un gagnant ou si la partie est nulle
    if(winner || partieNulle) {
      // On réinitialise toutes les cases du jeu à null.
      for(let i = 0 ; i < 9 ; i++) {
        this.state.squares[i] = null;
        this.renderSquare(i);
      }

      // On raffraichit l'affichage des cases.
      this.setState({
        squares: this.state.squares
      });
    }
    else
      alert("Veuillez finir la partie.");
  }

  // Fonction qui va permettre de générer le code HTML d'une case.
  renderSquare(i) {
    // Les X sont en bleu
    if(this.state.squares[i] == "X")
      this.color = "blue";
    // Les O sont en rouge
    else if(this.state.squares[i] == "O")
      this.color = "red";

    // On retourne le code HTML de la case.
    return <Square
      color={this.color}
      value={this.state.squares[i]}
      onClick={() => this.handleClick(i)} />;
  }

  // Fonction qui va générer le code HTML de la grille, des informations
  // ainsi que du bouton.
  render() {
    // On détermine s'il y a un gagnant.
    const winner = calculateGagnant(this.state.squares);
    // On détermine si la pertie est nulle.
    const partieNulle = isPartieNulle(this.state.squares);
    let status;

    // Affichage du gagnant
    if(winner) {
      status = winner + ' a gagné';

      // Si la gagnant est X, alors on incrémente son nombre de parties gagnées de 1.
      if(winner == 'X') {
        this.state.nbPartiesGagneesX++;
      }
      // Pareil pour O.
      else if(winner == 'O') {
        this.state.nbPartiesGagneesO++;
      }
    }
    // Affichage match nul
    else if(partieNulle) {
      status = 'Match nul';
    }
    // Affichage joueur suivant
    else {
      status = 'Suivant : ' + (this.state.xIsNext ? 'X' : 'O');
    }

    // On retourne HTML du jeu.
    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
        <div class="scores">
          X : {this.state.nbPartiesGagneesX} - O : {this.state.nbPartiesGagneesO}
        </div>
        <div class="rejouer">
          <button onClick={() => this.handleClickRejouer()}>Rejouer</button>
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div>
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
