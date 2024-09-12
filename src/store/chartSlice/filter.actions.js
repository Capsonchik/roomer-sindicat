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
  async (filter_data) => {
    try {
      const response = await axiosGraphRequest.post(`/api/v3/filter/create_filter`, filter_data);
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
export const updateFilter = createAsyncThunk(
  'filter/updateFilter',
  async ({filter_data, filter_id}) => {
    try {
      const response = await axiosGraphRequest.patch(`/api/v3/filter/update_filter?filter_id=${filter_id}`, filter_data);
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
// export const deleteFilter = createAsyncThunk(
//   'filter/deleteFilter',
//   async ({filter_data, filter_id}) => {
//     try {
//       const response = await axiosGraphRequest.patch(`/api/v3/filter/update_filter?filter_id=${filter_id}`, filter_data);
//       // console.log(response)
//       if (response.status === 200) {
//         return response.data;
//       }
//
//
//
//     } catch (error) {
//
//       // console.log(error)
//       throw new Error(error);
//     }
//   }
// );
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

export const fetchColumnDBFromGroup = createAsyncThunk(
  'filter/fetchColumnDBFromGroup',
  async (group_id) => {
    try {
      const response = await axiosGraphRequest.post(`api/v3/filter/get_columns_from_group?group_id=${group_id}`);
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