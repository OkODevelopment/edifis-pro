const { getProfile } = require('../../edifis-pro-back/controllers/authController');
const { User } = require('../../edifis-pro-back/models');

jest.mock('../../models', () => ({
    User: {
        findByPk: jest.fn(),
    }
}));

describe('getProfile', () => {
    let req, res;

    beforeEach(() => {
        req = { userId: 1 };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('devrait retourner le profil de l\'utilisateur si trouvé', async () => {
        const mockUser = {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
            Droit: { libelle: "Admin" },
            Competences: [{ id: 1, name: "Next.js", niveau: "Expert" }],
        };

        User.findByPk.mockResolvedValue(mockUser);

        await getProfile(req, res);

        expect(User.findByPk).toHaveBeenCalledWith(1, {
            attributes: { exclude: ['password'] },
            include: [
                { model: expect.anything(), attributes: ['libelle'] },
                { model: expect.anything(), through: { attributes: ['niveau'] } },
            ],
        });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('devrait retourner une erreur 404 si l\'utilisateur n\'est pas trouvé', async () => {
        User.findByPk.mockResolvedValue(null);

        await getProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur non trouvé' });
    });

    it('devrait gérer les erreurs internes avec un status 500', async () => {
        User.findByPk.mockRejectedValue(new Error('Database error'));

        await getProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Erreur lors de la récupération du profil',
            error: 'Database error'
        });
    });
});
