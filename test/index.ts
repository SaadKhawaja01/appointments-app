class Message {
  id: string
  date: Date
  content: string
  sender: string
  recipient: string
}

class ChatRoom {
  id: string
  messages: Message[]
}

const room = new ChatRoom()

const rooms = new Array<ChatRoom>()

rooms.push(room)

localStorage.setItem('roomes', JSON.stringify(rooms))

const message: Message = {
  id: Date.now().toString(),
  date: new Date(),
  content: 'Hello',
  sender: '03067103600',
  recipient: '03027302794'
}

room.messages.push(message)

