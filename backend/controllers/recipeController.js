const db = require('../config/db');

const addRecipe = async (req, res) => {
    const { nama_resep, deskripsi, kategori, tingkat_kesulitan, bahan, langkah } = req.body;

    try {
        const [recipeResult] = await db.query(
            'INSERT INTO recipes (nama_resep, deskripsi, kategori, tingkat_kesulitan) VALUES (?, ?, ?, ?)',
            [nama_resep, deskripsi, kategori, tingkat_kesulitan]
        );
        const recipeId = recipeResult.insertId;

        const ingredientQueries = bahan.map(b =>
            db.query('INSERT INTO ingredients (recipe_id, nama_bahan) VALUES (?, ?)', [recipeId, b])
        );
        await Promise.all(ingredientQueries);

        const stepQueries = langkah.map((l, index) =>
            db.query('INSERT INTO steps (recipe_id, urutan, deskripsi_langkah) VALUES (?, ?, ?)', [recipeId, index + 1, l])
        );
        await Promise.all(stepQueries);

        res.status(201).json({ message: 'Resep berhasil ditambahkan!' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
};

module.exports = { addRecipe };

const getRecipes = async (req, res) => {
    try {
        const { kategori, kesulitan, page = 1 } = req.query;
        const limit = 6; 
        const offset = (page - 1) * limit;

        let query = `
            SELECT r.*, 
            GROUP_CONCAT(DISTINCT i.nama_bahan SEPARATOR '||') as bahan,
            GROUP_CONCAT(DISTINCT s.deskripsi_langkah ORDER BY s.urutan SEPARATOR '||') as langkah
            FROM recipes r
            LEFT JOIN ingredients i ON r.id = i.recipe_id
            LEFT JOIN steps s ON r.id = s.recipe_id
            WHERE 1=1
        `;
        
        let queryParams = [];

        if (kategori) {
            query += " AND r.kategori = ?";
            queryParams.push(kategori);
        }
        if (kesulitan) {
            query += " AND r.tingkat_kesulitan = ?";
            queryParams.push(kesulitan);
        }

        query += " GROUP BY r.id LIMIT ? OFFSET ?";
        queryParams.push(limit, offset);

        const [rows] = await db.query(query, queryParams);
        
        const formattedData = rows.map(item => ({
            ...item,
            bahan: item.bahan ? item.bahan.split('||') : [],
            langkah: item.langkah ? item.langkah.split('||') : []
        }));

        res.json(formattedData);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data', error: error.message });
    }
};

module.exports = { addRecipe, getRecipes };