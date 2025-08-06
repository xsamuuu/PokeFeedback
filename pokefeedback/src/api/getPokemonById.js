
export async function getPokemonById(id) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) throw new Error('No se pudo obtener el Pokémon');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
