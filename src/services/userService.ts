const API_URL = '/api/user/image';

export const updateImage = async (image: string): Promise<String> => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: image }),
    });
    const body = await response.json();
    return body.image;
  } catch (error) {
    console.error('Erro ao buscar grupos:', error);
    throw error;
  }
};
