import {createAsyncThunk} from "@reduxjs/toolkit";
import {axiosClientRequest} from "../../api/ApiConfig";

export const fetchGetAllClients = createAsyncThunk(
  'getAllClients',
  async () => {
    try {
      const response = await axiosClientRequest.get(`api/v1/report_cabinet/get_clients`);
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

export const fetchGetClientReports = createAsyncThunk(
  'getClientReports',
  async (id) => {
    try {
      const response = await axiosClientRequest.get(`api/v1/report_cabinet/get_reports?client_id=${id}`);
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

export const fetchGetGraphs = createAsyncThunk(
  'getGraphs',
  async (id) => {
    try {
      const response = await axiosClientRequest.get(`api/v1/report_cabinet/get_graphs?group_id=${id}`);
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

export const fetchGetGroups = createAsyncThunk(
  'getGroups',
  async (id) => {
    try {
      const response = await axiosClientRequest.get(`api/v1/report_cabinet/get_groups?report_id=${id}`);
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

