import axios from 'axios';

const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      "Authorization": `Bearer ${process.env.API_TOKEN}`,
    },
});

export default class ResidentsService {
    static async create(resident) {
       const response = await api.post('/api/residents', resident);
       return response.data.resident;
    }

    static async getAll() {
        const response = await api.get('/api/residents');
        return response.data.residents;
    }
}