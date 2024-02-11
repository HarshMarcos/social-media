import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,

  isLoggedIn: localStorage.getItem("isLoggedIn")
    ? JSON.parse(localStorage.getItem("isLoggedIn"))
    : false,

  role: localStorage.getItem("role")
    ? JSON.parse(localStorage.getItem("role"))
    : "",

  data: localStorage.getItem("data")
    ? JSON.parse(localStorage.getItem("data"))
    : {},
};

export const createAccount = createAsyncThunk(
  "/auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      const res = axiosInstance.post("/auth/register", data);
      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const updateStateOnAuthPending = (state) => {
      state.loading = true;
    };

    const updateStateOnAuthSuccess = (state, action) => {
      localStorage.setItem("data", JSON.stringify(action?.payload?.user));
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("role", JSON.stringify(action?.payload?.user?.role));
      state.loading = false;
      state.isLoggedIn = true;
      state.data = action?.payload?.user;
      state.role = action?.payload.user?.role;
    };

    const updateStateOnAuthFail = (state) => {
      state.loading = false;
    };

    builder
      .addCase(createAccount.pending, (state) => {
        updateStateOnAuthPending(state);
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        updateStateOnAuthSuccess(state, action);
      })
      .addCase(createAccount.rejected, (state) => {
        updateStateOnAuthFail(state);
      });
    // .addCase(logout.fulfilled, (state) => {
    //   localStorage.clear();
    //   state.isLoggedIn = false;
    //   state.data = {};
    //   state.role = "";
    // });
  },
});
export default authSlice.reducer;
