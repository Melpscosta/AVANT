import axios from 'axios';

// URL PADRÃO (Produção / Render)
// Usada para: IA, Cursos, Funcionários, etc.
const api = axios.create({
  baseURL: 'https://globalsolution-66v2.onrender.com', 
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;