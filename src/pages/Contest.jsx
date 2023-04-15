import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Tabs from '../components/Tabs';


const Contest = () => {
  const [contests, setContests] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + '/contests.json'
        );
        setContests(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="Contest">
      {contests.map((contest) => (
        <div key={contest.id}>
          <h1 className="flex items-center text-text-2xl font-normal not-italic leading-[29px] text-black">
            {contest.name}
          </h1>
          <p className="text-base font-bold not-italic leading-[160%] text-black">
            {contest.description}
          </p>
          <p>{contest.rules}</p>
          <p>{contest.prizes}</p>
        </div>
      ))}
      <Tabs>
        <div label="Le concours">
          <h1 className="flex items-center text-text-2xl font-normal not-italic leading-[29px] text-black">
            Présentation du concours photo
          </h1>
          <p className="text-base font-bold not-italic leading-[160%] text-black">
            L’Union Régionale des Conseils d’Architecture d’Urbanisme et de
            l’Environnement (URCAUE) des Hauts-de-France vous propose un
            concours photo intitulé "Paysages en Hauts-de-France, une création
            permanente".
          </p>
          <p className="text-base font-normal not-italic leading-[160%] text-black">
            L’objet de ce concours photo est un appel à talents destiné à
            présenter la diversité des paysages de la région des
            Hauts-de-France, sous un angle révélant la nature mouvante des
            paysages, qui évoluent et se créent en permanence.
          </p>
          <p className="text-base font-bold not-italic leading-[160%] text-black">
            Quand ?
          </p>
          <p className="text-base font-normal not-italic leading-[160%] text-black">
            Du 1er janvier au 31 janvier 2022
          </p>
          <p className="text-base font-bold not-italic leading-[160%] text-black">
            Qui peut voter ?
          </p>
          <p className="text-base font-normal not-italic leading-[160%] text-black">
            Tout habitant des Hauts-de-France (hors professionnels de la
            photographie)
          </p>
          <p className="text-base font-bold not-italic leading-[160%] text-black">
            Qui peut participer ?
          </p>
          <p className="text-base font-normal not-italic leading-[160%] text-black">
            Vous pouvez participer pour les 6 thématiques suivantes :
          </p>
          <ul className="list-disc">
            <li>RELIEF ET PAYSAGES</li>
            <li>EAU ET PAYSAGES</li>
            <li>CULTURES ET PAYSAGES</li>
            <li>PAYSAGES DE GUERRE</li>
            <li>PAYSAGES D'INDUSTRIE</li>
            <li>PAYSAGES DE L'HABITER</li>
          </ul>
          <p className="text-base font-normal not-italic leading-[160%] text-black">
            Ces thématiques ont été révélées par l’exposition de l’URCAUE des
            Hauts-de-France intitulée "Une région, des paysages".
          </p>
        </div>
        <div label="Réglement">Réglement</div>
        <div label="Prix à gagner">Prix à gagner</div>
        <div label="Membres du jury">Membres du jury</div>
        <div label="Les photos">Les photos</div>
        <div label="Résultats">Résultats</div>
      </Tabs>
    </div>
  );
};

export default Contest;
