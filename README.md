# V2EX NodeJS SDK

> SDK for https://www.v2ex.com/help/api

## Install

```shell
npm install @chyroc/v2ex-api
```

### Usage

#### New Client

```node
import V2EX from "@chyroc/v2ex-api";

const token = process.env.V2EX_TOKEN || ''
const client = new V2EX(token, {timeout: 10000})
```

#### Get Notifications

```node
const getNotifications = async (client: V2EX, page: number) => {
  const {notifications, total} = await client.getNotifications(page)
  console.log('notifications:', notifications)
  console.log('total:', total)
}
```

#### Delete Notification

```node
const deleteNotification = async (client: V2EX, id: number) => {
  await client.deleteNotification(id)
}
```

#### Get Profile

```node
const getProfile = async (client: V2EX) => {
  const profile = await client.getProfile()
  console.log('profile', profile)
}
```

#### Get Token

```node
const getToken = async (client: V2EX) => {
  const token = await client.getToken()
  console.log('token', token)
}
```

#### Create Token

```node
const createToken = async (client: V2EX) => {
  const token = await client.createToken({
    scope: TokenScope.everything,
    expiration: TokenExpiration.D30,
  })
  console.log('token', token)
}
```

#### Get Node

```node
const getNode = async (client: V2EX) => {
  const node = await client.getNode('python')
  console.log('node', node)
}
```

#### Get Topic By Node

```node
const getTopicByNode = async (client: V2EX) => {
  const topics = await client.getTopicByNode('python',2)
  console.log('topics', topics)
}

```

#### Get Topic

```node
const getTopic = async (client: V2EX) => {
  const topic = await client.getTopic(1)
  console.log('topic', topic)
}
```

#### Get Topic Reply

```node
const getTopicReply = async (client: V2EX) => {
  const topicReply = await client.getTopicReply(1,2)
  console.log('topicReply', topicReply)
}
```

