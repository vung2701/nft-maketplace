import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

// URL của subgraph đã deploy - cập nhật với subgraph ID thực tế
const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/QmZ4Q9pFFDesiWmuJzjchq7MfKgAjBcUwxbsBCeFEAFMRP'

const httpLink = createHttpLink({
	uri: SUBGRAPH_URL,
})

export const apolloClient = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'cache-and-network',
		},
	},
}) 