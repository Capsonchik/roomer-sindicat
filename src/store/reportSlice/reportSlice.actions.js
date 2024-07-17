import {createAsyncThunk} from "@reduxjs/toolkit";
import {axiosClientRequest} from "../../api/ApiConfig";

export const fetchGetAllClients = createAsyncThunk(
  'getAllClients',
  async () => {
    try {
      const response = await axiosClientRequest.get(`get_client`);
      if (response.status === 200) {
        return response.data;
      } else {
        return 'error';
      }
    } catch (error) {
      return 'throwError(error)';
    }
  }
);