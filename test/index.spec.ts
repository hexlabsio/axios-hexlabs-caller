import { ChickenStoreAPISdk } from '../generated/sdk';
import { axiosSdkCaller } from '../src';
import axios from 'axios';

jest.mock('axios');

describe('Index', () => {
  it('should select production variant and invoke axios', async () => {
    (axios as any).mockImplementation((url: any) => {
      if(url === 'https://api.xyz.io/views/chicken')
        return Promise.resolve({status: 200, data: '[]'})
      return Promise.resolve({status: 500})
    })
    const sdk = new ChickenStoreAPISdk(axiosSdkCaller(), { environment: 'prod' });
    expect((await sdk.getChicken()).result).toEqual([])
  })
});
