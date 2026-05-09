export const Content = `
type Content {
  _id: String!
  creatorId: String
  domainId: String
  title: String
  text: String
  url: String
  score: Int
  created: Date
  creator: Creator
}`;