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
			console.error('Lỗi kết nối The Graph:', error)
			throw new Error('Không thể kết nối đến The Graph. Vui lòng kiểm tra subgraph deployment.')
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