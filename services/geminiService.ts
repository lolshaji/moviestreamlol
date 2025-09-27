import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const movieDetailsSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A creative and catchy title for the movie.",
    },
    description: {
      type: Type.STRING,
      description: "A compelling one-paragraph synopsis of the movie's plot.",
    },
    genres: {
      type: Type.ARRAY,
      description: "An array of 2-3 relevant genres for the movie.",
      items: {
        type: Type.STRING,
      },
    },
    rating: {
        type: Type.NUMBER,
        description: "A plausible user rating for the movie on a scale of 1.0 to 10.0, with one decimal place."
    },
    releaseYear: {
        type: Type.INTEGER,
        description: "A plausible release year for a movie like this."
    }
  },
  required: ["title", "description", "genres", "rating", "releaseYear"],
};

const tvShowDetailsSchema = {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "A creative and catchy title for the TV Show.",
      },
      description: {
        type: Type.STRING,
        description: "A compelling one-paragraph synopsis of the TV show's overall plot.",
      },
      genres: {
        type: Type.ARRAY,
        description: "An array of 2-3 relevant genres for the show.",
        items: {
          type: Type.STRING,
        },
      },
      rating: {
          type: Type.NUMBER,
          description: "A plausible user rating for the show on a scale of 1.0 to 10.0, with one decimal place."
      },
      releaseYear: {
          type: Type.INTEGER,
          description: "A plausible release year for a show like this."
      }
    },
    required: ["title", "description", "genres", "rating", "releaseYear"],
  };

export const generateMovieDetails = async (prompt: string) => {
  if (!API_KEY) {
    throw new Error("API_KEY not configured for Gemini service.");
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following idea, generate details for a new movie: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: movieDetailsSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    const movieDetails = JSON.parse(jsonText);

    return movieDetails;

  } catch (error) {
    console.error("Error generating movie details with Gemini:", error);
    throw new Error("Failed to generate movie details. Please check the console for more information.");
  }
};

export const generateTVShowDetails = async (prompt: string) => {
    if (!API_KEY) {
      throw new Error("API_KEY not configured for Gemini service.");
    }
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Based on the following idea, generate details for a new TV show: "${prompt}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: tvShowDetailsSchema,
          temperature: 0.8,
        },
      });
  
      const jsonText = response.text.trim();
      const tvShowDetails = JSON.parse(jsonText);
  
      return tvShowDetails;
  
    } catch (error) {
      console.error("Error generating TV show details with Gemini:", error);
      throw new Error("Failed to generate TV show details. Please check the console for more information.");
    }
  };