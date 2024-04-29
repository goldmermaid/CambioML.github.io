import axios, { AxiosError, AxiosResponse } from 'axios';
import { ExtractState, TransformState } from '../types/PlaygroundTypes';
import pollJobStatus from './pollJobStatus';
import toast from 'react-hot-toast';
import { GetParams, RequestParams } from './apiInterface';

interface IParams {
  apiURL: string;
  jobType: string;
  token: string;
  clientId: string;
  fileId: string;
  sourceType: string;
  selectedFileIndex: number;
  url?: string;
  jobParams?: { [key: string]: string | boolean };
  filename: string;
  handleSuccess: (response: AxiosResponse) => void;
  handleError: (e: AxiosError) => void;
  handleTimeout: () => void;
  updateFileAtIndex: (
    index: number | null,
    property: string,
    value: string | ExtractState | TransformState | File
  ) => void;
}

const JOB_STATE: { [key: string]: string } = {
  file_extraction: 'extractState',
  info_extraction: 'keyValueState',
  qa_generation: 'qaState',
};

const SUCCESS_STATE: { [key: string]: ExtractState | TransformState } = {
  file_extraction: ExtractState.EXTRACTING,
  info_extraction: TransformState.TRANSFORMING,
  qa_generation: TransformState.TRANSFORMING,
};

const FAIL_STATE: { [key: string]: ExtractState | TransformState } = {
  file_extraction: ExtractState.READY,
  info_extraction: TransformState.READY,
  qa_generation: TransformState.READY,
};

const SLEEP_DURATION: { [key: string]: number } = {
  file_extraction: 5000,
  info_extraction: 5000,
  qa_generation: 5000,
};

export const runRequestJob = async ({
  apiURL,
  clientId,
  token,
  fileId,
  jobParams,
  jobType,
  selectedFileIndex,
  sourceType,
  filename,
  url,
  handleError,
  handleSuccess,
  handleTimeout,
  updateFileAtIndex,
}: IParams) => {
  const params: RequestParams = {
    token,
    client_id: clientId,
    files: [{ source_type: sourceType, ...(fileId && { fileId }), ...(url && { url }) }],
    job_type: jobType,
    ...(jobParams && { jobParams }),
  };
  console.log('Running prod request job', params);
  axios
    .post(`${apiURL}/request`, params, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      if (response.status === 200) {
        console.log(response.data);
        toast.success(`${filename} submitted!`);
        updateFileAtIndex(selectedFileIndex, JOB_STATE[jobType], SUCCESS_STATE[jobType]);
        console.log(`Transforming ${filename} | job_id: $${response.data.jobId}`);

        const getParams: GetParams = {
          user_id: response.data.userId,
          job_id: response.data.jobId,
          job_type: jobType,
        };
        setTimeout(() => {
          pollJobStatus({
            api_url: apiURL,
            getParams,
            handleSuccess,
            handleError,
            handleTimeout,
          });
        }, SLEEP_DURATION[jobType]); // Need to delay the polling to give the server time to process the file
      } else {
        toast.error(`Error uploading ${filename}. Please try again.`);
        updateFileAtIndex(selectedFileIndex, JOB_STATE[jobType], FAIL_STATE[jobType]);
      }
    })
    .catch((error) => {
      console.error('error', error);
      toast.error(`Error uploading ${filename}. Please try again.`);
      updateFileAtIndex(selectedFileIndex, JOB_STATE[jobType], FAIL_STATE[jobType]);
    });
};
