import { v4 as uuid } from 'uuid';
import md5 from 'md5';
import qs from 'qs';
import axios, {AxiosRequestConfig} from 'axios';


export type CallerProps = {
  method: string;
  resource: string;
  path: string;
  body?: string;
  pathParameters: Record<string, string>;
  queryParameters: Record<string, string>;
  multiQueryParameters: Record<string, string[]>;
  headers: Record<string, string>;
  uri: string;
}

export type Caller = {
  call(props: CallerProps): Promise<{ statusCode: number; body: string; headers: Record<string, string> }>;
}

export function axiosSdkCaller(jwtToken?: string, axiosConfig?: AxiosRequestConfig<any>): Caller {
  return {
    call: async (props: CallerProps) => {
      const updatedHeaders = {
        ...props.headers,
        ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
        ...(jwtToken ? { 'X-Session-Id': md5(jwtToken).toString() } : {}),
        'X-Correlation-Id': uuid(),
      };
      const result = await axios(props.uri + props.path, {
        method: props.method,
        data: props.body,
        paramsSerializer: (params) => qs.stringify(params),
        params: { ...props.queryParameters, ...props.multiQueryParameters },
        headers: updatedHeaders,
        transformResponse: [],
        ...axiosConfig,
      });
      return {
        statusCode: result.status,
        body: result.data,
        headers: result.headers as any,
      };
    },
  };
}
