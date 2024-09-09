import {createAsyncThunk} from "@reduxjs/toolkit";
import {axiosGraphRequest} from "../../api/ApiConfig";

export const fetchColumnDB = createAsyncThunk(
  'filter/fetchColumnDB',
  async (db_names) => {
    try {
      const response = await axiosGraphRequest.post(`/api/v3/filter/get_columns`, db_names);
      // console.log(response)
      if (response.status === 200) {
        return response.data;
      }



    } catch (error) {

      // console.log(error)
      throw new Error(error);
    }
  }
);
export const createFilter = createAsyncThunk(
  'filter/createFilter',
  async (filter_columns) => {
    try {
      const response = await axiosGraphRequest.post(`/api/v3/filter/create_filter`, filter_columns);
      // console.log(response)
      if (response.status === 200) {
        return response.data;
      }



    } catch (error) {

      // console.log(error)
      throw new Error(error);
    }
  }
);
export const getFilters = createAsyncThunk(
  'filter/getFilters',
  async (group_id) => {
    try {
      const response = await axiosGraphRequest.get(`/api/v3/filter/get_filters?group_id=${group_id}`);
      // console.log(response)
      if (response.status === 200) {
        return response.data;
      }



    } catch (error) {

      // console.log(error)
      throw new Error(error);
    }
  }
);