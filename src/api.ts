// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import axios, {AxiosInstance} from 'axios';


export interface Member {
  id: number;
  username: string;
  bio: string;
  website: string;
  github: string;
  url: string;
  avatar: string;
  created: number;
}

export interface Notification {
  id: number;
  member_id: number;
  for_member_id: number;
  text: string;
  payload: null | string;
  payload_rendered: string;
  created: number;
  member: Member;
}

export interface Profile {
  id: number;
  username: string;
  url: string;
  website: string;
  twitter: string;
  psn: string;
  github: string;
  btc: string;
  location: string;
  tagline: string;
  bio: string;
  avatar_mini: string;
  avatar_normal: string;
  avatar_large: string;
  created: number;
  last_modified: number;
}

export interface Token {
  token: string;
  scope: string;
  expiration: number;
  good_for_days: number;
  total_used: number;
  last_used: number;
  created: number;
}

export enum TokenExpiration {
  D30 = 2592000,
  D60 = 5184000,
  D90 = 7776000,
  D180 = 15552000,
}

export enum TokenScope {
  everything = 'everything',
  regular = 'regular'// 如果是 regular 类型的 Token 将不能用于进一步创建新的 token
}

export interface Node {
  id: number;
  url: string;
  name: string;
  title: string;
  header: string;
  footer: string;
  avatar: string;
  topics: number;
  created: number;
  last_modified: number;
}

export interface Topic {
  id: number;
  title: string;
  content: string;
  content_rendered: string;
  syntax: number;
  url: string;
  replies: number;
  last_reply_by: string;
  created: number;
  last_modified: number;
  last_touched: number;
  member: Member;
  node: Node;
  supplements: any[];
}

export interface TopicReply {
  id: number;
  content: string;
  content_rendered: string;
  created: number;
  member: Member;
}

export default class V2EX {
  axios: AxiosInstance

  constructor(token: string, config: {
    timeout: number,
  }) {
    const timeout = config.timeout || 3000
    this.axios = axios.create({
      baseURL: 'https://www.v2ex.com/api/v2/',
      timeout,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    this.axios.interceptors.response.use(
      response => response,
      error => {
        let success = true
        let message = ''
        try {
          success = error.response.data.success as boolean
          message = error.response.data.message as string
        } catch (e) {
          //
        }

        if (!success && message) {
          throw new Error(message)
        }
        throw error
      }
    )
  }

  public async getNotifications(page: number = 1): Promise<{
    notifications: Notification[]
    total: number
  }> {
    const resp = await this.axios.get(`notifications?p=${page}`)
    const {result, message} = resp.data as { result: Notification[], message: string }
    let total = result && result.length || 0
    try {
      total = +message.split('/', 2)[1]
    } catch (e) {
      //
    }
    return {notifications: result, total,}
  }

  public async deleteNotification(id: number): Promise<void> {
    await this.axios.delete(`notifications/${id}`)
  }

  public async getProfile(): Promise<Profile> {
    const resp = await this.axios.get(`member`)
    return resp.data.result as Profile
  }

  public async getToken(): Promise<Token> {
    const resp = await this.axios.get(`token`)
    return resp.data.result as Token
  }

  public async createToken(req: { scope: TokenScope, expiration: TokenExpiration }): Promise<string> {
    const resp = await this.axios.post(`tokens`, req)
    return resp.data.result.token as string
  }

  public async getNode(name: string): Promise<Node> {
    const resp = await this.axios.get(`nodes/${name}`)
    return resp.data.result as Node
  }

  public async getTopicByNode(node: string, page: number = 1): Promise<Topic[]> {
    const resp = await this.axios.get(`nodes/${node}/topics?p=${page}`)
    return resp.data.result as Topic[]
  }

  public async getTopic(id: number): Promise<Topic> {
    const resp = await this.axios.get(`topics/${id}`)
    return resp.data.result as Topic
  }

  public async getTopicReply(topic: number, page: number = 1): Promise<TopicReply[]> {
    const resp = await this.axios.get(`topics/${topic}/replies?p=${page}`)
    return resp.data.result as TopicReply[]
  }
}
