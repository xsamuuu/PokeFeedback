// src/api/getPokemonList.js

export async function getPokemonList(offset = 0, limit = 20) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    if (!res.ok) throw new Error('Error al obtener la lista de Pokémons');
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}
