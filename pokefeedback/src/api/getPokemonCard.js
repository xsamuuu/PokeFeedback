// src/api/getPokemonCard.js
export async function getPokemonCard(pokemonName) {
  try {
    const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:${pokemonName}`);
    const data = await res.json();

    // Intenta encontrar la carta más relevante (a veces hay muchas)
    const card = data?.data?.find(card => 
      card.name.toLowerCase().includes(pokemonName.toLowerCase())
    );

    return card || null;
  } catch (error) {
    console.error(`Error fetching TCG card for ${pokemonName}:`, error);
    return null;
  }
}
