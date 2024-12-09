import React, { useState } from "react";

function PaymentForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Valider les données du formulaire

    // Envoyer les données du formulaire à votre API de paiement

    console.log("Formulaire soumis avec succès !");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nom:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>Numéro de carte:</label>
      <input
        type="number"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
      />

      <label>Date d'expiration:</label>
      <input
        type="text"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
      />

      <label>CVV:</label>
      <input
        type="number"
        value={cvv}
        onChange={(e) => setCvv(e.target.value)}
      />

      <label>Offre:</label>
      <div>
        <input
          type="radio"
          id="basic"
          name="offer"
          value="basic"        />
        <label for="basic">BASIC PLAN (300DT/6m)</label>
        <br />

        <input
          type="radio"
          id="premium"
          name="offer"
          value="premium"        />
        <label for="premium">PREMIUM PLAN (500DT/6m)</label>
        <br />

        <input
          type="radio"
          id="pro"
          name="offer"
          value="pro"
        />
        <label for="pro">PRO PLAN (400DT/6m)</label>
      </div>

      <button type="submit">Payer</button>
    </form>
  );
}

export default PaymentForm;
