import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/112713/nft-marketplace/v0.0.2'

const httpLink = createHttpLink({
	uri: SUBGRAPH_URL,
	fetch: (uri, options) => {
		return fetch(uri, {
			...options,
			headers: {
				...options?.headers,
				'Content-Type': 'application/json',
			},
		}).catch(error => {
			console.log('Lỗi kết nối The Graph:', error)
			throw new Error('The Graph connection error - feature in development')
		})
	}
})

export const apolloClient = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'cache-and-network',
			errorPolicy: 'all'
		},
		query: {
			errorPolicy: 'all'
		}
	},
}) 