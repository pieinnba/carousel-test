export const getImages = async (page: number) => {
  const response = await fetch(`https://picsum.photos/v2/list?page=${page}`);
  const data = await response.json();

  return data;
}