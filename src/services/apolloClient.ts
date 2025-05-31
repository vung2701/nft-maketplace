import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

// URL của subgraph đã deploy - cập nhật với subgraph ID thực tế
// Để sử dụng URL này, bạn cần deploy subgraph của mình lên The Graph Studio
// Hiện tại đây là URL demo - thay thế bằng URL subgraph thực tế của bạn
const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/971787413b95ff8fcd7b0d845dfeb64b/nft-marketplace/v0.0.1'

const httpLink = createHttpLink({
	uri: SUBGRAPH_URL,
	// Thêm headers và error handling
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