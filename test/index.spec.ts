import { UserApiSdk } from './example-api/sdk';
import { axiosSdkCaller } from '../src';
import axios, { AxiosRequestConfig } from 'axios';

jest.mock('axios');

describe('Index', () => {
  it('should select production variant and invoke axios', async () => {
    (axios as any).mockImplementation((config: AxiosRequestConfig) => {
      if(config.url === 'https://user.api.link-ni.com/account/test-id')
        return Promise.resolve({status: 200, data: '[]'})
      return Promise.resolve({status: 500})
    })
    const sdk = new UserApiSdk(axiosSdkCaller(), { environment: 'prod' });
    expect((await sdk.getAccount({accountId: 'test-id'})).result).toEqual([])
  })
});
