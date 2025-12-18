import { CAT_API_BASE_URL } from "../constants";

export type CatImage = {
  id: string;
  url: string;
  breeds?: Array<{
    name: string;
  }>;
  favourite?: { id: string };
  score?: number;
  voteId?: string;
};

// Get a random cat image
export const fetchRandomCatImage = async (): Promise<CatImage> => {
  const response = await fetch(`${CAT_API_BASE_URL}/images/search?size=med&format=json&has_breeds=true&order=RANDOM&page=0&limit=1`, {
    headers: {
      'x-api-key': import.meta.env.VITE_CAT_API_KEY
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch random cat image");
  }
  const data: CatImage[] = await response.json();
  return data[0];
}

// Get uploaded images
export const fetchCatImages = async (limit: number = 100): Promise<CatImage[]> => {
  const response = await fetch(`${CAT_API_BASE_URL}/images?limit=${limit}`, {
    headers: {
      'x-api-key': import.meta.env.VITE_CAT_API_KEY
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch uploaded cat images");
  }
  const data: CatImage[] = await response.json();
  return data;
}

// Create an image
export const uploadCatImage = async (file: File): Promise<CatImage> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${CAT_API_BASE_URL}/images/upload`, {
    method: "POST",
    headers: {
      "x-api-key": import.meta.env.VITE_CAT_API_KEY
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload cat image: ${response.status}`);
  }

  const data: CatImage = await response.json();
  return data;
}

// Delete a cat image
export const deleteCatImage = async (cat: CatImage): Promise<void> => {
  try {
    if (cat.favourite?.id) {
      // Unfavourite the cat image first
      await fetch (`${CAT_API_BASE_URL}/favourites/${cat.favourite.id}`, {
        method: "DELETE",
        headers: {
          "x-api-key": import.meta.env.VITE_CAT_API_KEY
        }
      });
    }
    const response = await fetch(`${CAT_API_BASE_URL}/images/${cat.id}`, {
      method: "DELETE",
      headers: {
        "x-api-key": import.meta.env.VITE_CAT_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error("Failed to delete cat image");
    }
  } catch (err) {
    console.warn("Delete failed: ", err);
  }
}

// Favourite/unfavourite an image
export const favouriteCatImage = async (cat: CatImage): Promise<string | undefined> => {
  if (cat.favourite?.id) {
    // Unfavourite the cat image
    const response = await fetch (`${CAT_API_BASE_URL}/favourites/${cat.favourite.id}`, {
      method: "DELETE",
      headers: {
        "x-api-key": import.meta.env.VITE_CAT_API_KEY
      }
    });
    if (!response.ok) throw new Error("Failed to unfavourite cat image");
    return undefined;
  } else {
    // Favourite the cat image
    const response = await fetch(`${CAT_API_BASE_URL}/favourites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_CAT_API_KEY
      },
      body: JSON.stringify({ image_id: cat.id }),
    });

    if (!response.ok) throw new Error("Failed to favourite cat image");
    const data = await response.json();
    return data.id;
  }
}
// Get all favourite cats
export const fetchFavouriteCats = async (): Promise<CatImage[]> => {
  const response = await fetch(`${CAT_API_BASE_URL}/favourites`, {
    headers: {
      'x-api-key': import.meta.env.VITE_CAT_API_KEY
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch favourite cat images");
  }
  const data: Array<{ id: string; image: CatImage }> = await response.json();
  return data.map(fav => ({ ...fav.image, favourite: { id: fav.id } }));
}

// Post vote 
export const voteCat = async (cat: CatImage, upvote: boolean): Promise<void> => {
  const response = await fetch(`${CAT_API_BASE_URL}/votes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_CAT_API_KEY
    },
    body: JSON.stringify({ image_id: cat.id, value: upvote ? 1 : -1 }),
  });

  if (!response.ok) throw new Error("Failed to vote cat image");
};

// Get all votes
export const fetchVotes = async (): Promise<Array<{ image_id: string; value: number }>> => {
  const response = await fetch(`${CAT_API_BASE_URL}/votes`, {
    headers: {
      'x-api-key': import.meta.env.VITE_CAT_API_KEY
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch votes for cat image");
  }
  const data: Array<{ image_id: string; value: number }> = await response.json();
  return data;
}