const restaurantData = [
  {
    "Name": "Minamishima",
    "Style": "Japanese",
    "Rating": 94,
    "Latitude": -37.8197444,
    "Longitude": 145.0050252
  },
  {
    "Name": "Kisume Chefs Table",
    "Style": "Japanese",
    "Rating": 93,
    "Latitude": -37.8162147,
    "Longitude": 144.9687994
  },
  {
    "Name": "Amaru",
    "Style": "Contemporary",
    "Rating": 93,
    "Latitude": -37.8558133,
    "Longitude": 145.0249461
  },
  {
    "Name": "Tonka",
    "Style": "Indian",
    "Rating": 91,
    "Latitude": -37.8156991,
    "Longitude": 144.9714107
  },
  {
    "Name": "San Telmo",
    "Style": "Argentinian",
    "Rating": 90,
    "Latitude": -37.8121636,
    "Longitude": 144.9724132
  },
  {
    "Name": "Movida",
    "Style": "Spanish",
    "Rating": 89,
    "Latitude": -37.8167167,
    "Longitude": 144.9691417
  },
  {
    "Name": "Kisume",
    "Style": "Japanese",
    "Rating": 89,
    "Latitude": -37.8161,
    "Longitude": 144.9687994
  },
  {
    "Name": "Vinesmith",
    "Style": "Wine Bar",
    "Rating": 88,
    "Latitude": -37.814523,
    "Longitude": 144.974164
  },
  {
    "Name": "Tipo 0.0",
    "Style": "Italian",
    "Rating": 88,
    "Latitude": -37.8135522,
    "Longitude": 144.9619835
  },
  {
    "Name": "Marmelo",
    "Style": "Portugeuse",
    "Rating": 87,
    "Latitude": -37.8132791,
    "Longitude": 144.9685141
  },
  {
    "Name": "Lucy Liu",
    "Style": "Asian Fusion",
    "Rating": 87,
    "Latitude": -37.8159928,
    "Longitude": 144.9699538
  },
  {
    "Name": "Maha",
    "Style": "Middle-Eastern",
    "Rating": 86,
    "Latitude": -37.8181528,
    "Longitude": 144.962662
  },
  {
    "Name": "Serai",
    "Style": "Phillipino Fusion",
    "Rating": 86,
    "Latitude": -37.8138937,
    "Longitude": 144.9616895
  },
  {
    "Name": "Robata",
    "Style": "Japanese Grill",
    "Rating": 85,
    "Latitude": -37.8158043,
    "Longitude": 144.9725346
  },
  {
    "Name": "Pastuso",
    "Style": "Peruvian",
    "Rating": 85,
    "Latitude": -37.8158403,
    "Longitude": 144.9710359
  },
  {
    "Name": "Marion",
    "Style": "French",
    "Rating": 85,
    "Latitude": -37.8054734,
    "Longitude": 144.9758542
  },
  {
    "Name": "Embla",
    "Style": "Wine Bar",
    "Rating": 85,
    "Latitude": -37.813394,
    "Longitude": 144.9686092
  },
  {
    "Name": "Cumulus Inc",
    "Style": "Contemporary",
    "Rating": 85,
    "Latitude": -37.8149132,
    "Longitude": 144.9731229
  },
  {
    "Name": "Hazel",
    "Style": "Contemporary",
    "Rating": 84,
    "Latitude": -37.8158872,
    "Longitude": 144.9687316
  },
  {
    "Name": "Nomad",
    "Style": "Middle-Eastern",
    "Rating": 84,
    "Latitude": -37.8161891,
    "Longitude": 144.9683115
  },
  {
    "Name": "Cutler",
    "Style": "Contemporary",
    "Rating": 84,
    "Latitude": -37.805465,
    "Longitude": 144.9758993
  },
  {
    "Name": "Pincho Disco",
    "Style": "Latin American",
    "Rating": 83,
    "Latitude": -37.8063845,
    "Longitude": 144.9851097
  },
  {
    "Name": "Rue Du Tranh",
    "Style": "Vietnamese",
    "Rating": 83,
    "Latitude": -37.7950286,
    "Longitude": 144.9792506
  },
  {
    "Name": "Mamasita",
    "Style": "Mexican",
    "Rating": 82,
    "Latitude": -37.8136394,
    "Longitude": 144.9733909
  },
  {
    "Name": "The Walrus",
    "Style": "Wine Bar",
    "Rating": 82,
    "Latitude": -37.8643224,
    "Longitude": 144.9822634
  },
  {
    "Name": "Entrecote",
    "Style": "French",
    "Rating": 81,
    "Latitude": -37.849427,
    "Longitude": 144.991519
  },
  {
    "Name": "City Wine Shop",
    "Style": "Wine Bar",
    "Rating": 81,
    "Latitude": -37.8109802,
    "Longitude": 144.9725379
  },
  {
    "Name": "Tres a Cinco",
    "Style": "Mexican",
    "Rating": 81,
    "Latitude": -37.8164513,
    "Longitude": 144.9690997
  },
  {
    "Name": "The Abyssinian",
    "Style": "Ethiopian",
    "Rating": 81,
    "Latitude": -37.7885398,
    "Longitude": 144.9318371
  },
  {
    "Name": "Farmers Daughter",
    "Style": "Contemporary",
    "Rating": 80,
    "Latitude": -37.8135541,
    "Longitude": 144.9710252
  },
  {
    "Name": "Pearl Diver",
    "Style": "Oyster Bar",
    "Rating": 79,
    "Latitude": -37.8107796,
    "Longitude": 144.9707955
  },
  {
    "Name": "Cecconis",
    "Style": "Italian",
    "Rating": 79,
    "Latitude": -37.8150555,
    "Longitude": 144.9725293
  },
  {
    "Name": "Trattoria Emilia",
    "Style": "Italian",
    "Rating": 78,
    "Latitude": -37.815333,
    "Longitude": 144.9626731
  },
  {
    "Name": "Coda",
    "Style": "Asian Fusion",
    "Rating": 76,
    "Latitude": -37.8157661,
    "Longitude": 144.9698897
  },
  {
    "Name": "Bar Lourinha",
    "Style": "Tapas Bar",
    "Rating": 74,
    "Latitude": -37.812815,
    "Longitude": 144.9725185
  },
  {
    "Name": "Elchi",
    "Style": "Indian",
    "Rating": 71,
    "Latitude": -37.815732,
    "Longitude": 144.972688
  },
  {
    "Name": "Di Stasia Citta",
    "Style": "Italian",
    "Rating": 62,
    "Latitude": -37.8142548,
    "Longitude": 144.974186
  }
];


restaurantData.forEach(r => {
  const rating = r.Rating;
  let color;

  if (rating >= 85) color = '#27ae60';         // green
  else if (rating >= 75) color = '#f1c40f';    // yellow
  else if (rating >= 68) color = '#f39c12';    // orange
  else color = '#c0392b';                      // red

  const marker = L.marker([r.Latitude, r.Longitude], {
    icon: L.divIcon({
      className: 'rating-icon',
      html: `<div class='rating-circle' style="background:${color}">${rating}</div>`
    })
  }).addTo(map);

  marker.bindTooltip(`${r.Name} (${r.Style})`, { permanent: false });

  marker.on("click", () => showPanel(r.Name));
});
