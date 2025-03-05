import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = "https://pokeapi.co/api/v2/pokemon/";

export default function PokemonInfoApp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPokemon("ditto");
  }, []);

  const fetchPokemon = async (query) => {
    setError("");
    try {
      const response = await fetch(`${API_URL}${query.toString().toLowerCase()}`);
      if (!response.ok) {
        throw new Error("Pokémon not found");
      }
      const data = await response.json();
      setPokemon(data);
    } catch (err) {
      setError(err.message);
      setPokemon(null);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    fetchPokemon(searchTerm);
  };

  const navigatePokemon = async (step) => {
    if (!pokemon) return;
    const newId = Math.max(1, pokemon.id + step);
    fetchPokemon(newId);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-900 min-h-screen text-white text-center">
      <h1 className="text-3xl font-bold mb-6">Pokémon Info App</h1>
      <div className="flex gap-2 mb-6 justify-center">
        <Input
          className="w-2/3 p-2 rounded-lg border border-gray-600 bg-gray-800 text-white"
          placeholder="Enter Pokémon name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg" onClick={handleSearch}>
          Search
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {pokemon && (
        <Card className="bg-gray-800 p-4 rounded-lg">
          <CardContent className="flex flex-col items-center">
            <img
              src={pokemon.sprites?.front_default}
              alt={pokemon.name}
              className="h-40 w-40 object-contain"
            />
            <h2 className="text-2xl font-bold mt-4 capitalize">{pokemon.name}</h2>
            <p className="mt-2">ID: {pokemon.id}</p>
            <p className="mt-2">Type: {pokemon.types?.map(t => t.type.name).join(", ")}</p>
            <div className="mt-4 flex gap-4">
              <Button onClick={() => navigatePokemon(-1)} disabled={pokemon.id === 1}>
                <ChevronLeft /> Prev
              </Button>
              <Button onClick={() => navigatePokemon(1)}>
                Next <ChevronRight />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
