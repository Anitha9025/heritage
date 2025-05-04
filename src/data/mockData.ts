
export interface HeritageSite {
  id: string;
  title: string;
  location: string;
  description: string;
  image: string;
  isPopular: boolean;
  audioAvailable: boolean;
}

export const heritageSites: HeritageSite[] = [
  {
    id: "1",
    title: "Fort St. George",
    location: "Rajaji Road, Chennai",
    description: "Built in 1644, Fort St. George was the first English fortress in India, founded by the British East India Company. Today, it houses the Tamil Nadu Legislative Assembly and other official buildings. The fort museum contains many relics of the Raj era, including portraits, weapons, coins, and medals. The museum is well worth a visit to understand Chennai's colonial past and the development of the city.",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    isPopular: true,
    audioAvailable: true
  },
  {
    id: "2",
    title: "Mahabalipuram",
    location: "East Coast Road",
    description: "Mahabalipuram, also known as Mamallapuram, is a UNESCO World Heritage site famous for its 7th and 8th-century rock-cut temples and monuments built during the Pallava dynasty. The Shore Temple, standing on the shores of the Bay of Bengal, is one of the oldest structural stone temples of South India. The site also features the famous 'Descent of the Ganges', a giant open-air rock relief.",
    image: "https://images.unsplash.com/photo-1494891848038-7bd202a2afeb",
    isPopular: true,
    audioAvailable: true
  },
  {
    id: "3",
    title: "Kapaleeshwarar Temple",
    location: "Mylapore, Chennai",
    description: "Kapaleeshwarar Temple is a Hindu temple dedicated to Lord Shiva located in Mylapore, Chennai. The temple was built around the 7th century CE in the Dravidian architectural style, with its gopuram (tower) rising to a height of 40 meters. The temple complex includes shrines for Lord Shiva and his consort Parvati, as well as numerous smaller shrines and a sacred tank.",
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be",
    isPopular: false,
    audioAvailable: true
  },
  {
    id: "4",
    title: "Government Museum",
    location: "Pantheon Road, Egmore",
    description: "The Government Museum, Chennai, is the second oldest museum in India, established in 1851. It houses a rich collection of artifacts, including archaeological items, numismatic collections, sculptures, palm-leaf manuscripts, and Mughal and Rajput paintings. The museum complex also includes the National Art Gallery, which showcases Indian art from various periods.",
    image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
    isPopular: false,
    audioAvailable: false
  },
  {
    id: "5",
    title: "Santhome Cathedral",
    location: "Santhome High Road",
    description: "Santhome Cathedral Basilica is a Roman Catholic minor basilica in Santhome, Chennai. It was built in the 16th century by Portuguese explorers and rebuilt with the status of a cathedral by the British in 1893. The cathedral is said to have been built over the tomb of St. Thomas the Apostle, who came to India in 52 CE and was martyred in 72 CE.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    isPopular: false,
    audioAvailable: true
  }
];

export const languages = [
  { id: "en", name: "English" },
  { id: "ta", name: "Tamil" },
  { id: "hi", name: "Hindi" }
];

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  image?: string;
}

export const chatConversation: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "1",
      sender: "bot",
      text: "Welcome to Fort St. George! How can I help you today?",
      timestamp: new Date(),
    },
    {
      id: "2",
      sender: "user",
      text: "Can you tell me about the history of this fort?",
      timestamp: new Date(),
    },
    {
      id: "3",
      sender: "bot",
      text: "Fort St. George was built in 1644 by the British East India Company as the first English fortress in India, establishing their presence in the region. It served as the foundation of the modern city of Chennai (formerly Madras).",
      timestamp: new Date(),
    },
    {
      id: "4",
      sender: "user",
      text: "Show me an image of the fort",
      timestamp: new Date(),
    },
    {
      id: "5",
      sender: "bot",
      text: "Here's an image of Fort St. George:",
      timestamp: new Date(),
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    },
  ],
};
