import {createAsyncThunk} from "@reduxjs/toolkit";
import {axiosGraphRequest} from "../../api/ApiConfig";

export const fetchColumnDB = createAsyncThunk(
  'filter/fetchColumnDB',
  async (db_names) => {
    try {
      const response = await axiosGraphRequest.post(`/api/v3/filter/get_columns`,db_names);
      // console.log(response)
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw new Error('fetchAllClients error');
    }
  }
);