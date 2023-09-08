export const typedef= `
# CONNECTION TYPEDEFS



type Connections {
   success: Boolean
   data: String
   connections: [User]
   sentAccepted: [User]
   sentPending: [User]
   sentRejected: [User]
   receivedAccepted: [User]
   receivedRejected: [User]
   receivedPending: [User]
}

`