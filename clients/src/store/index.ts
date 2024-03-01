import { configureStore } from "@reduxjs/toolkit";
import cartSlice from   "./reducer/reducer"

const store=configureStore({
     reducer: {cartSlices:cartSlice},
})
export default store