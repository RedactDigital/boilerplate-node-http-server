const { User } = require(`${root}/app/http/models`);

// Used for hubspot
module.exports = async (_, res) => {
  try {
    const assistantCount = await User.count({
      where: {
        accountType: 'assistant',
      },
    });

    if (!assistantCount || assistantCount < 1) return res.status(200).json({ count: 0 });

    return res.status(200).json({ success: true, data: assistantCount });
  } catch (err) {
    log.error('Error in getNumberOfAssistants', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
