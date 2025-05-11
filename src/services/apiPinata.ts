import {  pinataAxios } from './axios';

const axiosInstance = pinataAxios();
  
const uploadFileToIPFS = (file: File) => {
	try {

		const formData = new FormData();
		formData.append("file", file);
	
		const res = axiosInstance.post("pinning/pinFileToIPFS", {
		  headers: {
			Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
		  },
		  body: formData,
		});
		return `ipfs://${res?.IpfsHash}`;
	} catch (error) {
		console.log(error)
	}
  }
  
const uploadMetadataToIPFS = (metadata: object) => {
	try {
		const res = axiosInstance.post("pinning/pinJSONToIPFS", {
		  headers: {
			Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify(metadata),
		});
		return `ipfs://${res.IpfsHash}`;
	} catch (error) {
		console.log(error)
	}
  }
  
  export {
	uploadFileToIPFS, uploadMetadataToIPFS
  }