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
  d30 = 2592000,
  d60 = 5184000,
  d90 = 7776000,
  d180 = 15552000,
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

  constructor(config: {
    token: string
    timeout?: number,
  }) {
    const timeout = config.timeout || 3000
    const token = config.token

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

  public async getNotifications(req?: { page?: number }): Promise<{
    notifications: Notification[]
    total: number
  }> {
    const page = req && req.page || 1

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

  public async deleteNotification(req: { notificationID: number }): Promise<void> {
    const id = req.notificationID
    await this.axios.delete(`notifications/${id}`)
  }

  public async getProfile(): Promise<{ profile: Profile }> {
    const resp = await this.axios.get(`member`)
    return {
      profile: resp.data.result as Profile
    }
  }

  public async getToken(): Promise<{ token: Token }> {
    const resp = await this.axios.get(`token`)
    return {
      token: resp.data.result as Token
    }
  }

  public async createToken(req: { scope: TokenScope, expiration: TokenExpiration }): Promise<{
    token: string
  }> {
    const resp = await this.axios.post(`tokens`, req)
    return resp.data.result as { token: string }
  }

  public async getNode(req: { nodeName: string }): Promise<{ node: Node }> {
    const name = req.nodeName
    const resp = await this.axios.get(`nodes/${name}`)
    return {
      node: resp.data.result as Node
    }
  }

  public async getTopicByNode(req: { nodeName: string, page?: number }): Promise<{ topics: Topic[] }> {
    const node = req.nodeName
    const page = req.page || 1
    const resp = await this.axios.get(`nodes/${node}/topics?p=${page}`)
    return {
      topics: resp.data.result as Topic[]
    }
  }

  public async getTopic(req: { topicID: number }): Promise<{ topic: Topic }> {
    const id = req.topicID
    const resp = await this.axios.get(`topics/${id}`)
    return {
      topic: resp.data.result as Topic
    }
  }

  public async getTopicReply(req: { topicID: number, page?: number }): Promise<{ replies: TopicReply[] }> {
    const topicID = req.topicID
    const page = req.page || 1
    const resp = await this.axios.get(`topics/${topicID}/replies?p=${page}`)
    return {
      replies: resp.data.result as TopicReply[]
    }
  }
}
