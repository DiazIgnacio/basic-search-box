import axios from 'axios';

export interface Product {
  title: string;
  price: string;
  image: string;
}

export const getProducts = async (searchQuery: string) => {
  return axios
    .get(`/api/amazon`, {
      params: {
        searchQuery,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error('err', err);
    });
};
