import {createAsyncThunk} from "@reduxjs/toolkit";
import {axiosGraphRequest} from "../../api/ApiConfig";


export const fetchAllCharts = createAsyncThunk(
  'chart/fetchAllCharts',
  async (userData) => {
    try {
      const response = await axiosGraphRequest.get(`/api/v1/get_all_client_object`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw new Error('fetchPostLogOut error');
    }
  }
);

export const fetchChartById = createAsyncThunk(
  'chart/fetchChartById',
  async (id) => {
    try {
      const response = await axiosGraphRequest.get(`/api/v1/get_client_objects?id=${id}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw new Error('fetchPostLogOut error');
    }
  }
);

export const patchChartById = createAsyncThunk(
  'chart/patchChartById',
  async (graphData) => {
    try {
      const response = await axiosGraphRequest.patch(`/api/v1/update_client_object`,graphData);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw new Error('fetchPostLogOut error');
    }
  }
);

export const fetchAllClients = createAsyncThunk(
  'chart/fetchAllClients',
  async (userData) => {
    try {
      const response = await axiosGraphRequest.get(`/api/v2/echart_graphs/get_clients`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw new Error('fetchAllClients error');
    }
  }
);
export const fetchAllReports = createAsyncThunk(
  'chart/fetchAllReports',
  async (clientId) => {
    try {
      const response = await axiosGraphRequest.get(`/api/v2/echart_graphs/get_reports?client_id=${clientId}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw new Error('fetchAllClients error');
    }
  }
);

export const fetchAllGroups = createAsyncThunk(
  'chart/fetchAllGroups',
  async (reportId) => {
    try {
      const response = await axiosGraphRequest.get(`/api/v2/echart_graphs/get_groups?report_id=${reportId}`);
      console.log(response)
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw new Error('fetchAllClients error');
    }
  }
);
export const fetchAllChartsByGroupId = createAsyncThunk(
  'chart/fetchAllChartsByGroupId',
  async (groupId) => {
    try {
      const response = await axiosGraphRequest.get(`/api/v2/echart_graphs/get_echart_graphs_from_group?group_id=${groupId}`);
      // console.log(response)
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw new Error('fetchAllClients error');
    }
  }
);
export const fetchAllChartsFormatByGroupId = createAsyncThunk(
  'chart/fetchAllChartsFormatByGroupId',
  async (groupId) => {
    try {
      const response = await axiosGraphRequest.get(`/api/v2/echart_graphs/get_echart_graphs_formatting_from_group?group_id=${groupId}`);
      // console.log(response)
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw new Error('fetchAllClients error');
    }
  }
);

export const patchChartFormatting = createAsyncThunk(
  'chart/fetchAllChartsFormatByGroupId',
  async (rest) => {
    try {
      const response = await axiosGraphRequest.patch(`/api/v2/echart_graphs/update_echart_graph`,rest);
      // console.log(response)
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw new Error('fetchAllClients error');
    }
  }
);
export const patchGroupById = createAsyncThunk(
  'chart/patchGroupById',
  async (rest) => {
    try {
      const response = await axiosGraphRequest.patch(`/api/v2/echart_graphs/update_echart_group`,rest);
      // console.log(response)
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw new Error('fetchAllClients error');
    }
  }
);

export const postGroup = createAsyncThunk(
  'chart/postGroup',
  async (group) => {
    try {
      const response = await axiosGraphRequest.post(`/api/v2/echart_graphs/create_group`,group);
      // console.log(response)
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw new Error('fetchAllClients error');
    }
  }
);
export const deleteGroupById = createAsyncThunk(
  'chart/deleteGroup',
  async (id) => {
    try {
      const response = await axiosGraphRequest.delete(`/api/v2/echart_graphs/delete_group?group_id=${id}`);
      // console.log(response)
      if (response.status === 200) {
        return id;
      }
    } catch (error) {
      throw new Error('fetchAllClients error');
    }
  }
);