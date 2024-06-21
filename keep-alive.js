module.exports = async () => {
  try {
    await fetch(
      'https://social-media-app-backend-hsgm.onrender.com/keep-alive',
      {
        method: 'GET',
      }
    );
  } catch (err) {
    console.log(err);
  }
};
