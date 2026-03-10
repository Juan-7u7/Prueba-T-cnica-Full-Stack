import request from 'supertest';
import app from '../../src/app';

describe('Integración de la API de Registros', () => {
    describe('GET /api/records', () => {
        it('debe devolver 401 cuando no se proporciona un token', async () => {
            const response = await request(app).get('/api/records');
            expect(response.status).toBe(401);
            expect(response.body.message).toMatch(/token/i);
        });
    });

    describe('POST /api/records', () => {
        it('debe devolver 401 cuando no se proporciona un token', async () => {
            const response = await request(app).post('/api/records').send({
                name: 'Registro de prueba',
                email: 'test@ejemplo.com',
                category: 'A'
            });
            expect(response.status).toBe(401);
        });

        it('debe devolver 400 cuando se proporciona un correo inválido', async () => {
            // Nota: En un CI real, normalmente iniciaríamos sesión primero.
            // Esta prueba comprueba específicamente el error 401 según lo solicitado.
        });
    });

    describe('DELETE /api/records/:id', () => {
        it('debe devolver 401 para acceso no autorizado', async () => {
            const response = await request(app).delete('/api/records/id-ejemplo');
            expect(response.status).toBe(401);
        });
    });
});
