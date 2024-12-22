import { User } from './model';

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

  
export class UserApiSdk {
  constructor(
    private readonly caller: Caller,
    private readonly serverLookup?: {environment?: string; port?: string},
    public readonly servers: Array<{url: string; variables: Record<string, string>}> = [{ url: 'https://user.api.dev.link-ni.com', variables: { environment: 'dev' } }, { url: 'https://user.api.link-ni.com', variables: { environment: 'prod' } }, { url: 'http://localhost:{port}', variables: { environment: 'local',port: '4000' } }]
  ){}
  
    private server(): string {
      if(this.servers.length === 0) return '';
      const server = !this.serverLookup ? this.servers[0] : this.servers.find(it => Object.keys(this.serverLookup!).reduce((result, key) => result && (!(this.serverLookup as any)[key] || it.variables[key] === (this.serverLookup as any)[key]), true as boolean));
      return server ? Object.keys(server.variables).reduce((url, key) => url.replace(`{${key}}`, server.variables[key]), server.url): '';
    }
  
    async getAccount(params: {accountId: string}, headers: Record<string, string> = {}): Promise<({ statusCode: 200; result: User } | { statusCode: 400; result: unknown } | { statusCode: 401; result: string } | { statusCode: 403; result: string }) & {headers: Record<string, string>}>{
      const resource = '/account/{accountId}';
      const path = `/account/${params.accountId}`;
      const versionedHeaders = {...headers, ['X-API-VERSION']: '1.0.0' };
      const props: CallerProps = {
        method: 'GET',
        resource,
        path,
        body: undefined,
        pathParameters: params,
        queryParameters: {},
        multiQueryParameters: {},
        headers: versionedHeaders,
        uri: this.server()
      }
      const result = await this.caller.call(props);
      
      const resultingVersionKey = Object.keys(result.headers ?? {}).find(it => it.toUpperCase() === 'X-API-VERSION');
      if(resultingVersionKey) {
        const resultingVersion = result.headers[resultingVersionKey];
        if(resultingVersion !== '1.0.0') {
          console.warn(`Version returned from ${path} (${resultingVersion}) does not match requested version 1.0.0`);
        }
      }
      if(result.statusCode === 200) {
        return { statusCode: 200, headers: result.headers, result: JSON.parse(result.body)  };
      } else if(result.statusCode === 400) {
        return { statusCode: 400, headers: result.headers, result: JSON.parse(result.body)  };
      } else if(result.statusCode === 401) {
        return { statusCode: 401, headers: result.headers, result: result.body  };
      } else if(result.statusCode === 403) {
        return { statusCode: 403, headers: result.headers, result: result.body  };
      }
      throw new Error(`Unknown status ${result.statusCode} returned from ${path}`)
    }
}

export * from './model';
