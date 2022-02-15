// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import axios, {AxiosInstance} from 'axios';


export interface Notification {
  id: number;
  member_id: number;
  for_member_id: number;
  text: string;
  payload: null | string;
  payload_rendered: string;
  created: number;
  member: {
    username: string;
  };
}

export default class V2EX {
  axios: AxiosInstance

  constructor(token: string, timeout: number = 1000) {
    this.axios = axios.create({
      baseURL: 'https://www.v2ex.com/api/v2/',
      timeout,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
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
    return {
      notifications: result,
      total,
    }
  }
}