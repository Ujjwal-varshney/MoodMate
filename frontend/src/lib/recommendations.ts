export interface Recommendation {
  type: "quote" | "song";
  text: string;
  author?: string;
  artist?: string;
}

const recommendations: Record<string, { quotes: Recommendation[]; songs: Recommendation[] }> = {
  happy: {
    quotes: [
      { type: "quote", text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
      { type: "quote", text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
      { type: "quote", text: "Khushi woh nahi jo milti hai, khushi woh hai jo mehsoos hoti hai.", author: "Unknown" },
      { type: "quote", text: "Count your age by friends, not years. Count your life by smiles, not tears.", author: "John Lennon" },
      { type: "quote", text: "The most important thing is to enjoy your life — to be happy — it's all that matters.", author: "Audrey Hepburn" },
    ],
    songs: [
      { type: "song", text: "Happy", artist: "Pharrell Williams" },
      { type: "song", text: "Walking on Sunshine", artist: "Katrina & The Waves" },
      { type: "song", text: "Good as Hell", artist: "Lizzo" },
      { type: "song", text: "Kal Ho Naa Ho", artist: "Sonu Nigam" },
      { type: "song", text: "Don't Stop Me Now", artist: "Queen" },
    ],
  },
  sad: {
    quotes: [
      { type: "quote", text: "The wound is the place where the Light enters you.", author: "Rumi" },
      { type: "quote", text: "Even the darkest night will end and the sun will rise.", author: "Victor Hugo" },
      { type: "quote", text: "Dukh mein sumiranl sab kare, sukh mein kare na koye.", author: "Kabir" },
      { type: "quote", text: "Stars can't shine without darkness.", author: "D.H. Sidebottom" },
      { type: "quote", text: "Every storm runs out of rain.", author: "Maya Angelou" },
    ],
    songs: [
      { type: "song", text: "Fix You", artist: "Coldplay" },
      { type: "song", text: "Tum Hi Ho", artist: "Arijit Singh" },
      { type: "song", text: "Someone Like You", artist: "Adele" },
      { type: "song", text: "Channa Mereya", artist: "Arijit Singh" },
      { type: "song", text: "Let Her Go", artist: "Passenger" },
    ],
  },
  anxious: {
    quotes: [
      { type: "quote", text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
      { type: "quote", text: "Breathe. It's just a bad day, not a bad life.", author: "Unknown" },
      { type: "quote", text: "Fikar chhodo, abhi toh bahut kuch hona baaki hai.", author: "Unknown" },
      { type: "quote", text: "Nothing diminishes anxiety faster than action.", author: "Walter Anderson" },
      { type: "quote", text: "This too shall pass.", author: "Persian Proverb" },
    ],
    songs: [
      { type: "song", text: "Weightless", artist: "Marconi Union" },
      { type: "song", text: "Breathe Me", artist: "Sia" },
      { type: "song", text: "Kun Faya Kun", artist: "A.R. Rahman" },
      { type: "song", text: "Here Comes the Sun", artist: "The Beatles" },
      { type: "song", text: "Three Little Birds", artist: "Bob Marley" },
    ],
  },
  angry: {
    quotes: [
      { type: "quote", text: "For every minute you remain angry, you give up sixty seconds of peace of mind.", author: "Ralph Waldo Emerson" },
      { type: "quote", text: "Anger is one letter short of danger.", author: "Eleanor Roosevelt" },
      { type: "quote", text: "Gussa aapko jalata hai, saamne wale ko nahi.", author: "Unknown" },
      { type: "quote", text: "Speak when you are angry, and you will make the best speech you will ever regret.", author: "Ambrose Bierce" },
      { type: "quote", text: "The best fighter is never angry.", author: "Lao Tzu" },
    ],
    songs: [
      { type: "song", text: "Lose Yourself", artist: "Eminem" },
      { type: "song", text: "Believer", artist: "Imagine Dragons" },
      { type: "song", text: "Ziddi Dil", artist: "Vishal Dadlani" },
      { type: "song", text: "Eye of the Tiger", artist: "Survivor" },
      { type: "song", text: "Stronger", artist: "Kanye West" },
    ],
  },
  calm: {
    quotes: [
      { type: "quote", text: "Peace is the result of retraining your mind to process life as it is, rather than as you think it should be.", author: "Wayne Dyer" },
      { type: "quote", text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
      { type: "quote", text: "Sukoon mil gaya toh samajh lena zindagi ka sabse bada tohfa mil gaya.", author: "Unknown" },
      { type: "quote", text: "Be still. Stillness reveals the secrets of eternity.", author: "Lao Tzu" },
      { type: "quote", text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
    ],
    songs: [
      { type: "song", text: "Khaabon Ke Parinday", artist: "Mohit Chauhan & Alyssa Mendonsa" },
      { type: "song", text: "Sunset Lover", artist: "Petit Biscuit" },
      { type: "song", text: "Clair de Lune", artist: "Debussy" },
      { type: "song", text: "Banana Pancakes", artist: "Jack Johnson" },
      { type: "song", text: "Ilahi", artist: "Arijit Singh" },
    ],
  },
  loved: {
    quotes: [
      { type: "quote", text: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" },
      { type: "quote", text: "Love is not about possession, it's about appreciation.", author: "Unknown" },
      { type: "quote", text: "Pyaar woh hai jo bina bole samajh aaye.", author: "Unknown" },
      { type: "quote", text: "Being deeply loved gives you strength; loving deeply gives you courage.", author: "Lao Tzu" },
      { type: "quote", text: "You yourself, as much as anybody, deserve your love and affection.", author: "Buddha" },
    ],
    songs: [
      { type: "song", text: "Perfect", artist: "Ed Sheeran" },
      { type: "song", text: "Tere Bina", artist: "A.R. Rahman" },
      { type: "song", text: "All of Me", artist: "John Legend" },
      { type: "song", text: "Raabta", artist: "Arijit Singh" },
      { type: "song", text: "Can't Help Falling in Love", artist: "Elvis Presley" },
    ],
  },
  neutral: {
    quotes: [
      { type: "quote", text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
      { type: "quote", text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
      { type: "quote", text: "Zindagi lambi nahi, badi honi chahiye.", author: "Rajesh Khanna" },
      { type: "quote", text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
      { type: "quote", text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
    ],
    songs: [
      { type: "song", text: "Here Comes the Sun", artist: "The Beatles" },
      { type: "song", text: "Iktara", artist: "Amit Trivedi" },
      { type: "song", text: "Budapest", artist: "George Ezra" },
      { type: "song", text: "Phir Se Ud Chala", artist: "Mohit Chauhan" },
      { type: "song", text: "Viva la Vida", artist: "Coldplay" },
    ],
  },
};

export function getRecommendations(mood: string) {
  return recommendations[mood] || recommendations.neutral;
}

export function getRandomQuote(mood: string): Recommendation {
  const recs = getRecommendations(mood);
  return recs.quotes[Math.floor(Math.random() * recs.quotes.length)];
}

export function getRandomSong(mood: string): Recommendation {
  const recs = getRecommendations(mood);
  return recs.songs[Math.floor(Math.random() * recs.songs.length)];
}
