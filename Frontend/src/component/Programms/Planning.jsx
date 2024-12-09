import { useState } from 'react';
import React from 'react';
import './Planning.css'; // Importer le fichier CSS

const Planning = () => {
    const [planning, setPlanning] = useState([
          {
            day: "Lundi",
            time: "20h30",
            workout: "Cardio",
            instructor: "Amine",
            gender: "Mixte",
          },
          {
            day: "Lundi",
            time: "21h15",
            workout: "Meta Fit",
            instructor: "Taieb",
            gender: "100% Femmes",
          },
          {
            day: "Mardi",
            time: "20h30",
            workout: "Pilates",
            instructor: "Dalila",
            gender: "100% Femmes",
          },
          {
            day: "Mardi",
            time: "21h15",
            workout: "Fonctionnel",
            instructor: "Ayoub",
            gender: "Mixte",
          },
          {
            day: "Mercredi",
            time: "20h45",
            workout: "Boxe Thaï",
            instructor: "Elyes",
            gender: "Mixte",
          },
          {
            day: "Mercredi",
            time: "21h30",
            workout: "CrossFit",
            instructor: "Ayoub",
            gender: "Mixte",
          },
          {
            day: "Jeudi",
            time: "21h",
            workout: "Spinning",
            instructor: "Tarak",
            gender: "Mixte",
          },
          {
            day: "Vendredi",
            time: "21h30",
            workout: "CrossFit",
            instructor: "Oussama",
            gender: "Mixte",
          },
          {
            day: "Vendredi",
            time: "22h",
            workout: "Fit Dance",
            instructor: "Moataz",
            gender: "100% Femmes",
          },
          {
            day: "Samedi",
            time: "22h",
            workout: "Afro",
            instructor: "Amine",
            gender: "100% Femmes",
          },
          {
            day: "Samedi",
            time: "22h45",
            workout: "Abs Workout",
            instructor: "Bilel",
            gender: "Mixte",
          },
    ]);


  return (
    <div className="container">
      <h1 className="title">Planning of the week</h1>
      <table className="table">
        <thead>
          <tr className="first-row">
            <th className="first-column">Jour</th>
            <th className="th">Heure</th>
            <th className="th">Séance</th>
            <th className="th">Instructeur</th>
            <th className="th">Genre</th>
          </tr>
        </thead>
        <tbody>
          {planning.map((day) => (
            <tr key={day.day}>
              <td className="td">{day.day}</td>
              <td className="td">{day.time}</td>
              <td className="td">{day.workout}</td>
              <td className="td">{day.instructor}</td>
              <td className="td">{day.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Planning;
