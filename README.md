# V2EX NodeJS SDK

NodeJS(TypeScript) SDK For V2EX(https://www.v2ex.com)

## Install

```shell
npm i --save @chyroc/v2ex-api
```

### Usage

#### New Client

> get token from https://www.v2ex.com/settings/tokens

```node
import V2EX from "@chyroc/v2ex-api";

const token = process.env.V2EX_TOKEN || ''
const client = new V2EX({token, timeout: 10000})
```

#### Get Notifications

```node
const getNotifications = async (client: V2EX) => {
  const {notifications, total} = await client.getNotifications({page: 1})
  console.log('notifications:', notifications)
  console.log('total:', total)
}
```

#### Delete Notification

```node
const deleteNotification = async (client: V2EX) => {
  await client.deleteNotification({notificationID: 1})
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
  const node = await client.getNode({nodeName: 'python'})
  console.log('node', node)
}
```

#### Get Topic By Node

```node
const getTopicByNode = async (client: V2EX) => {
  const topics = await client.getTopicByNode({nodeName: 'python', page: 2})
  console.log('topics', topics)
}
```

#### Get Topic

```node
const getTopic = async (client: V2EX) => {
  const topic = await client.getTopic({topicID: 1})
  console.log('topic', topic)
}
```

#### Get Topic Reply

```node
const getTopicReply = async (client: V2EX) => {
  const topicReply = await client.getTopicReply({topicID: 1, page: 2})
  console.log('topicReply', topicReply)
}
```

#### Get Plane

```node
const getPlanes = async (client: V2EX) => {
  const plane = await client.getPlanes()
  console.log('plane', plane)
}
```

