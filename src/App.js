import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [equipe, setEquipe] = useState([]); // Exemple d'équipes
  const [joueurs, setJoueurs] = useState([]); 
  const [matchs, setMatchs] = useState([]); 
  const [currentMatch, setCurrentMatch] = useState({
    equipe1: "",
    equipe2: "",
    date: "",
    buts1: [],
    buts2: [],
  }); // Match en cours d'ajout

  const [but, setBut] = useState({ equipe: "", joueur: "", minute: "" }); // But temporaire

  // Récupérer les matchs existants depuis l'API
  useEffect(() => {
    axios.get('https://gahi-said.com/apis/matchs.php').then((res) => {
      setEquipe(res.data);
    });
  }, []);

  // Mettre à jour la liste des joueurs en fonction de l'équipe sélectionnée
  function remplirJoueur(e) {
    const equipe = e.target.value;
    const joueursTemp = [];
    for (let i = 1; i <= 10; i++) {
      joueursTemp.push(`${equipe.substring(0, 2)}j${i}`);
    }
    setJoueurs(joueursTemp);
    setBut({ ...but, equipe }); // Mettre à jour l'équipe dans l'état "but"
  }

  // Ajouter un but
  function addBut() {
    if (!but.equipe || !but.joueur || !but.minute) {
      alert("Veuillez remplir toutes les informations du but !");
      return;
    }

    // Ajouter le but à la bonne équipe
    const newMatch = { ...currentMatch };
    if (but.equipe === currentMatch.equipe1) {
      newMatch.buts1.push({ joueur: but.joueur, minute: but.minute });
    } else if (but.equipe === currentMatch.equipe2) {
      newMatch.buts2.push({ joueur: but.joueur, minute: but.minute });
    } else {
      alert("L'équipe choisie n'est pas valide !");
      return;
    }

    setCurrentMatch(newMatch); // Mettre à jour le match en cours
    setBut({ equipe: "", joueur: "", minute: "" }); // Réinitialiser le formulaire des buts
  }

  // Ajouter un match
  function addMatch() {
    if (!currentMatch.equipe1 || !currentMatch.equipe2 || !currentMatch.date) {
      alert("Veuillez remplir toutes les informations du match !");
      return;
    }

    setMatchs([...matchs, currentMatch]); // Ajouter le match à la liste
    setCurrentMatch({
      equipe1: "",
      equipe2: "",
      date: "",
      buts1: [],
      buts2: [],
    }); // Réinitialiser le match en cours
  }

  return (
    <div className="container">
      <h1>Gestion des Matches</h1>

      {/* Section : Sélection des équipes */}
      <div className="section">
        <div className="section-title">Sélection des équipes</div>
        <select
          value={currentMatch.equipe1}
          onChange={(e) => setCurrentMatch({ ...currentMatch, equipe1: e.target.value })}
        >
          <option value="">Choisir équipe A</option>
          {equipe.map((equi) => (
            <option key={equi} value={equi}>
              {equi}
            </option>
          ))}
        </select>
        <select
          value={currentMatch.equipe2}
          onChange={(e) => setCurrentMatch({ ...currentMatch, equipe2: e.target.value })}
        >
          <option value="">Choisir équipe B</option>
          {equipe.map((equi) => (
            <option key={equi} value={equi}>
              {equi}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={currentMatch.date}
          onChange={(e) => setCurrentMatch({ ...currentMatch, date: e.target.value })}
        />
      </div>

      {/* Section : Ajout des buts */}
      <div className="section">
        <div className="section-title">Ajouter un but</div>
        <select value={but.equipe} onChange={remplirJoueur}>
          <option value="">Choisir une équipe</option>
          {equipe.map((equi) => (
            <option key={equi} value={equi}>
              {equi}
            </option>
          ))}
        </select>
        <select
          value={but.joueur}
          onChange={(e) => setBut({ ...but, joueur: e.target.value })}
        >
          <option value="">Choisir un joueur</option>
          {joueurs.map((joueur) => (
            <option key={joueur} value={joueur}>
              {joueur}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Minute"
          value={but.minute}
          onChange={(e) => setBut({ ...but, minute: e.target.value })}
        />
        <button onClick={addBut}>Ajouter But</button>
      </div>

      {/* Section : Liste des matchs */}
      <div className="section">
        <div className="section-title">Liste des Matches</div>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Équipe 1</th>
              <th>Équipe 2</th>
              <th>Buts Équipe 1</th>
              <th>Buts Équipe 2</th>
            </tr>
          </thead>
          <tbody>
            {matchs.map((match, index) => (
              <tr key={index}>
                <td>{match.date}</td>
                <td>{match.equipe1}</td>
                <td>{match.equipe2}</td>
                <td>
                  {match.buts1.map((but, i) => (
                    <p key={i}>
                      {but.joueur} à {but.minute} min
                    </p>
                  ))}
                </td>
                <td>
                  {match.buts2.map((but, i) => (
                    <p key={i}>
                      {but.joueur} à {but.minute} min
                    </p>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addMatch}>Ajouter Match</button>
      </div>
    </div>
  );
}

export default App;
