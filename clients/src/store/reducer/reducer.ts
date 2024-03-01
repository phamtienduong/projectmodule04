import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { publicAxios } from "../../config/publicAxios";

interface CartState {
  cart: Cart[];
}
interface Cart {
  cart: {
    cartId: number;
    productId:number;
    userId:number,
    quantity: number;
  };
}
export const getCart: any = createAsyncThunk("cart/getCart", async (id:number) => {
  const data = await publicAxios.get(`/api/v1/cart/${id}`);
  return data.data;
});


const initialState: CartState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(getCart.fulfilled, (state, action) => {
        // Add user to the state array
        state.cart = action.payload; // gan lai cho state ban dau
      })
  },
});

export default cartSlice.reducer;
