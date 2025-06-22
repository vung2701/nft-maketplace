import { pinataAxios } from './axios';

const axiosInstance = pinataAxios();

const uploadFileToIPFS = async (file: File) => {
	try {
		const formData = new FormData();
		formData.append("file", file);

		const res = await axiosInstance.post("/pinning/pinFileToIPFS", formData);
		// Sử dụng ipfs:// format để IPFSImage component có thể convert đúng
		return `ipfs://${res.data.IpfsHash}`;
	} catch (error) {
		console.error("Upload file failed:", error);
		return null;
	}
}

const uploadMetadataToIPFS = async (metadata: object) => {
	try {
		const res = await axiosInstance.post(
			"/pinning/pinJSONToIPFS",
			metadata,
			{
				headers: {
					"Content-Type": "application/json", // bắt buộc cho JSON
				},
			}
		);
		return `ipfs://${res.data.IpfsHash}`;
	} catch (error) {
		console.error("Upload metadata failed:", error);
		return null;
	}
}

export {
	uploadFileToIPFS, uploadMetadataToIPFS
}