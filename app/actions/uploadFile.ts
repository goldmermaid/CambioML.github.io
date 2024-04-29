import axios from 'axios';
import { PresignedResponse } from './apiInterface';
import toast from 'react-hot-toast';
import { AddFileParams } from '../hooks/usePlaygroundStore';

interface IParams {
  api_url: string;
  file: File | undefined;
  token: string;
  clientId: string;
  jobType: string;
  addFilesFormData: (data: PresignedResponse) => void;
  addFiles: ({ files, fileId, jobId, userId }: AddFileParams) => void;
}

interface ConfigParams {
  token: string;
  client_id: string;
  file_name: string;
  job_type: string;
}

interface Config {
  params: ConfigParams;
  headers?: { authorizationToken: string };
}

export const uploadFile = async ({ api_url, file, token, clientId, jobType, addFiles, addFilesFormData }: IParams) => {
  if (!file) {
    toast.error('No file selected');
    return;
  }
  const file_name = file.name;
  const getConfig: Config = {
    params: {
      token: token,
      client_id: clientId,
      file_name: file_name,
      job_type: jobType,
    },
  };

  return await axios
    .get<PresignedResponse>(api_url + '/upload', getConfig)
    .then((response) => {
      const data = response.data as PresignedResponse;
      addFilesFormData(data);
      addFiles({ fileId: '', jobId: '', userId: '', files: file });
    })
    .catch((error) => {
      toast.error(`Error uploading file: ${file.name}. Please try again.`);
      return error;
    });
};
