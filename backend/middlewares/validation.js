const validateRecipe = (req, res, next) => {
    const { nama_resep, bahan, langkah } = req.body;

    if (!nama_resep || !bahan || !langkah) {
        return res.status(400).json({ message: "Semua field wajib diisi!" });
    }

    if (!Array.isArray(bahan) || bahan.length < 1) {
        return res.status(400).json({ message: "Minimal harus ada 1 bahan!" });
    }

    if (!Array.isArray(langkah) || langkah.length < 1) {
        return res.status(400).json({ message: "Minimal harus ada 1 langkah!" });
    }

    next();
};

module.exports = { validateRecipe };