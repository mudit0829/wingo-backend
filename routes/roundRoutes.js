// roundRoutes.js
router.get('/', async (req, res) => {
  try {
    const rounds = await Round.find().sort({ timestamp: -1 });

    const formatted = rounds.map(r => ({
      roundId: r.roundId || '-',
      result: r.result || '-',
      timestamp: r.timestamp,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('❌ Error fetching rounds:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});
