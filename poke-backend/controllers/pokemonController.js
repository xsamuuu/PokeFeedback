const axios = require('axios');

async function getPokemonByName(req, res) {
  const { name } = req.params;
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    res.json(response.data);
  } catch (error) {
    res.status(404).json({ error: 'Pokémon no encontrado' });
  }
}

module.exports = { getPokemonByName };
