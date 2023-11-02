import { ChickenCollection, ChickenCreateRequest, Chicken, Schema } from './model';

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

  
export class ChickenStoreAPISdk {
  constructor(
    private readonly caller: Caller,
    private readonly serverLookup?: {environment?: string; basePath?: string; port?: string},
    public readonly servers: Array<{url: string; variables: Record<string, string>}> = [{ url: 'https://api.{environment}.xyz.io/{basePath}', variables: { environment: 'dev',basePath: 'views' } }, { url: 'https://api.xyz.io/{basePath}', variables: { environment: 'prod',basePath: 'views' } }, { url: 'http://localhost:{port}', variables: { environment: 'local',port: '3000' } }]
  ){}
  
    private server(): string {
      if(this.servers.length === 0) return '';
      const server = !this.serverLookup ? this.servers[0] : this.servers.find(it => Object.keys(this.serverLookup!).reduce((result, key) => result && (!(this.serverLookup as any)[key] || it.variables[key] === (this.serverLookup as any)[key]), true as boolean));
      return server ? Object.keys(server.variables).reduce((url, key) => url.replace(`{${key}}`, server.variables[key]), server.url): '';
    }
  
    async getChicken(headers: Record<string, string> = {}): Promise<({ statusCode: 200; result: ChickenCollection }) & {headers: Record<string, string>}>{
      const resource = '/chicken';
      const path = `/chicken`;
      const versionedHeaders = {...headers, ['X-API-VERSION']: '1.0.0' };
      const props: CallerProps = {
        method: 'GET',
        resource,
        path,
        body: undefined,
        pathParameters: {},
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
      }
      throw new Error(`Unknown status ${result.statusCode} returned from ${path}`)
    }

    async createChicken(body: ChickenCreateRequest, headers: Record<string, string> = {}): Promise<({ statusCode: 200; result: string } | { statusCode: 201; result: ChickenCollection } | { statusCode: 400; result: string }) & {headers: Record<string, string>}>{
      const resource = '/chicken';
      const path = `/chicken`;
      const versionedHeaders = {...headers, ['X-API-VERSION']: '1.0.0' };
      const props: CallerProps = {
        method: 'POST',
        resource,
        path,
        body: JSON.stringify(body),
        pathParameters: {},
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
        return { statusCode: 200, headers: result.headers, result: result.body  };
      } else if(result.statusCode === 201) {
        return { statusCode: 201, headers: result.headers, result: JSON.parse(result.body)  };
      } else if(result.statusCode === 400) {
        return { statusCode: 400, headers: result.headers, result: result.body  };
      }
      throw new Error(`Unknown status ${result.statusCode} returned from ${path}`)
    }

    async getChickenByChickenId(params: {chickenId: string}, queryParameters: {someQuery?: string; someOtherQuery?: string}, multiQueryParameters: {someQuery?: string[]; someOtherQuery?: string[]}, headers: Record<string, string> = {}): Promise<({ statusCode: 200; result: Chicken }) & {headers: Record<string, string>}>{
      const resource = '/chicken/{chickenId}';
      const path = `/chicken/${params.chickenId}`;
      const versionedHeaders = {...headers, ['X-API-VERSION']: '1.0.0' };
      const props: CallerProps = {
        method: 'GET',
        resource,
        path,
        body: undefined,
        pathParameters: params,
        queryParameters: queryParameters,
        multiQueryParameters: multiQueryParameters,
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
      }
      throw new Error(`Unknown status ${result.statusCode} returned from ${path}`)
    }

    async updateChicken(params: {chickenId: string}, body: ChickenCreateRequest, queryParameters: {someQuery?: string}, multiQueryParameters: {someQuery?: string[]}, headers: Record<string, string> = {}): Promise<({ statusCode: 200; result: Chicken } | { statusCode: 404; result: string }) & {headers: Record<string, string>}>{
      const resource = '/chicken/{chickenId}';
      const path = `/chicken/${params.chickenId}`;
      const versionedHeaders = {...headers, ['X-API-VERSION']: '1.0.0' };
      const props: CallerProps = {
        method: 'PUT',
        resource,
        path,
        body: JSON.stringify(body),
        pathParameters: params,
        queryParameters: queryParameters,
        multiQueryParameters: multiQueryParameters,
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
      } else if(result.statusCode === 404) {
        return { statusCode: 404, headers: result.headers, result: result.body  };
      }
      throw new Error(`Unknown status ${result.statusCode} returned from ${path}`)
    }

    async deleteChicken(params: {chickenId: string}, headers: Record<string, string> & Partial<{'X-Encryption-Key': string}> = {}): Promise<({ statusCode: 200; result: string }) & {headers: Record<string, string>}>{
      const resource = '/chicken/{chickenId}';
      const path = `/chicken/${params.chickenId}`;
      const versionedHeaders = {...headers, ['X-API-VERSION']: '1.0.0' };
      const props: CallerProps = {
        method: 'DELETE',
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
        return { statusCode: 200, headers: result.headers, result: result.body  };
      }
      throw new Error(`Unknown status ${result.statusCode} returned from ${path}`)
    }

    async getSchema(headers: Record<string, string> = {}): Promise<({ statusCode: 200; result: Schema }) & {headers: Record<string, string>}>{
      const resource = '/schema';
      const path = `/schema`;
      const versionedHeaders = {...headers, ['X-API-VERSION']: '1.0.0' };
      const props: CallerProps = {
        method: 'GET',
        resource,
        path,
        body: undefined,
        pathParameters: {},
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
      }
      throw new Error(`Unknown status ${result.statusCode} returned from ${path}`)
    }
}

export * from './model';
