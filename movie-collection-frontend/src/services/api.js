const BASE_URL = 'http://localhost:3000/api';

export async function fetchMovies() {
  try {
    const response = await fetch(`${BASE_URL}/movies`);
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: Falha ao buscar filmes.`);
    }
    const data = await response.json();
    
    // O NestJS paginado pode retornar a lista dentro de "data", "items" ou diretamente como array
    if (data && Array.isArray(data.items)) return data.items;
    if (data && Array.isArray(data.data)) return data.data;
    if (Array.isArray(data)) return data;
    
    return [];
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw new Error('Não foi possível conectar ao servidor. Verifique se a API está rodando na porta 3000.');
  }
}
